const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const hpEl = document.getElementById("playerHp");
const bossHpEl = document.getElementById("bossHp");
const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

const WORLD = {
  width: 3200,
  height: 540,
  gravity: 0.58,
};

const COLORS = {
  sky: "#74c0fc",
  clouds: "#d0ebff",
  mountainA: "#4dabf7",
  mountainB: "#339af0",
  platform: "#495057",
  platformTop: "#adb5bd",
  playerMain: "#1971c2",
  playerTrim: "#e9ecef",
  bullet: "#f8f9fa",
  enemy: "#f03e3e",
  boss: "#5f3dc4",
};

const keys = {
  left: false,
  right: false,
  jump: false,
  shoot: false,
};

let state;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function initGame() {
  state = {
    running: true,
    won: false,
    lost: false,
    frame: 0,
    score: 0,
    cameraX: 0,
    shootCooldown: 0,
    hitCooldown: 0,
    bossShootCooldown: 80,
    bullets: [],
    enemyBullets: [],
    particles: [],
    platforms: createPlatforms(),
    player: {
      x: 100,
      y: 320,
      w: 34,
      h: 42,
      vx: 0,
      vy: 0,
      speed: 3.4,
      jumpPower: 12.5,
      onGround: false,
      hp: 28,
      facing: 1,
    },
    enemies: createEnemies(),
    boss: createBoss(),
  };

  setMessage("准备就绪，冲吧！");
  updateHud();
}

function createPlatforms() {
  return [
    { x: 0, y: 470, w: 700, h: 70 },
    { x: 730, y: 430, w: 140, h: 20 },
    { x: 900, y: 390, w: 130, h: 20 },
    { x: 1090, y: 355, w: 120, h: 20 },
    { x: 1270, y: 420, w: 170, h: 20 },
    { x: 1490, y: 470, w: 400, h: 70 },
    { x: 1920, y: 420, w: 130, h: 20 },
    { x: 2100, y: 380, w: 130, h: 20 },
    { x: 2290, y: 340, w: 110, h: 20 },
    { x: 2450, y: 470, w: 750, h: 70 },
  ];
}

function createEnemies() {
  return [
    enemyWalker(560, 430, 520, 680),
    enemyWalker(980, 350, 910, 1030),
    enemyWalker(1340, 380, 1275, 1425),
    enemyWalker(1760, 430, 1500, 1860),
    enemyWalker(2180, 340, 2105, 2230),
    enemyWalker(2640, 430, 2520, 2820),
  ];
}

function enemyWalker(x, y, minX, maxX) {
  return {
    type: "walker",
    x,
    y,
    w: 30,
    h: 40,
    vx: 1.1,
    minX,
    maxX,
    hp: 4,
    alive: true,
    touchDamage: 2,
  };
}

function createBoss() {
  return {
    x: 2930,
    y: 370,
    w: 90,
    h: 100,
    vx: 1.3,
    minX: 2820,
    maxX: 3070,
    hp: 40,
    alive: true,
    touchDamage: 4,
  };
}

function setMessage(text) {
  messageEl.textContent = text;
}

function updateHud() {
  hpEl.textContent = Math.max(0, Math.ceil(state.player.hp));
  bossHpEl.textContent = state.boss.alive ? Math.max(0, Math.ceil(state.boss.hp)) : 0;
  scoreEl.textContent = state.score;
}

function spawnParticles(x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    state.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 4.2,
      vy: (Math.random() - 0.5) * 4.2,
      life: 20 + Math.random() * 10,
      color,
      size: 2 + Math.random() * 2,
    });
  }
}

function shootPlayerBullet() {
  if (state.shootCooldown > 0 || !state.running) return;
  const p = state.player;
  state.bullets.push({
    x: p.x + p.w / 2,
    y: p.y + p.h / 2 - 3,
    w: 12,
    h: 6,
    vx: 8.2 * p.facing,
    damage: 1,
  });
  state.shootCooldown = 13;
}

function shootBossBullet() {
  if (!state.boss.alive || !state.running) return;
  const b = state.boss;
  const p = state.player;
  const dx = p.x - b.x;
  const dy = p.y - b.y;
  const len = Math.max(1, Math.hypot(dx, dy));

  state.enemyBullets.push({
    x: b.x + b.w / 2,
    y: b.y + 35,
    w: 10,
    h: 10,
    vx: (dx / len) * 4,
    vy: (dy / len) * 4,
    damage: 2,
  });
}

function hurtPlayer(damage) {
  if (state.hitCooldown > 0 || !state.running) return;
  state.player.hp -= damage;
  state.hitCooldown = 40;
  spawnParticles(state.player.x + 10, state.player.y + 10, "#ffd43b", 10);

  if (state.player.hp <= 0) {
    state.player.hp = 0;
    state.running = false;
    state.lost = true;
    setMessage("你被击败了，按 R 或点击重新开始。");
  }
}

