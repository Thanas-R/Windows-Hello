# Win-Hello

A React component that recreates the Windows Hello sign-in animation (smile, spin, eyes morph, wink, then "Hello, name!"). Built with React, GSAP for the timeline, and flubber for real SVG path morphing. No paid plugins required.

## Project structure

```
.
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src
    ├── main.tsx              demo entry, renders <WinHello />
    └── Win-Hello
        ├── index.ts          public export
        ├── WinHello.tsx      the component
        └── WinHello.css      scoped styles
```

The component lives entirely under `src/Win-Hello`. The rest of the repo only exists so you can preview it locally with Vite.

## Running the demo locally

You need Node 18 or newer.

1. Install dependencies:

   ```
   npm install
   ```

2. Start the dev server:

   ```
   npm run dev
   ```

   Vite will open `http://localhost:5173`.

3. Production build (optional):

   ```
   npm run build
   npm run preview
   ```

## Using Win-Hello in another project

Copy the folder `src/Win-Hello` into your own project (for example `src/components/Win-Hello`).

Install the two runtime dependencies in that project:

```
npm install gsap flubber
```

Then import and render it:

```tsx
import WinHello from "./components/Win-Hello";

export default function App() {
  return <WinHello name="dotpmm" />;
}
```

The component ships its own CSS via a side-effect import in `WinHello.tsx`, so you do not have to import any stylesheet manually. Make sure your bundler (Vite, Next.js, CRA, Remix, etc.) supports importing `.css` files from a component, which is the default in all of them.

## Props

All props are optional.

| Prop         | Type       | Default              | Description |
|--------------|------------|----------------------|-------------|
| `name`       | `string`   | `"dotpmm"`           | Name shown in `Hello, {name}!`. |
| `size`       | `number`   | `294`                | Width of the SVG in pixels. Height scales to keep the original aspect ratio. |
| `background` | `string`   | `"#000"`             | Background color of the stage. Any CSS color. |
| `color`      | `string`   | `"#fff"`             | Color of the smile, eyes, and the hello text. |
| `fontSize`   | `number`   | `25`                 | Font size of the hello text in pixels. |
| `fontFamily` | `string`   | `'"Roboto", sans-serif'` | Font family of the hello text. |
| `speed`      | `number`   | `1`                  | Animation speed multiplier. `2` runs the timeline twice as fast, `0.5` runs it half speed. |
| `loop`       | `boolean`  | `true`               | If false, the animation plays once and stops. |
| `autoPlay`   | `boolean`  | `true`               | If false, the timeline is created paused. |
| `fullScreen` | `boolean`  | `false`              | If true, the stage takes the full viewport height. If false, it fills its parent. |
| `onComplete` | `() => void` | `undefined`        | Called every time a cycle finishes. With `loop=true` this fires once per loop. |

## Examples

Default Windows Hello look:

```tsx
<WinHello name="dotpmm" />
```

Bigger, centered in a custom container:

```tsx
<div style={{ height: 600 }}>
  <WinHello name="Alex" size={420} />
</div>
```

Light theme, custom accent color:

```tsx
<WinHello
  name="Sam"
  background="#f5f5f7"
  color="#1d1d1f"
  fontFamily='"Inter", sans-serif'
/>
```

Faster animation, single play, callback when done:

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

The original CodePen used GSAP MorphSVGPlugin, which is a paid Club GSAP plugin. This implementation uses `flubber` to compute path interpolators between the start and end shapes, and a GSAP tween on a numeric proxy from `0` to `1` writes the interpolated `d` attribute on every frame. This gives a true 1-to-1 path morph for the smile and the two eyes, in any browser, without a license.

The timeline order matches the CodePen exactly:

1. Fade the container in.
2. Morph the down smile into the up smile.
3. Tilt the smile to -30 degrees.
4. Spin the smile 900 degrees.
5. During the last 0.3s of the spin, morph both eyes into the small "looking" eyes.
6. Wink the right eye (squash and release).
7. Fade in `Hello, {name}!`.
8. Fade everything out, reset, loop.

## Notes

- All styles are scoped under `.winhello-root` and `.winhello-stage`, so dropping the component into any page will not affect the rest of your layout.
- The Roboto font is loaded once via Google Fonts inside the component CSS. If you already load Roboto, the browser will reuse it.
- The component is SSR safe. The animation effect runs only inside `useEffect`, which never runs on the server.
