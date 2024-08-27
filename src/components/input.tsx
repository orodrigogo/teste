import { ComponentProps, forwardRef } from "react";
import { cn } from "../utils/cn";
import { TEXT_BODY_MD_CLASSNAME } from "../utils/tailwindCustomClasses";
import { AlertCircleIcon } from "hugeicons-react";

interface InputRootProps extends ComponentProps<"div"> {}

export function InputRoot({ className, children, ...rest }: InputRootProps) {
  return (
    <div className={cn("group/root space-y-1.5 :mt-80", className)} {...rest}>
      {children}
    </div>
  );
}

interface InputContentProps extends ComponentProps<"div"> {}

export function InputContent({
  className,
  children,
  ...rest
}: InputContentProps) {
  return (
    <div
      className={cn(
        "group/content border-b border-gray-100 focus-within:border-gray-400 flex items-center justify-between gap-2 h-12 w-full",
        TEXT_BODY_MD_CLASSNAME,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

interface InputIconProps extends ComponentProps<"div"> {}

export function InputIcon({ className, children, ...rest }: InputIconProps) {
  return (
    <div
      className={cn(
        "text-gray-200 group-has-[input:not(:placeholder-shown)]/content:text-orange-base group-has-[div[data-error]]/root:text-danger",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

interface InputProps extends ComponentProps<"input"> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        className={cn(
          "bg-transparent placeholder-gray-200 text-gray-400 caret-orange-base flex-1 outline-none",
          TEXT_BODY_MD_CLASSNAME,
          className
        )}
        ref={ref}
        {...rest}
      />
    );
  }
);

interface InputErrorProps extends ComponentProps<"div"> {}

export function InputError({ className, children, ...rest }: InputErrorProps) {
  return (
    <div
      data-error
      className={cn(
        "text-danger flex gap-1 items-center leading-none",
        className
      )}
      {...rest}
    >
      <AlertCircleIcon className="size-4" />
      {children}
    </div>
  );
}
