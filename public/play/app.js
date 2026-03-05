/**
 * NES Emulator wrapper around jsnes.
 * This is the "encapsulation layer" requested by the user flow.
 */
class NesEmulator {
  constructor(canvas, statusEl) {
    this.canvas = canvas;
    this.statusEl = statusEl;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.imageData = this.ctx.createImageData(256, 240);
    this.frameBuffer32 = new Uint32Array(this.imageData.data.buffer);

    this.isRunning = false;
    this.romLoaded = false;
    this.loopHandle = null;
    this.cheats = {
      invincible: false,
      infiniteWeaponEnergy: false,
      oneHitKill: false,
    };
    this.cheatStatusText = "";

    const NES = window.jsnes.NES;
    this.nes = new NES({
      onFrame: (frameBuffer) => this.onFrame(frameBuffer),
      onStatusUpdate: (msg) => this.setStatus(msg),
      onAudioSample: () => {},
    });

    this.bindKeyboard();
    this.setStatus("未加载 ROM");
  }

  setStatus(text) {
    this.statusEl.textContent = text;
  }

  onFrame(frameBuffer) {
    for (let i = 0; i < frameBuffer.length; i += 1) {
      this.frameBuffer32[i] = 0xff000000 | frameBuffer[i];
    }
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  async loadRomFromUrl(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`ROM 请求失败: ${res.status}`);
    }
    const buffer = await res.arrayBuffer();
    this.loadRomFromArrayBuffer(buffer);
  }

  loadRomFromArrayBuffer(buffer) {
    const binary = new Uint8Array(buffer);
    let data = "";
    for (let i = 0; i < binary.length; i += 1) {
      data += String.fromCharCode(binary[i]);
    }

    this.stop();
    this.nes.loadROM(data);
    this.romLoaded = true;
    this.setStatus("ROM 已加载，可开始运行");
  }

  start() {
    if (!this.romLoaded) {
      this.setStatus("请先加载 ROM");
      return;
    }
    if (this.isRunning) return;

    this.isRunning = true;
    this.setStatus("运行中");

    const step = () => {
      if (!this.isRunning) return;
      this.applyCheats();
      this.nes.frame();
      this.applyCheats();
      this.loopHandle = requestAnimationFrame(step);
    };

    this.loopHandle = requestAnimationFrame(step);
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.loopHandle) cancelAnimationFrame(this.loopHandle);
    this.loopHandle = null;
    this.setStatus("已暂停");
  }

  reset() {
    this.nes.reset();
    this.setStatus(this.isRunning ? "运行中（已重置）" : "已重置");
  }

  stop() {
    this.pause();
    this.nes.reset();
    this.clearScreen();
    if (this.romLoaded) this.setStatus("已停止");
  }

  clearScreen() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  bindKeyboard() {
    const map = {
      KeyA: [window.jsnes.Controller.BUTTON_LEFT],
      KeyD: [window.jsnes.Controller.BUTTON_RIGHT],
      KeyS: [window.jsnes.Controller.BUTTON_DOWN],
      KeyW: [window.jsnes.Controller.BUTTON_UP, window.jsnes.Controller.BUTTON_A],
      KeyJ: [window.jsnes.Controller.BUTTON_B],
      Enter: [window.jsnes.Controller.BUTTON_START],
      ShiftLeft: [window.jsnes.Controller.BUTTON_SELECT],
      ShiftRight: [window.jsnes.Controller.BUTTON_SELECT],
    };

    const handle = (e, pressed) => {
      const buttons = map[e.code];
      if (!buttons) return;
      e.preventDefault();
      for (const button of buttons) {
        if (pressed) {
          this.nes.buttonDown(1, button);
        } else {
          this.nes.buttonUp(1, button);
        }
      }
    };

    window.addEventListener("keydown", (e) => handle(e, true));
    window.addEventListener("keyup", (e) => handle(e, false));
  }

  applyCheats() {
    const mem = this.nes?.cpu?.mem;
    if (!mem) return;

    if (this.cheats.invincible) {
      // Rockman 1 (NES) RAM addresses:
      // 0x00A6 = lives count, 0x006A = current HP (max 0x1C = 28).
      if (mem[0x00A6] < 9) mem[0x00A6] = 9;
      if (mem[0x006A] < 0x1c) mem[0x006A] = 0x1c;
      // NOTE: Do NOT touch 0x0055 — it is the global frame counter / timer
      // used for enemy animation, movement timing, and game events.
      // Clearing it causes enemies and bosses to move at abnormal speed.
    }

    if (this.cheats.infiniteWeaponEnergy) {
      // Weapon energy: Cut/Ice/Bomb/Fire/Elec/Guts/Magnet Beam.
      for (let addr = 0x006B; addr <= 0x0071; addr += 1) {
        mem[addr] = 0x1c;
      }
    }

    if (this.cheats.oneHitKill) {
      // Boss HP at 0x06C1.
      if (mem[0x06C1] > 1) {
        mem[0x06C1] = 1;
      }
      // Enemy HP slots (0x06C2–0x06C8 covers the active enemy object HP).
      // Using a narrower range to avoid overwriting non-HP game data.
      for (let addr = 0x06C2; addr <= 0x06C8; addr += 1) {
        if (mem[addr] > 1 && mem[addr] <= 0x7f) {
          mem[addr] = 1;
        }
      }
    }
  }

  setCheat(name, enabled) {
    this.cheats[name] = Boolean(enabled);
    const labels = {
      invincible: "无敌模式",
      infiniteWeaponEnergy: "无限武器能量",
      oneHitKill: "一击必杀",
    };
    this.cheatStatusText = `${labels[name]}: ${enabled ? "ON" : "OFF"}`;
    this.setStatus(this.isRunning ? `运行中 | ${this.cheatStatusText}` : `已暂停 | ${this.cheatStatusText}`);
  }
}

