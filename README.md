# Profile media

Sources for the images in the [profile README](https://github.com/Anthonyy232/Anthonyy232): the hero and one card per project, each light and dark, in `.github/readme/` on `main`.

## Rebuild

From a checkout of `main`:

```bash
git worktree add ../profile-media media
cd ../profile-media
npm ci && npx playwright install chromium
node readme/build.cjs ../Anthonyy232
```

That rewrites all 12 PNGs (1792 px wide, 1280 CSS px at 1.4x) in `../Anthonyy232/.github/readme/`. Commit the changed ones on `main`. No network is needed after the install: the fonts and every input are on this branch.

## Layout

- `readme/build.cjs`: draws the hero and the cards in Chromium. Project names, taglines, accents and the crop of each project hero are at the top.
- `readme/inputs/`: copies of what the cards show from the project repos, so the build doesn't need them on disk.
- `fonts/`: Instrument Serif regular and italic (latin subset), under the SIL Open Font License in `fonts/OFL.txt`.

## Refresh the inputs

When a project's logo or README hero changes, copy the new file over the old one and rebuild:

| Input | Source |
| --- | --- |
| `hare-logo.svg` | [Hare `assets/logo.svg`](https://raw.githubusercontent.com/Anthonyy232/Hare/main/assets/logo.svg) |
| `nagi-logo.svg` | [Nagi `media/AppLogo.svg`](https://raw.githubusercontent.com/Anthonyy232/Nagi/master/media/AppLogo.svg) |
| `paperize-logo.svg` | [Paperize `app/src/main/ic_launcher.svg`](https://raw.githubusercontent.com/Anthonyy232/Paperize/master/app/src/main/ic_launcher.svg) |
| `hotaru-logo-light.svg` | [Hotaru `branding/hotaru-symbol-on-light.svg`](https://raw.githubusercontent.com/Anthonyy232/Hotaru/main/branding/hotaru-symbol-on-light.svg) |
| `hotaru-logo-dark.svg` | [Hotaru `branding/hotaru-symbol.svg`](https://raw.githubusercontent.com/Anthonyy232/Hotaru/main/branding/hotaru-symbol.svg) |
| `modernlrc-logo.svg` | [ModernLrcParser `assets/logo.svg`](https://raw.githubusercontent.com/Anthonyy232/ModernLrcParser/main/assets/logo.svg) |
| `<project>-hero-<light\|dark>.png` | `.github/readme/hero-<light\|dark>.png` on each project's default branch, for example [Hare's](https://raw.githubusercontent.com/Anthonyy232/Hare/main/.github/readme/hero-light.png) |

With the project repos cloned side by side, this does all of it:

```bash
export MSYS_NO_PATHCONV=1   # only for Git Bash on Windows
C=..   # folder holding Hare, Nagi, Paperize, Hotaru and ModernLrcParser
I=readme/inputs
git -C $C/Hare show origin/main:assets/logo.svg > $I/hare-logo.svg
git -C $C/Nagi show origin/master:media/AppLogo.svg > $I/nagi-logo.svg
git -C $C/Paperize show origin/master:app/src/main/ic_launcher.svg > $I/paperize-logo.svg
git -C $C/Hotaru show origin/main:branding/hotaru-symbol-on-light.svg > $I/hotaru-logo-light.svg
git -C $C/Hotaru show origin/main:branding/hotaru-symbol.svg > $I/hotaru-logo-dark.svg
git -C $C/ModernLrcParser show origin/main:assets/logo.svg > $I/modernlrc-logo.svg
for p in Hare:main:hare Nagi:master:nagi Paperize:master:paperize Hotaru:main:hotaru ModernLrcParser:main:modernlrc; do
  IFS=: read r b n <<< "$p"
  for t in light dark; do git -C $C/$r show "origin/$b:.github/readme/hero-$t.png" > $I/$n-hero-$t.png; done
done
```

The crops in `build.cjs` are in the hero's 1280 px layout space; if a hero's layout moves, adjust that project's `crop` (`x`, `y`, scale `s`).
