import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./WinHello.css";

interface WinHelloProps {
  name?: string;
}

export default function WinHello({ name = "dotpmm" }: WinHelloProps) {
  const ctrRef = useRef<HTMLDivElement>(null);
  const helloRef = useRef<HTMLHeadingElement>(null);
  const smileRef = useRef<SVGGElement>(null);
  const smileUpRef = useRef<SVGPathElement>(null);
  const smileDownRef = useRef<SVGPathElement>(null);
  const eyeLeftRef = useRef<SVGPathElement>(null);
  const eyeRightRef = useRef<SVGPathElement>(null);
  const eyeToLeftRef = useRef<SVGPathElement>(null);
  const eyeToRightRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const mainCtr = ctrRef.current;
    const hello = helloRef.current;
    const smile = smileRef.current;
    const smileUp = smileUpRef.current;
    const smileDown = smileDownRef.current;
    const eyeLeft = eyeLeftRef.current;
    const eyeRight = eyeRightRef.current;
    const eyeToLeft = eyeToLeftRef.current;
    const eyeToRight = eyeToRightRef.current;

    if (
      !mainCtr ||
      !hello ||
      !smile ||
      !smileUp ||
      !smileDown ||
      !eyeLeft ||
      !eyeRight ||
      !eyeToLeft ||
      !eyeToRight
    )
      return;

    // Initial state — mimic original "visibility: hidden" using opacity so GSAP can animate.
    gsap.set([mainCtr, hello], { opacity: 0 });
    gsap.set([smileUp, eyeToLeft, eyeToRight], { opacity: 0 });
    gsap.set(smileDown, { opacity: 1 });
    gsap.set([eyeLeft, eyeRight], { opacity: 1 });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3, delay: 0.3 });

    tl
      // fade in
      .to(mainCtr, { duration: 0.3, opacity: 1 })
      // "morph" smileDown -> smileUp by crossfading the two paths
      .to(smileDown, { duration: 0.3, opacity: 0 })
      .to(smileUp, { duration: 0.3, opacity: 1 }, "<")
      // tilt smile then spin
      .to(smile, {
        duration: 0.3,
        rotation: -30,
        transformOrigin: "center center",
        ease: "circ.out",
      })
      .to(smile, {
        duration: 0.9,
        rotation: 900,
        transformOrigin: "center center",
        ease: "circ.inOut",
      })
      // shrink the big eyes into the small "looking" eyes
      .to(eyeLeft, { duration: 0.3, opacity: 0, ease: "power2.out" }, "-=0.3")
      .to(eyeToLeft, { duration: 0.3, opacity: 1, ease: "power2.out" }, "<")
      .to(eyeRight, { duration: 0.3, opacity: 0, ease: "power2.out" }, "<")
      .to(eyeToRight, { duration: 0.3, opacity: 1, ease: "power2.out" }, "<")
      // wink the right eye
      .to(eyeToRight, {
        duration: 0.1,
        scaleY: 0.25,
        transformOrigin: "center center",
      })
      .to(eyeToRight, { duration: 0.1, scaleY: 1 })
      // show hello text
      .to(hello, { duration: 0.3, opacity: 1 }, "-=0.3")
      // fade everything out, then loop resets
      .to(mainCtr, { duration: 0.6, delay: 1, opacity: 0 })
      // reset visuals back to starting frame for the next loop
      .set([smileUp, eyeToLeft, eyeToRight], { opacity: 0 })
      .set([smileDown, eyeLeft, eyeRight], { opacity: 1 })
      .set(smile, { rotation: 0 })
      .set(eyeToRight, { scaleY: 1 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="winhello-root">
      <div id="main-ctr" ref={ctrRef}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="294"
          height="241"
          viewBox="0 0 294 241"
        >
          <g id="group" fill="none" fillRule="evenodd">
            <g id="smile" ref={smileRef}>
              <path
                id="smile-up"
                ref={smileUpRef}
                stroke="#FFF"
                strokeWidth="30"
                d="M238.797 75.04C222.935 40.772 188.243 17 148 17c-39.62 0-73.857 23.04-90.046 56.453"
                strokeLinecap="round"
              />
              <path
                id="smile-down"
                ref={smileDownRef}
                stroke="#FFF"
                strokeWidth="30"
                d="M238.843 166c-15.863 34.268-50.554 58.04-90.797 58.04-39.62 0-73.857-23.04-90.046-56.453"
                strokeLinecap="round"
              />
              <path
                id="bg"
                fill="#FFF"
                d="M43 2h211v237H43z"
                opacity="0"
              />
            </g>
            <path
              id="eye-left"
              ref={eyeLeftRef}
              fill="#FFF"
              d="M148 173c29.27 0 53-23.73 53-53s-23.73-53-53-53c-4.956 0-9.753.68-14.303 1.952C111.374 75.194 95 95.685 95 120c0 29.27 23.73 53 53 53z"
            />
            <path
              id="eye-right"
              ref={eyeRightRef}
              fill="#FFF"
              d="M148 173c29.27 0 53-23.73 53-53s-23.73-53-53-53c-4.016 0-7.927.447-11.687 1.293C112.665 73.615 95 94.745 95 120c0 29.27 23.73 53 53 53z"
            />
            <path
              id="eye-to-left"
              ref={eyeToLeftRef}
              fill="#FFF"
              d="M106 143c12.15 0 22-9.85 22-22s-9.85-22-22-22c-2.028 0-3.992.274-5.857.788C90.836 102.352 84 110.878 84 121c0 12.15 9.85 22 22 22z"
            />
            <path
              id="eye-to-right"
              ref={eyeToRightRef}
              fill="#FFF"
              d="M187 143c12.15 0 22-9.85 22-22s-9.85-22-22-22c-3.286 0-6.404.72-9.204 2.012C170.242 104.496 165 112.136 165 121c0 12.15 9.85 22 22 22z"
            />
          </g>
        </svg>
        <h1 className="hello" ref={helloRef}>
          Hello, {name}!
        </h1>
      </div>
    </div>
  );
}
