import {
  ChangeEvent,
  ComponentProps,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { cn } from "../utils/cn";
import { useFormContext } from "react-hook-form";

interface FileInputRootProps extends ComponentProps<"input"> {
  name: string;
}

export const FileInputRoot = forwardRef<HTMLInputElement, FileInputRootProps>(
  ({ className, onChange, children, name, ...rest }, ref) => {
    const { watch, register } = useFormContext();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fieldValue = watch(name);

    function generatePreview(file: File) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setImagePreview(e.target.result);
        }
      };

      reader.readAsDataURL(file);
    }

    useEffect(() => {
      if (fieldValue && fieldValue instanceof FileList && fieldValue[0]) {
        generatePreview(fieldValue[0]);
      } else {
        setImagePreview(null);
      }
    }, [fieldValue]);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
      const file = event.target.files?.[0];

      if (file) {
        generatePreview(file);
      }

      if (onChange) {
        onChange(event);
      }
    }

    return (
      <label
        className={cn(
          "group relative w-[7.5rem] aspect-square overflow-hidden bg-shape rounded-xl flex items-center justify-center ring-1 ring-transparent focus-within:ring-orange-base",
          className
        )}
      >
        <input
          {...register(name)}
          onChange={handleInputChange}
          className="size-0"
          accept="image/*"
          type="file"
          {...rest}
          ref={ref}
        />
        {children}
        {imagePreview && (
          <img
            data-preview
            className="absolute z-10 object-cover w-full h-full"
            src={imagePreview}
          />
        )}
      </label>
    );
  }
);

interface FileInputPlaceholderProps extends ComponentProps<"div"> {}

export function FileInputPlaceholder({
  className,
  children,
  ...rest
}: FileInputPlaceholderProps) {
  return (
    <div className="flex justify-center items-center group-has-[img[data-preview]]:z-20 group-has-[img[data-preview]]:*:text-transparent group-hover:group-has-[img[data-preview]]:*:text-white group-hover:group-has-[img[data-preview]]:bg-[rgba(0,0,0,0.6)] w-full h-full transition-colors">
      <div
        className={cn(
          "group-hover:group-has-[img[data-preview]]:*:text-white group-has-[img[data-preview]]:*:text-transparent *:transition-colors transition-colors",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
}
