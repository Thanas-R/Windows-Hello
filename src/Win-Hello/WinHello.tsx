import { useEffect, useRef } from "react";
import gsap from "gsap";
import { interpolate } from "flubber";
import "./WinHello.css";

export interface WinHelloProps {
  /** Name shown in "Hello, {name}!" */
  name?: string;
  /** Width of the SVG in px (height scales with aspect ratio). Default 294. */
  size?: number;
  /** Background color of the stage. Default "#000". */
  background?: string;
  /** Text/icon color. Default "#fff". */
  color?: string;
  /** Hello text font-size in px. Default 25. */
  fontSize?: number;
  /** Font family for hello text. */
  fontFamily?: string;
  /** Animation speed multiplier. 1 = original, 2 = twice as fast. Default 1. */
  speed?: number;
  /** Loop the animation forever. Default true. */
  loop?: boolean;
  /** Auto-start on mount. Default true. */
  autoPlay?: boolean;
  /** Make the stage fill its parent instead of full viewport. Default false. */
  fullScreen?: boolean;
  /** Called every time the timeline finishes one cycle. */
  onComplete?: () => void;
}

// Original CodePen path data
const SMILE_DOWN =
  "M238.843 166c-15.863 34.268-50.554 58.04-90.797 58.04-39.62 0-73.857-23.04-90.046-56.453";
const SMILE_UP =
  "M238.797 75.04C222.935 40.772 188.243 17 148 17c-39.62 0-73.857 23.04-90.046 56.453";

const EYE_LEFT =
  "M148 173c29.27 0 53-23.73 53-53s-23.73-53-53-53c-4.956 0-9.753.68-14.303 1.952C111.374 75.194 95 95.685 95 120c0 29.27 23.73 53 53 53z";
const EYE_TO_LEFT =
  "M106 143c12.15 0 22-9.85 22-22s-9.85-22-22-22c-2.028 0-3.992.274-5.857.788C90.836 102.352 84 110.878 84 121c0 12.15 9.85 22 22 22z";

const EYE_RIGHT =
  "M148 173c29.27 0 53-23.73 53-53s-23.73-53-53-53c-4.016 0-7.927.447-11.687 1.293C112.665 73.615 95 94.745 95 120c0 29.27 23.73 53 53 53z";
const EYE_TO_RIGHT =
  "M187 143c12.15 0 22-9.85 22-22s-9.85-22-22-22c-3.286 0-6.404.72-9.204 2.012C170.242 104.496 165 112.136 165 121c0 12.15 9.85 22 22 22z";

