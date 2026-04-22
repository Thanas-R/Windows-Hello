// Win-Hello animation — 1:1 port of the original CodePen using GSAP 3 + MorphSVGPlugin.
// All selectors and timings match the original jQuery/TweenMax source exactly.

gsap.registerPlugin(MorphSVGPlugin);

const mainCtr = "#main-ctr";
const hello = ".hello";
const eyeLeft = "#eye-left";
const eyeRight = "#eye-right";
const smile = "#smile";
const smileDown = "#smile-down";

gsap.set([mainCtr, hello], { opacity: 0 });

const tl = gsap.timeline({
  repeat: -1,
  repeatDelay: 0.3,
  delay: 0.3,
});

tl
  .to(mainCtr, { duration: 0.3, opacity: 1 })
  .to(smileDown, { duration: 0.3, morphSVG: "#smile-up" })
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
  .to(eyeLeft, { duration: 0.3, morphSVG: "#eye-to-left", ease: "power2.out" }, "-=0.3")
  .to(eyeRight, { duration: 0.3, morphSVG: "#eye-to-right", ease: "power2.out" }, "-=0.3")
  .to(eyeRight, { duration: 0.1, scaleY: 0.25, transformOrigin: "center center" })
  .to(eyeRight, { duration: 0.1, scaleY: 1 })
  .to(hello, { duration: 0.3, opacity: 1 }, "-=0.3")
  .to(mainCtr, { duration: 0.6, delay: 1, opacity: 0 });
