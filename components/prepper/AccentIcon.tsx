import {
  DEFAULT_PREPPER_ACCENT_COLOR,
  DEFAULT_PREPPER_ICON,
  isPrepperAccentColor,
  prepperAccentBadgeClasses,
  prepperIconMap,
} from "@/lib/design/prepperAccents";

export function AccentIcon({
  icon,
  color,
  size = "md",
}: {
  icon?: string;
  color?: string;
  size?: "sm" | "md";
}) {
  const Icon = (icon && prepperIconMap[icon]) || prepperIconMap[DEFAULT_PREPPER_ICON];
  const accent = isPrepperAccentColor(color) ? color : DEFAULT_PREPPER_ACCENT_COLOR;
  const dimensions = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  const iconSize = size === "sm" ? 15 : 18;

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${dimensions} ${prepperAccentBadgeClasses[accent]}`}
    >
      <Icon size={iconSize} strokeWidth={1.75} />
    </span>
  );
}
