import { Feather } from "lucide-react";
import { useEffect, type CSSProperties } from "react";

const candlePositions = [
  { x: 5, y: 18, scale: .82, delay: 0 },
  { x: 9, y: 35, scale: 1.08, delay: -1.7 },
  { x: 94, y: 22, scale: .92, delay: -.8 },
  { x: 97, y: 48, scale: .72, delay: -2.4 },
  { x: 88, y: 72, scale: .78, delay: -1.2 },
];

const runes = ["✦", "☾", "⟡", "⌁", "✧", "◇"];

export function ArcaneAtmosphere() {
  useEffect(() => {
    let frame = 0;
    const updateMagicPosition = (event: PointerEvent) => {
      if (document.documentElement.dataset.theme !== "arcane") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--arcane-pointer-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--arcane-pointer-y", `${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove", updateMagicPosition, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", updateMagicPosition);
      document.documentElement.style.removeProperty("--arcane-pointer-x");
      document.documentElement.style.removeProperty("--arcane-pointer-y");
    };
  }, []);

  return <div className="arcane-atmosphere" aria-hidden="true">
    <div className="arcane-vignette" />
    <div className="arcane-cursor-aura"><i /><i /><i /></div>
    <div className="arcane-arch arcane-arch-left" />
    <div className="arcane-arch arcane-arch-right" />

    <div className="arcane-candles">
      {candlePositions.map((candle, index) => <span
        key={index}
        className="arcane-candle"
        style={{ "--candle-x": `${candle.x}vw`, "--candle-y": `${candle.y}vh`, "--candle-scale": candle.scale, "--candle-delay": `${candle.delay}s` } as CSSProperties}
      ><i className="arcane-flame" /><i className="arcane-wick" /><i className="arcane-wax" /></span>)}
    </div>

    <div className="arcane-floating-book">
      <span className="arcane-book-cover" />
      <span className="arcane-book-pages arcane-book-pages-left"><i /><i /><i /></span>
      <span className="arcane-book-pages arcane-book-pages-right"><i /><i /><i /></span>
      <span className="arcane-book-rune">✦</span>
    </div>

    <div className="arcane-quill"><Feather /><span /></div>

    <div className="arcane-potion">
      <span className="arcane-potion-stopper" />
      <span className="arcane-potion-neck" />
      <span className="arcane-potion-bottle"><i /><i /><i /></span>
    </div>

    <div className="arcane-rune-orbit">
      {runes.map((rune, index) => <span key={rune} style={{ "--rune-index": index } as CSSProperties}>{rune}</span>)}
      <i />
    </div>

    <div className="arcane-winged-key">
      <svg viewBox="0 0 180 80" fill="none">
        <path className="arcane-key-metal" d="M68 43h67m-19 0v13m13-13v9M55 43a14 14 0 1 1-28 0 14 14 0 0 1 28 0Z" />
        <path className="arcane-key-wing" d="M71 38C51 12 25 8 5 17c18 2 29 9 38 20-14-7-26-6-36-1 18 2 32 9 43 19M70 38c21-25 47-29 67-20-18 2-30 9-39 20 14-7 27-6 37-1-18 2-32 9-44 19" />
      </svg>
    </div>

    <div className="arcane-wand">
      <svg viewBox="0 0 190 54" fill="none">
        <path className="arcane-wand-shaft" d="M20 42C66 34 112 24 169 9" />
        <path className="arcane-wand-grip" d="M17 45c-6-1-9-7-5-12 4-4 12-3 16 3l8 2-2 8-17-1Z" />
        <path className="arcane-wand-carving" d="m43 36 7-5 8 1 7-6m82-10 9-8" />
      </svg>
      <span className="arcane-wand-star">✦</span><i /><i /><i /><i />
    </div>

    <div className="arcane-witch-hat">
      <span className="arcane-hat-crown"><i /></span>
      <span className="arcane-hat-band"><i>✧</i></span>
      <span className="arcane-hat-brim" />
      <span className="arcane-hat-dust"><i /><i /><i /></span>
    </div>

    <div className="arcane-crystal-ball">
      <span className="arcane-crystal-glass"><i /><i /><i /></span>
      <span className="arcane-crystal-neck" />
      <span className="arcane-crystal-base" />
    </div>

    <div className="arcane-scroll">
      <span className="arcane-scroll-paper"><i /><i /><i /><strong>✦</strong></span>
      <span className="arcane-scroll-roll arcane-scroll-roll-top" />
      <span className="arcane-scroll-roll arcane-scroll-roll-bottom" />
    </div>

    <div className="arcane-cauldron">
      <span className="arcane-cauldron-rim" />
      <span className="arcane-cauldron-bowl"><i>✦</i></span>
      <span className="arcane-cauldron-leg arcane-cauldron-leg-left" />
      <span className="arcane-cauldron-leg arcane-cauldron-leg-right" />
      <span className="arcane-cauldron-brew"><i /><i /><i /></span>
      <span className="arcane-cauldron-steam"><i /><i /><i /></span>
    </div>

    <div className="arcane-star-map">
      <span /><span /><span /><span /><span /><span />
      <svg viewBox="0 0 260 170"><path d="m16 92 44-39 39 30 46-57 38 61 58-35 42 57" /></svg>
    </div>
  </div>;
}
