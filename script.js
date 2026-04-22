// Win-Hello animation — 1:1 port of the original CodePen using GSAP 3 + MorphSVGPlugin.
gsap.registerPlugin(MorphSVGPlugin);

const mainCtr = "#main-ctr";
const hello = ".hello";
const eyeLeft = "#eye-left";
const eyeRight = "#eye-right";
const smile = "#smile";
const smileDown = "#smile-down";

// Capture original SVG path data so we can restore it on every loop.
const origSmileDown = document.querySelector(smileDown).getAttribute("d");
const origEyeLeft = document.querySelector(eyeLeft).getAttribute("d");
const origEyeRight = document.querySelector(eyeRight).getAttribute("d");

gsap.set([mainCtr, hello], { opacity: 0 });

function buildTimeline() {
  // Reset any morph/transform state from the previous run.
  gsap.set(smileDown, { attr: { d: origSmileDown } });
  gsap.set(eyeLeft, { attr: { d: origEyeLeft } });
  gsap.set(eyeRight, { attr: { d: origEyeRight }, scaleY: 1 });
  gsap.set(smile, { rotation: 0, transformOrigin: "center center" });
  gsap.set([mainCtr, hello], { opacity: 0 });

  const tl = gsap.timeline({
    delay: 0.3,
    onComplete: () => {
      // Pause briefly, then rebuild and play again — guarantees a clean reset each loop.
      gsap.delayedCall(0.3, buildTimeline);
    },
  });

  tl.to(mainCtr, { duration: 0.3, opacity: 1 })
    .to(smileDown, { duration: 0.3, morphSVG: "#smile-up" })
    .to(smile, { duration: 0.3, rotation: -30, transformOrigin: "center center", ease: "circ.out" })
    .to(smile, { duration: 0.9, rotation: 900, transformOrigin: "center center", ease: "circ.inOut" })
    .to(eyeLeft, { duration: 0.3, morphSVG: "#eye-to-left", ease: "power2.out" }, "-=0.3")
    .to(eyeRight, { duration: 0.3, morphSVG: "#eye-to-right", ease: "power2.out" }, "-=0.3")
    .to(eyeRight, { duration: 0.1, scaleY: 0.25, transformOrigin: "center center" })
    .to(eyeRight, { duration: 0.1, scaleY: 1 })
    .to(hello, { duration: 0.3, opacity: 1 }, "-=0.3")
    .to(mainCtr, { duration: 0.6, delay: 1, opacity: 0 });
}

buildTimeline();