export default function WinHello({
  name = "dotpmm",
  size = 294,
  background = "#000",
  color = "#fff",
  fontSize = 25,
  fontFamily = '"Roboto", sans-serif',
  speed = 1,
  loop = true,
  autoPlay = true,
  fullScreen = false,
  onComplete,
}: WinHelloProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ctrRef = useRef<HTMLDivElement>(null);
  const helloRef = useRef<HTMLHeadingElement>(null);
  const smileRef = useRef<SVGGElement>(null);
  const smileDownRef = useRef<SVGPathElement>(null);
  const eyeLeftRef = useRef<SVGPathElement>(null);
  const eyeRightRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const mainCtr = ctrRef.current;
    const hello = helloRef.current;
    const smile = smileRef.current;
    const smileDown = smileDownRef.current;
    const eyeLeft = eyeLeftRef.current;
    const eyeRight = eyeRightRef.current;
    if (!mainCtr || !hello || !smile || !smileDown || !eyeLeft || !eyeRight)
      return;

    // Path interpolators (flubber returns t -> "M..." path string)
    const smileMorph = interpolate(SMILE_DOWN, SMILE_UP, { maxSegmentLength: 2 });
    const eyeLeftMorph = interpolate(EYE_LEFT, EYE_TO_LEFT, { maxSegmentLength: 2 });
    const eyeRightMorph = interpolate(EYE_RIGHT, EYE_TO_RIGHT, { maxSegmentLength: 2 });

    // Reset to start frame
    const reset = () => {
      gsap.set([mainCtr, hello], { opacity: 0 });
      gsap.set(smile, { rotation: 0, transformOrigin: "50% 50%" });
      gsap.set(eyeRight, { scaleY: 1, transformOrigin: "50% 50%" });
      smileDown.setAttribute("d", SMILE_DOWN);
      eyeLeft.setAttribute("d", EYE_LEFT);
      eyeRight.setAttribute("d", EYE_RIGHT);
    };
    reset();

    const tl = gsap.timeline({
      repeat: loop ? -1 : 0,
      repeatDelay: 0.3,
      delay: 0.3,
      paused: !autoPlay,
      timeScale: speed,
      onRepeat: () => onComplete?.(),
      onComplete: () => onComplete?.(),
    });

    // Proxies for tweening 0->1 and writing the morphed `d` attribute
    const smileProxy = { t: 0 };
    const eyeLeftProxy = { t: 0 };
    const eyeRightProxy = { t: 0 };

    tl
      .to(mainCtr, { duration: 0.3, opacity: 1, ease: "power1.out" })
      // morph smile-down -> smile-up
      .to(smileProxy, {
        duration: 0.3,
        t: 1,
        ease: "power2.inOut",
        onUpdate: () => smileDown.setAttribute("d", smileMorph(smileProxy.t)),
      })
      // tilt
      .to(smile, {
        duration: 0.3,
        rotation: -30,
        transformOrigin: "50% 50%",
        ease: "circ.out",
      })
      // 900deg spin
      .to(smile, {
        duration: 0.9,
        rotation: 900,
        transformOrigin: "50% 50%",
        ease: "circ.inOut",
      })
      // morph eyes during last 0.3s of spin
      .to(
        eyeLeftProxy,
        {
          duration: 0.3,
          t: 1,
          ease: "power2.out",
          onUpdate: () => eyeLeft.setAttribute("d", eyeLeftMorph(eyeLeftProxy.t)),
        },
        "-=0.3"
      )
      .to(
        eyeRightProxy,
        {
          duration: 0.3,
          t: 1,
          ease: "power2.out",
          onUpdate: () => eyeRight.setAttribute("d", eyeRightMorph(eyeRightProxy.t)),
        },
        "-=0.3"
      )
      // wink
      .to(eyeRight, { duration: 0.1, scaleY: 0.25, transformOrigin: "50% 50%" })
      .to(eyeRight, { duration: 0.1, scaleY: 1 })
      // hello text
      .to(hello, { duration: 0.3, opacity: 1 }, "-=0.3")
      // fade out
      .to(mainCtr, { duration: 0.6, delay: 1, opacity: 0 })
      // reset for next loop
      .add(() => {
        smileProxy.t = 0;
        eyeLeftProxy.t = 0;
        eyeRightProxy.t = 0;
        smileDown.setAttribute("d", SMILE_DOWN);
        eyeLeft.setAttribute("d", EYE_LEFT);
        eyeRight.setAttribute("d", EYE_RIGHT);
        gsap.set(smile, { rotation: 0 });
        gsap.set(eyeRight, { scaleY: 1 });
      });

    return () => {
      tl.kill();
    };
  }, [loop, autoPlay, speed, onComplete]);

  const rootStyle: React.CSSProperties & Record<string, string> = {
    ["--winhello-bg"]: background,
    ["--winhello-color"]: color,
    ["--winhello-font-size"]: `${fontSize}px`,
    ["--winhello-font"]: fontFamily,
    ...(fullScreen ? {} : { minHeight: "100%" }),
  };

  return (
    <div
      ref={rootRef}
      className="winhello-root"
      style={rootStyle}
      data-fullscreen={fullScreen ? "true" : "false"}
    >
      <div className="winhello-stage" ref={ctrRef}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={(size * 241) / 294}
          viewBox="0 0 294 241"
        >
          <g fill="none" fillRule="evenodd">
            <g ref={smileRef} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <path
                ref={smileDownRef}
                stroke={color}
                strokeWidth="30"
                d={SMILE_DOWN}
                strokeLinecap="round"
              />
            </g>
            <path ref={eyeLeftRef} fill={color} d={EYE_LEFT} />
            <path
              ref={eyeRightRef}
              fill={color}
              d={EYE_RIGHT}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          </g>
        </svg>
        <h1 className="winhello-hello" ref={helloRef}>
          Hello, {name}!
        </h1>
      </div>
    </div>
  );
}
