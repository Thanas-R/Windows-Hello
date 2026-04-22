# Win-Hello

A React component that recreates the Windows Hello sign-in animation (smile morph, spin, eye morph, wink, then "Hello, name!"). Built with React, GSAP, and flubber for real SVG path morphing. No paid plugins.

## Files in this project

You only need these files to run the demo locally:

```
.
├── index.html              Vite entry HTML
├── package.json            Scripts and dependencies
├── tsconfig.json           TypeScript config
├── vite.config.ts          Vite config
└── src
    ├── main.tsx            Demo entry, renders <WinHello />
    ├── types.d.ts          Type shim for flubber and CSS imports
    └── Win-Hello
        ├── index.ts        Public export
        ├── WinHello.tsx    The component
        └── WinHello.css    Scoped styles
```

That is the whole project. Nothing else is required.

## Running it locally in VS Code

You need Node.js 18 or newer installed.

1. Open the project folder in VS Code.
2. Open the integrated terminal (View, Terminal).
3. Install dependencies:

   ```
   npm install
   ```

4. Start the dev server:

   ```
   npm run dev
   ```

5. Vite will print a local URL, usually `http://localhost:5173`. Open it in your browser. The animation will play immediately.

Note: the VS Code "Go Live" extension (Live Server) only serves static HTML and will NOT work here, because this project uses TypeScript and JSX which must be compiled. Always use `npm run dev` instead.

To build for production:

```
npm run build
npm run preview
```

`npm run build` outputs static files to `dist/`. `npm run preview` serves that build locally.

## Using Win-Hello in another project

Copy the folder `src/Win-Hello` into your own project (for example `src/components/Win-Hello`).

Install the two runtime dependencies:

```
npm install gsap flubber
```

If your project is TypeScript, also copy `src/types.d.ts` (or add the same `declare module "flubber"` shim somewhere in your types).

Import and render:

```tsx
import WinHello from "./components/Win-Hello";

export default function App() {
  return <WinHello name="dotpmm" />;
}
```

The component imports its own CSS, so you do not need to import a stylesheet manually. Any modern bundler (Vite, Next.js, CRA, Remix) supports this by default.

## Props

All props are optional.

| Prop         | Type         | Default                  | Description |
|--------------|--------------|--------------------------|-------------|
| `name`       | `string`     | `"dotpmm"`               | Name shown in `Hello, {name}!`. |
| `size`       | `number`     | `294`                    | Width of the SVG in pixels. Height scales with aspect ratio. This matches the original CodePen SVG size. |
| `background` | `string`     | `"#000"`                 | Background color of the stage. Any CSS color. |
| `color`      | `string`     | `"#fff"`                 | Color of the smile, eyes, and hello text. |
| `fontSize`   | `number`     | `25`                     | Font size of the hello text in pixels. |
| `fontFamily` | `string`     | `'"Roboto", sans-serif'` | Font family of the hello text. |
| `speed`      | `number`     | `1`                      | Animation speed multiplier. `1` matches the original CodePen timings, `0.5` is half speed, and `2` is twice as fast. |
| `loop`       | `boolean`    | `true`                   | If false, the animation plays once and stops. |
| `autoPlay`   | `boolean`    | `true`                   | If false, the timeline is created paused. |
| `fullScreen` | `boolean`    | `true`                   | If true, the stage is fixed to the full viewport with the chosen background color. |
| `onComplete` | `() => void` | `undefined`              | Called every time a cycle finishes. |

## Examples

Default look:

```tsx
<WinHello name="dotpmm" />
```

Bigger inside a fixed-height container:

```tsx
<div style={{ height: 600 }}>
  <WinHello name="Alex" size={420} />
</div>
```

Light theme:

```tsx
<WinHello
  name="Sam"
  background="#f5f5f7"
  color="#1d1d1f"
  fontFamily='"Inter", sans-serif'
/>
```

Faster, single play, with callback:

```tsx
<WinHello
  name="Jordan"
  speed={1.5}
  loop={false}
  onComplete={() => console.log("done")}
/>
```

Full-screen splash:

```tsx
<WinHello name="Welcome" fullScreen />
```

## How the animation works

The original CodePen uses GSAP MorphSVGPlugin, a paid Club GSAP plugin. This implementation uses `flubber` to build path interpolators between the start and end shapes, and a GSAP tween on a numeric proxy from `0` to `1` writes the interpolated `d` attribute on every frame. This gives a true 1-to-1 path morph for the smile and the two eyes in any browser, without a license.

Timeline order matches the CodePen:

1. Fade the container in.
2. Morph the down smile into the up smile.
3. Tilt the smile to -30 degrees.
4. Spin the smile 900 degrees.
5. During the last 0.3s of the spin, morph both eyes into the small "looking" eyes.
6. Wink the right eye.
7. Fade in `Hello, {name}!`.
8. Fade out, reset, loop.

## Notes

- All styles are scoped under `.winhello-root` and `.winhello-stage`, so the component will not affect the rest of your page.
- Roboto is loaded once via Google Fonts inside the component CSS.
- The component is SSR safe. The animation runs only inside `useEffect`.
- The stage and the hello text both start with inline `opacity: 0`, and the animation setup runs in `useLayoutEffect`, so the component does not flash the wrong shape before GSAP takes control.
- The component now ships with the original CodePen timings by default: fade-in `0.3s`, smile morph `0.3s`, tilt `0.3s`, spin `0.9s`, wink `0.1s + 0.1s`, and fade-out `0.6s` after a `1s` hold.
- The demo entry renders the component without `React.StrictMode` so local preview in Vite does not double-mount the animation during development.
