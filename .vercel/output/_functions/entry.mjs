import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DCjMtJNZ.mjs';
import { manifest } from './manifest_BjkSwzgq.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/ai.astro.mjs');
const _page3 = () => import('./pages/api/guestbook.astro.mjs');
const _page4 = () => import('./pages/essays.astro.mjs');
const _page5 = () => import('./pages/essays/_---slug_.astro.mjs');
const _page6 = () => import('./pages/guestbook.astro.mjs');
const _page7 = () => import('./pages/links.astro.mjs');
const _page8 = () => import('./pages/notes.astro.mjs');
const _page9 = () => import('./pages/photography.astro.mjs');
const _page10 = () => import('./pages/play.astro.mjs');
const _page11 = () => import('./pages/work.astro.mjs');
const _page12 = () => import('./pages/work/_---slug_.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about/index.astro", _page1],
    ["src/pages/ai/index.astro", _page2],
    ["src/pages/api/guestbook.ts", _page3],
    ["src/pages/essays/index.astro", _page4],
    ["src/pages/essays/[...slug].astro", _page5],
    ["src/pages/guestbook/index.astro", _page6],
    ["src/pages/links/index.astro", _page7],
    ["src/pages/notes/index.astro", _page8],
    ["src/pages/photography/index.astro", _page9],
    ["src/pages/play/index.astro", _page10],
    ["src/pages/work/index.astro", _page11],
    ["src/pages/work/[...slug].astro", _page12],
    ["src/pages/index.astro", _page13]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "9f66d293-4cd4-4f41-a767-6c14eb0a6006",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
