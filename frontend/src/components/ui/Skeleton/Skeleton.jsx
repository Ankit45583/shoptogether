import "./Skeleton.css";

function Skeleton({ width, height, borderRadius, className = "" }) {
  return (
    <div
      className={["skeleton", className].filter(Boolean).join(" ")}
      style={{ width, height, borderRadius }}
    />
  );
}

export default Skeleton;
