export function ArcaneCardHat({ placement = "corner" }: { placement?: "corner" | "safe-corner" | "left-corner" }) {
  return <span className={`arcane-card-hat arcane-card-hat-${placement}`} aria-hidden="true">
    <i className="arcane-card-hat-crown" />
    <i className="arcane-card-hat-band"><b>✦</b></i>
    <i className="arcane-card-hat-brim" />
    <i className="arcane-card-hat-spark arcane-card-hat-spark-one">✧</i>
    <i className="arcane-card-hat-spark arcane-card-hat-spark-two">·</i>
  </span>;
}