function applyPlayerInput() {
  const p = state.player;

  if (keys.left && !keys.right) {
    p.vx = -p.speed;
    p.facing = -1;
  } else if (keys.right && !keys.left) {
    p.vx = p.speed;
    p.facing = 1;
  } else {
    p.vx *= 0.72;
    if (Math.abs(p.vx) < 0.1) p.vx = 0;
  }

  if (keys.jump && p.onGround) {
    p.vy = -p.jumpPower;
    p.onGround = false;
  }

  if (keys.shoot) {
    shootPlayerBullet();
  }
}

function movePlayer() {
  const p = state.player;
  p.vy += WORLD.gravity;
  p.x += p.vx;
  p.y += p.vy;

  p.x = clamp(p.x, 0, WORLD.width - p.w);

  p.onGround = false;

  for (const plat of state.platforms) {
    if (p.x + p.w > plat.x && p.x < plat.x + plat.w) {
      if (p.y + p.h >= plat.y && p.y + p.h - p.vy < plat.y) {
        p.y = plat.y - p.h;
        p.vy = 0;
        p.onGround = true;
      }
    }
  }

  if (p.y > WORLD.height + 120) {
    p.hp = 0;
    state.running = false;
    state.lost = true;
    setMessage("掉入深渊了，按 R 重开。");
  }
}

function updateEnemies() {
  for (const e of state.enemies) {
    if (!e.alive) continue;

    e.x += e.vx;
    if (e.x <= e.minX || e.x + e.w >= e.maxX) {
      e.vx *= -1;
    }

    if (aabb(state.player, e)) {
      hurtPlayer(e.touchDamage);
    }
  }

  const b = state.boss;
  if (b.alive) {
    b.x += b.vx;
    if (b.x <= b.minX || b.x + b.w >= b.maxX) {
      b.vx *= -1;
    }

    if (aabb(state.player, b)) {
      hurtPlayer(b.touchDamage);
    }

    state.bossShootCooldown -= 1;
    if (state.bossShootCooldown <= 0) {
      shootBossBullet();
      state.bossShootCooldown = 60;
    }
  }
}

function updateBullets() {
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    const bullet = state.bullets[i];
    bullet.x += bullet.vx;

    if (bullet.x < 0 || bullet.x > WORLD.width) {
      state.bullets.splice(i, 1);
      continue;
    }

    let removed = false;

    for (const e of state.enemies) {
      if (!e.alive) continue;
      if (aabb(bullet, e)) {
        e.hp -= bullet.damage;
        spawnParticles(bullet.x, bullet.y, "#ff8787", 6);
        state.bullets.splice(i, 1);
        removed = true;
        if (e.hp <= 0) {
          e.alive = false;
          state.score += 100;
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, "#ff6b6b", 16);
        }
        break;
      }
    }

    if (removed) continue;

    if (state.boss.alive && aabb(bullet, state.boss)) {
      state.boss.hp -= bullet.damage;
      state.bullets.splice(i, 1);
      spawnParticles(state.boss.x + 20, state.boss.y + 18, "#9775fa", 6);

      if (state.boss.hp <= 0) {
        state.boss.hp = 0;
        state.boss.alive = false;
        state.running = false;
        state.won = true;
        state.score += 1000;
        spawnParticles(state.boss.x + 40, state.boss.y + 40, "#d0bfff", 34);
        setMessage("胜利！你击败了 Boss。按 R 可再战。\n");
      }
    }
  }

  for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
    const bullet = state.enemyBullets[i];
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;

    if (bullet.x < 0 || bullet.x > WORLD.width || bullet.y < -20 || bullet.y > WORLD.height + 20) {
      state.enemyBullets.splice(i, 1);
      continue;
    }

    if (aabb(bullet, state.player)) {
      hurtPlayer(bullet.damage);
      state.enemyBullets.splice(i, 1);
    }
  }
}

function updateParticles() {
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life -= 1;
    if (p.life <= 0) state.particles.splice(i, 1);
  }
}

function updateCamera() {
  const target = state.player.x - canvas.width * 0.35;
  state.cameraX = clamp(target, 0, WORLD.width - canvas.width);
}

