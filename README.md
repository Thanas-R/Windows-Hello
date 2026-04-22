# Win-Hello

A 1:1 recreation of the Windows Hello sign-in animation, ported from the original CodePen by pulkitsvm. Pure HTML, CSS, and JavaScript. No build step. No framework.

## Files

```
.
├── index.html   Markup with the SVG and script tags
├── style.css    Styles (black background, centered stage, Roboto)
└── script.js    GSAP 3 + MorphSVGPlugin timeline
```

That is the entire project. Three files.

## Run it locally in VS Code with Live Server

1. Install the "Live Server" extension by Ritwick Dey.
2. Open this folder in VS Code.
3. Right-click `index.html` and choose "Open with Live Server".
4. Your browser opens at `http://127.0.0.1:5500` and the animation plays.

You can also just double-click `index.html` to open it in any browser. Live Server is only needed if you want auto-reload while editing.

## How it works

The animation is identical to the CodePen. GSAP 3 drives a single repeating timeline, and the free mirror of MorphSVGPlugin handles the smile-down to smile-up morph and the two eye morphs. Timings, easings, and overlaps all match the original TweenMax code exactly.

The two libraries are loaded from public CDNs in `index.html`:

- `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js`
- `https://assets.codepen.io/16327/MorphSVGPlugin3.min.js`

## Customize

- Change the name shown: edit the text inside `<h1 class="hello">` in `index.html`.
- Change colors: edit `style.css` (`background` on `body`, `color` on `.hello`, and `stroke`/`fill` attributes on the SVG paths in `index.html`).
- Change speed: at the top of `script.js`, after creating the timeline, add `tl.timeScale(1.5);` for faster, `0.5` for slower.
- Play once instead of looping: in `script.js`, change `repeat: -1` to `repeat: 0`.

## Use it in another project

Copy the `<div id="main-ctr">...</div>` block from `index.html`, the contents of `style.css`, and the contents of `script.js` into your own project. Make sure the two `<script>` tags for GSAP and MorphSVGPlugin are loaded before `script.js`.
