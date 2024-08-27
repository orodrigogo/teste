import { ComponentProps } from "react";
import { Slot, type AsChildProps } from "./slot.tsx";
import { cn } from "../utils/cn";
import {
  TEXT_ACTION_MD_CLASSNAME,
  TEXT_ACTION_SM_CLASSNAME,
} from "../utils/tailwindCustomClasses";

type Props = AsChildProps<ComponentProps<"button">> & {
  variants?: "primary" | "outline";
  size?: "base" | "sm";
  className?: string;
};

export function Button({
  asChild,
  className,
  children,
  variants = "primary",
  size = "base",
  ...rest
}: Props) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn([
        "rounded-[10px] border border-transparent flex items-center justify-center transition-colors",
        size === "base" && `px-5 py-4 gap-3 ${TEXT_ACTION_MD_CLASSNAME}`,
        size === "sm" && `px-4 py-2.5 gap-2 ${TEXT_ACTION_SM_CLASSNAME}`,
        variants === "primary" &&
          "bg-orange-base hover:enabled:bg-orange-dark disabled:bg-orange-base/50 text-white",
        variants === "outline" &&
          "bg-transparent border-orange-base hover:enabled:border-orange-dark text-orange-base hover:enabled:text-orange-dark disabled:text-orange-base/50 disabled:border-orange-base/50",
        className,
      ])}
      {...rest}
    >
      {children}
    </Comp>
  );
}