function drawBackground() {
  ctx.fillStyle = COLORS.sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = state.cameraX;

  for (let i = 0; i < 7; i++) {
    const x = (i * 380 - (cx * 0.2) % 380) - 130;
    const y = 70 + (i % 2) * 30;
    ctx.fillStyle = COLORS.clouds;
    ctx.fillRect(x, y, 120, 26);
    ctx.fillRect(x + 18, y - 18, 72, 18);
  }

  ctx.fillStyle = COLORS.mountainA;
  for (let i = -1; i < 8; i++) {
    const x = i * 280 - (cx * 0.35 % 280);
    ctx.beginPath();
    ctx.moveTo(x, 430);
    ctx.lineTo(x + 110, 220);
    ctx.lineTo(x + 220, 430);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = COLORS.mountainB;
  for (let i = -1; i < 7; i++) {
    const x = i * 360 - (cx * 0.5 % 360);
    ctx.beginPath();
    ctx.moveTo(x, 470);
    ctx.lineTo(x + 150, 260);
    ctx.lineTo(x + 300, 470);
    ctx.closePath();
    ctx.fill();
  }
}

function drawWorld() {
  const cx = state.cameraX;

  for (const plat of state.platforms) {
    const x = plat.x - cx;
    if (x + plat.w < -4 || x > canvas.width + 4) continue;
    ctx.fillStyle = COLORS.platform;
    ctx.fillRect(x, plat.y, plat.w, plat.h);
    ctx.fillStyle = COLORS.platformTop;
    ctx.fillRect(x, plat.y, plat.w, 6);
  }

  for (const e of state.enemies) {
    if (!e.alive) continue;
    const x = e.x - cx;
    if (x + e.w < -10 || x > canvas.width + 10) continue;
    ctx.fillStyle = COLORS.enemy;
    ctx.fillRect(x, e.y, e.w, e.h);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 6, e.y + 10, 5, 5);
    ctx.fillRect(x + 19, e.y + 10, 5, 5);
  }

  if (state.boss.alive) {
    const b = state.boss;
    const x = b.x - cx;
    ctx.fillStyle = COLORS.boss;
    ctx.fillRect(x, b.y, b.w, b.h);
    ctx.fillStyle = "#e5dbff";
    ctx.fillRect(x + 20, b.y + 20, 14, 12);
    ctx.fillRect(x + 56, b.y + 20, 14, 12);
    ctx.fillStyle = "#33186b";
    ctx.fillRect(x + 30, b.y + 62, 30, 28);
  }

  const p = state.player;
  const px = p.x - cx;
  ctx.fillStyle = COLORS.playerMain;
  ctx.fillRect(px, p.y, p.w, p.h);
  ctx.fillStyle = COLORS.playerTrim;
  ctx.fillRect(px + 6, p.y + 8, p.w - 12, 12);

  if (state.hitCooldown > 0 && (state.frame >> 1) % 2 === 0) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(px, p.y, p.w, p.h);
  }

  ctx.fillStyle = COLORS.bullet;
  for (const bullet of state.bullets) {
    ctx.fillRect(bullet.x - cx, bullet.y, bullet.w, bullet.h);
  }

  ctx.fillStyle = "#ffec99";
  for (const bullet of state.enemyBullets) {
    ctx.fillRect(bullet.x - cx, bullet.y, bullet.w, bullet.h);
  }

  for (const particle of state.particles) {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = Math.max(0, particle.life / 30);
    ctx.fillRect(particle.x - cx, particle.y, particle.size, particle.size);
  }
  ctx.globalAlpha = 1;

  if (!state.boss.alive) {
    ctx.fillStyle = "#e5dbff";
    ctx.font = "700 22px Trebuchet MS";
    ctx.fillText("STAGE CLEAR", 720 - cx, 300);
  }
}

function draw() {
  drawBackground();
  drawWorld();
}

function tick() {
  state.frame += 1;

  if (state.running) {
    applyPlayerInput();
    movePlayer();
    updateEnemies();
    updateBullets();
    updateParticles();
    updateCamera();

    if (state.shootCooldown > 0) state.shootCooldown -= 1;
    if (state.hitCooldown > 0) state.hitCooldown -= 1;
  }

  draw();
  updateHud();
  requestAnimationFrame(tick);
}

function handleKey(code, down) {
  if (code === "ArrowLeft" || code === "KeyA") keys.left = down;
  if (code === "ArrowRight" || code === "KeyD") keys.right = down;
  if (code === "ArrowUp" || code === "KeyW" || code === "Space") keys.jump = down;
  if (code === "KeyJ" || code === "KeyK") keys.shoot = down;

  if (down && code === "KeyR") {
    initGame();
  }
}

window.addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(e.code)) {
    e.preventDefault();
  }
  handleKey(e.code, true);
});

window.addEventListener("keyup", (e) => {
  handleKey(e.code, false);
});

restartBtn.addEventListener("click", () => {
  initGame();
});

for (const btn of document.querySelectorAll(".touch button")) {
  const key = btn.dataset.key;
  const press = (value) => {
    if (key === "left") keys.left = value;
    if (key === "right") keys.right = value;
    if (key === "jump") keys.jump = value;
    if (key === "shoot") keys.shoot = value;
  };

  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    press(true);
  }, { passive: false });

  btn.addEventListener("touchend", (e) => {
    e.preventDefault();
    press(false);
  }, { passive: false });

  btn.addEventListener("mousedown", () => press(true));
  btn.addEventListener("mouseup", () => press(false));
  btn.addEventListener("mouseleave", () => press(false));
}

initGame();
requestAnimationFrame(tick);
