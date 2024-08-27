import * as PrimitiveSelect from "@radix-ui/react-select";
import {
  TEXT_BODY_MD_CLASSNAME,
  TEXT_BODY_SM_CLASSNAME,
} from "../utils/tailwindCustomClasses";
import { ArrowDown01Icon, Cancel01Icon, Tick02Icon } from "hugeicons-react";
import { cn } from "../utils/cn";
import { Label } from "./label";

interface SelectProps extends PrimitiveSelect.SelectProps {
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  classNameTrigger?: string;
  classNameContent?: string;
  label?: string;
  IconComponent?: JSX.Element;
  placeholder?: string;
}

export function Select({
  selectedValue,
  setSelectedValue,
  children,
  classNameContent,
  classNameTrigger,
  onValueChange,
  label,
  IconComponent,
  placeholder,
  ...rest
}: SelectProps) {
  function handleClearStatusFilter() {
    setSelectedValue("");
  }

  function handleValueChange(value: string) {
    setSelectedValue(value);

    if (onValueChange) {
      onValueChange(value);
    }
  }

  return (
    <PrimitiveSelect.Root
      {...rest}
      value={selectedValue}
      onValueChange={handleValueChange}
    >
      <div className="relative flex items-center">
        <PrimitiveSelect.Trigger
          className={cn(
            "group/trigger peer/trigger text-left border-b data-[state='open']:border-gray-400 border-gray-100 w-full outline-none focus:ring-2 ring-orange-base",
            classNameTrigger
          )}
        >
          {label && (
            <Label className="group-data-[state='open']/trigger:text-orange-base">
              {label}
            </Label>
          )}

          <div
            className={cn(
              "px-0.5 py-3.5 flex items-center gap-2",
              TEXT_BODY_MD_CLASSNAME
            )}
          >
            {IconComponent && (
              <div className="size-6 text-orange-base group-data-[state='closed']/trigger:group-data-[placeholder]/trigger:text-gray-200">
                {IconComponent}
              </div>
            )}

            <div className="flex-1 text-left text-gray-400 group-data-[placeholder]/trigger:text-gray-200">
              <PrimitiveSelect.Value
                placeholder={placeholder}
                key={selectedValue}
                className={cn(TEXT_BODY_MD_CLASSNAME)}
                aria-label={selectedValue}
              />
            </div>

            <PrimitiveSelect.Icon>
              <ArrowDown01Icon className="size-6 text-gray-300 group-data-[state='open']/trigger:rotate-180 transition-transform" />
            </PrimitiveSelect.Icon>
          </div>
        </PrimitiveSelect.Trigger>

        <button
          className="absolute right-7 bottom-1 -translate-y-1/2 shrink-0 bg-shape p-1 rounded-full peer-data-[placeholder]/trigger:hidden outline-none focus:ring-2 ring-orange-base"
          onClick={handleClearStatusFilter}
          type="button"
        >
          <Cancel01Icon className="size-4 text-gray-300" />
        </button>
      </div>

      <PrimitiveSelect.Portal>
        <PrimitiveSelect.Content
          position="popper"
          sideOffset={4}
          className={cn("bg-white rounded-lg shadow w-full", classNameContent)}
        >
          <PrimitiveSelect.ScrollUpButton>^</PrimitiveSelect.ScrollUpButton>

          <PrimitiveSelect.Viewport>{children}</PrimitiveSelect.Viewport>

          <PrimitiveSelect.ScrollDownButton>v</PrimitiveSelect.ScrollDownButton>
        </PrimitiveSelect.Content>
      </PrimitiveSelect.Portal>
    </PrimitiveSelect.Root>
  );
}

interface SelectItemProps extends PrimitiveSelect.SelectItemProps {}

export function SelectItem({ className, children, ...rest }: SelectItemProps) {
  return (
    <PrimitiveSelect.Item
      className={cn(
        "outline-none select-none w-[--radix-select-trigger-width] p-4 flex items-center justify-between text-gray-300 hover:data-[state='unchecked']:text-orange-dark focus:data-[state='unchecked']:text-orange-dark data-[state='checked']:text-orange-base",
        TEXT_BODY_SM_CLASSNAME,
        className
      )}
      {...rest}
    >
      <PrimitiveSelect.ItemText>{children}</PrimitiveSelect.ItemText>
      <PrimitiveSelect.ItemIndicator>
        <Tick02Icon className="size-6 text-orange-base" />
      </PrimitiveSelect.ItemIndicator>
    </PrimitiveSelect.Item>
  );
}
