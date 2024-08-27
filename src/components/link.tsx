import { cn } from "../utils/cn";
import { TEXT_ACTION_SM_CLASSNAME } from "../utils/tailwindCustomClasses";
import { ComponentProps } from "react";

interface Props extends ComponentProps<"button"> {}

export function Link({ children, className, ...rest }: Props) {
  return (
    <button
      className={cn(
        "flex gap-2 items-center justify-between p-0.5 text-orange-base hover:enabled:text-orange-dark transition-colors disabled:text-orange-base/50",
        TEXT_ACTION_SM_CLASSNAME,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