const canvas = document.getElementById("screen");
const statusEl = document.getElementById("status");
const romInput = document.getElementById("romInput");

const loadDefaultBtn = document.getElementById("loadDefaultBtn");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const stopBtn = document.getElementById("stopBtn");
const cheatLives = document.getElementById("cheatLives");
const cheatWeapon = document.getElementById("cheatWeapon");
const cheatOneHit = document.getElementById("cheatOneHit");

const emulator = new NesEmulator(canvas, statusEl);

loadDefaultBtn.addEventListener("click", async () => {
  try {
    emulator.setStatus("正在加载 ./roms/rockman.nes ...");
    await emulator.loadRomFromUrl("./roms/rockman.nes");
    emulator.start();
    emulator.setStatus("运行中（已自动开始）。如停在标题画面，请按 Enter。");
  } catch (err) {
    emulator.setStatus(`默认 ROM 加载失败: ${err.message}`);
  }
});

romInput.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    emulator.setStatus(`正在加载 ROM: ${file.name}`);
    const buffer = await file.arrayBuffer();
    emulator.loadRomFromArrayBuffer(buffer);
    emulator.start();
    emulator.setStatus("运行中（已自动开始）。如停在标题画面，请按 Enter。");
  } catch (err) {
    emulator.setStatus(`文件加载失败: ${err.message}`);
  }
});

startBtn.addEventListener("click", () => emulator.start());
pauseBtn.addEventListener("click", () => emulator.pause());
resetBtn.addEventListener("click", () => emulator.reset());
stopBtn.addEventListener("click", () => emulator.stop());
cheatLives.addEventListener("change", (e) => emulator.setCheat("invincible", e.target.checked));
cheatWeapon.addEventListener("change", (e) => emulator.setCheat("infiniteWeaponEnergy", e.target.checked));
cheatOneHit.addEventListener("change", (e) => emulator.setCheat("oneHitKill", e.target.checked));

emulator.clearScreen();

async function autoBootDefaultRom() {
  try {
    emulator.setStatus("正在自动加载 ./roms/rockman.nes ...");
    await emulator.loadRomFromUrl("./roms/rockman.nes");
    emulator.start();
    emulator.setStatus("运行中（已自动加载默认 ROM）。如停在标题画面，请按 Enter。");
  } catch (err) {
    emulator.setStatus(`未自动加载默认 ROM（可手动加载）: ${err.message}`);
  }
}

void autoBootDefaultRom();
