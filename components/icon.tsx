type IconProps = {
  name: string;
  className?: string;
  filled?: boolean;
  title?: string;
  size?: number | string;
};

export default function Icon({
  name,
  className = "",
  filled = false,
  title,
  size,
}: IconProps) {
  const ariaProps = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };
  const variantClassName = filled ? "material-symbols-outlined fill-1" : "material-symbols-outlined";
  const style =
    size !== undefined
      ? {
          fontSize: typeof size === "number" ? `${size}px` : size,
          lineHeight: 1,
        }
      : undefined;

  return (
    <span
      {...ariaProps}
      style={style}
      className={`${variantClassName} ${className}`.trim()}
    >
      {name}
    </span>
  );
}
