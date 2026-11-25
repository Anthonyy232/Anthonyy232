// node readme/build.cjs <profile checkout> : hero + one card per project (light/dark) into .github/readme/
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('usage: node readme/build.cjs <path to a checkout of main>');
const out = path.join(repo, '.github/readme');
const root = path.join(__dirname, '..');
const input = f => path.join(__dirname, 'inputs', f);
const dataUri = (f, type) => `data:${type};base64,${fs.readFileSync(f).toString('base64')}`;
const svg = f => fs.readFileSync(input(f), 'utf8').replace(/<title[^>]*>.*?<\/title>/s, '').replace(/<svg([^>]*?) width="\d+" height="\d+"/, '<svg$1');
const font = (style, file) => `@font-face { font-family: 'Instrument Serif'; font-style: ${style}; font-weight: 400;
  src: url(${dataUri(path.join(root, 'fonts', file), 'font/woff2')}) format('woff2'); }`;

const projects = [
  { id: 'nagi', name: 'Nagi', logo: () => svg('nagi-logo.svg'), accent: ['#26854d', '#63c488'],
    title: 'a <i>calm</i> home<br>for your music', line: 'A fast, private music player for your local library, with Navidrome and Jellyfin streaming.',
    tag: 'Desktop app · Windows 10 and 11', crop: { s: 0.62, x: 150, y: 440 } },
  { id: 'hotaru', name: 'Hotaru', logo: dark => svg(`hotaru-logo-${dark ? 'dark' : 'light'}.svg`), accent: ['#b85a0e', '#ffbe7a'],
    title: 'your library,<br>on a <i>giant</i> screen', line: 'A Jellyfin app: browse in a window, then watch in an immersive cinema.',
    tag: 'Headset app · Meta Quest 3 and 3S', crop: { s: 1, x: 150, y: 460 } },
  { id: 'koma', name: 'Koma', logo: () => svg('koma-logo.svg'), accent: ['#d93a24', '#ff8566'],
    title: 'your screen,<br><i>framed</i>', line: 'A screenshot tool: freeze the desktop, drag an area, mark it up, then copy or save it.',
    tag: 'Desktop app · Windows 10 and 11', crop: { s: 1, x: 150, y: 400 } },
  { id: 'paperize', name: 'Paperize', logo: () => svg('paperize-logo.svg'), tile: true, accent: ['#c2255c', '#ff8fb0'],
    title: 'a fresh wallpaper,<br><i>right on time</i>', line: 'Rotates your own albums on the home and lock screen on a schedule, with blur, dim and vignette.',
    tag: 'Android app · Android 12 and newer', crop: { s: 1, x: 340, y: 460 } },
  { id: 'hare', name: 'Hare', logo: () => svg('hare-logo.svg'), accent: ['#2563eb', '#8ab4ff'],
    title: 'any video,<br>at <i>your</i> speed', line: 'Speed control, keyboard shortcuts and two-tab sync for any video or audio on the web.',
    tag: 'Browser extension · Chrome, Firefox, Edge', crop: { s: 1, x: 560, y: 455 } },
  { id: 'modernlrc', name: 'ModernLrc', logo: () => svg('modernlrc-logo.svg'), accent: ['#c2410c', '#ff8a5c'],
    title: 'every lyric,<br><i>on time</i>', line: 'A fast LRC lyrics parser and writer, with word timing, duet voices and diagnostics instead of exceptions.',
    tag: 'Library · .NET 10 and 11 on NuGet', crop: { s: 0.95, x: 170, y: 445 } },
];

