import { ComponentProps, forwardRef } from "react";
import { cn } from "../utils/cn";
import {
  TEXT_BODY_MD_CLASSNAME,
  TEXT_BODY_XS_CLASSNAME,
} from "../utils/tailwindCustomClasses";
import { AlertCircleIcon } from "hugeicons-react";

interface TextAreaRootProps extends ComponentProps<"div"> {}

export function TextAreaRoot({
  className,
  children,
  ...rest
}: TextAreaRootProps) {
  return (
    <div className={cn("group/root space-y-1.5", className)} {...rest}>
      {children}
    </div>
  );
}

interface TextAreaContentProps extends ComponentProps<"div"> {}

export function TextAreaContent({
  className,
  children,
  ...rest
}: TextAreaContentProps) {
  return (
    <div
      className={cn(
        "group/content border-b border-gray-100 focus-within:border-gray-400 flex items-center justify-between gap-2 h-[108px] w-full",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

interface TextAreaIconProps extends ComponentProps<"div"> {}

export function TextAreaIcon({
  className,
  children,
  ...rest
}: TextAreaIconProps) {
  return (
    <div
      className={cn(
        "text-gray-200 group-has-[textarea:not(:placeholder-shown)]/content:text-orange-base group-has-[div[data-error]]/root:text-danger",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

interface TextAreaProps extends ComponentProps<"textarea"> {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...rest }, ref) => {
    return (
      <textarea
        className={cn(
          "bg-transparent scrollbar-thin w-full h-full pt-3 placeholder-gray-200 text-gray-400 caret-orange-base flex-1 outline-none",
          TEXT_BODY_MD_CLASSNAME,
          className
        )}
        ref={ref}
        {...rest}
      />
    );
  }
);

interface TextAreaErrorProps extends ComponentProps<"div"> {}

export function TextAreaError({
  className,
  children,
  ...rest
}: TextAreaErrorProps) {
  return (
    <div
      data-error
      className={cn(
        "text-danger flex gap-1 items-center leading-none",
        TEXT_BODY_XS_CLASSNAME,
        className
      )}
      {...rest}
    >
      <AlertCircleIcon className="size-4" />
      {children}
    </div>
  );
}
