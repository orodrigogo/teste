import { ComponentProps } from "react";
import { cn } from "../utils/cn";
import { TEXT_LABEL_SM_CLASSNAME } from "../utils/tailwindCustomClasses";

interface Props extends ComponentProps<"span"> {
  variant?: "default" | "available" | "sold" | "cancelled";
}

export function Tag({
  variant = "default",
  children,
  className,
  ...rest
}: Props) {
  return (
    <span
      className={cn(
        "rounded-full text-white bg-gray-400 px-2 py-1",
        TEXT_LABEL_SM_CLASSNAME,
        variant === "available" && "bg-blue-dark",
        variant === "sold" && "bg-success",
        variant === "cancelled" && "bg-gray-300",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