const base = (dark, accent) => `<!doctype html><meta charset="utf-8">
<style>
  ${font('normal', 'InstrumentSerif-Regular.woff2')}
  ${font('italic', 'InstrumentSerif-Italic.woff2')}
  :root { --bg: ${dark ? '#171614' : '#f5f3ee'}; --ink: ${dark ? '#edeae3' : '#1c1b18'}; --muted: ${dark ? '#a09b90' : '#615d55'}; --line: ${dark ? '#edeae31f' : '#1c1b181a'}; --accent: ${accent}; }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: transparent; }
  body { width: 1280px; overflow: hidden; color: var(--ink); font-family: system-ui, 'Segoe UI', sans-serif; }
  .card { position: relative; width: 1280px; overflow: hidden; border-radius: 28px; background: var(--bg); }
  .serif { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; letter-spacing: -0.01em; }
  .serif i { color: var(--accent); }
  .mono { font: 500 15px ui-monospace, 'Cascadia Code', monospace; color: var(--muted); }
  .logo svg { display: block; width: 100%; height: 100%; }
  .tile { border-radius: 22%; overflow: hidden; }
</style>`;

const hero = dark => `${base(dark, 'var(--muted)')}<style>
  .card { height: 470px; text-align: center; }
  .hello { margin-top: 64px; font-size: 22px; color: var(--muted); }
  h1 { margin: 10px 0 0; font-size: 120px; line-height: 1; }
  p { margin: 22px auto 0; max-width: 640px; text-wrap: balance; font-size: 21px; line-height: 1.45; color: var(--muted); }
  .marks { display: flex; justify-content: center; gap: 36px; margin-top: 46px; }
  .marks .logo { width: 44px; height: 44px; }
</style>
<div class="card">
  <div class="hello">Hi there!</div>
  <h1 class="serif">I'm <i>Anthony</i>.</h1>
  <p>I make apps for Windows, Android, the browser and Meta Quest, and a lyrics library for .NET.</p>
  <div class="marks">${projects.map(p => `<div class="logo${p.tile ? ' tile' : ''}">${p.logo(dark)}</div>`).join('')}</div>
</div>`;

// Hero crops are in the project heroes' 1280px CSS space, scaled by s.
const W = 600, H = 304;
const card = (dark, p) => {
  const { s, x, y } = p.crop;
  const shot = dataUri(input(`${p.id}-hero-${dark ? 'dark' : 'light'}.png`), 'image/png');
  return `${base(dark, p.accent[dark ? 1 : 0])}<style>
  .card { height: 360px; }
  .copy { position: absolute; left: 64px; top: 0; bottom: 0; width: 520px; display: flex; flex-direction: column; justify-content: center; }
  .brand { display: flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
  .brand .logo { width: 36px; height: 36px; }
  h2 { margin: 18px 0 0; font-size: 54px; line-height: 1; }
  p { margin: 16px 0 0; font-size: 19px; line-height: 1.45; color: var(--muted); }
  .tag { margin-top: 14px; }
  .stage { position: absolute; right: 28px; top: 28px; width: ${W}px; height: ${H}px; border-radius: 20px; overflow: hidden;
    background: url(${shot}) ${-x * s}px ${-y * s}px / ${1280 * s}px auto no-repeat; box-shadow: inset 0 0 0 1px var(--line); }
</style>
<div class="card">
  <div class="copy">
    <div class="brand"><div class="logo${p.tile ? ' tile' : ''}">${p.logo(dark)}</div>${p.name}</div>
    <h2 class="serif">${p.title}</h2>
    <p>${p.line}</p>
    <div class="mono tag">${p.tag}</div>
  </div>
  <div class="stage"></div>
</div>`;
};

(async () => {
  const browser = await chromium.launch();
  const shoot = async (name, html, height) => {
    const page = await browser.newPage({ viewport: { width: 1280, height }, deviceScaleFactor: 1.4 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    if (!(await page.evaluate(() => document.fonts.check("54px 'Instrument Serif'") && document.fonts.check("italic 54px 'Instrument Serif'"))))
      throw new Error(`Instrument Serif not loaded for ${name}`);
    await page.screenshot({ path: path.join(out, `${name}.png`), omitBackground: true });
    await page.close();
    console.log(`${name}.png`);
  };
  for (const dark of [false, true]) {
    const t = dark ? 'dark' : 'light';
    await shoot(`hero-${t}`, hero(dark), 470);
    for (const p of projects) await shoot(`${p.id}-${t}`, card(dark, p), 360);
  }
  await browser.close();
})();
