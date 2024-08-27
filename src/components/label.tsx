import { ComponentProps } from "react";
import { cn } from "../utils/cn";
import { TEXT_LABEL_MD_CLASSNAME } from "../utils/tailwindCustomClasses";

interface Props extends ComponentProps<"label"> {}

export function Label({ className, children, ...rest }: Props) {
  return (
    <label
      className={cn(
        "select-none flex flex-col text-gray-300 focus-within:text-orange-base",
        TEXT_LABEL_MD_CLASSNAME,
        className
      )}
      {...rest}
    >
      {children}
    </label>
  );
}
