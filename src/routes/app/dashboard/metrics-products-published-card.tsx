import { Store04Icon } from "hugeicons-react";
import { cn } from "../../../utils/cn";
import {
  TEXT_BODY_XS_CLASSNAME,
  TEXT_TITLE_LG_CLASSNAME,
} from "../../../utils/tailwindCustomClasses";
import { useQuery } from "@tanstack/react-query";
import { metricsProductsPublished } from "../../../http/metrics-products-published";

export function MetricsProductPublishedCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["metrics", "products-published"],
    queryFn: metricsProductsPublished,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="p-3 rounded-xl bg-white flex items-center gap-4">
      <div className="flex items-center justify-center bg-blue-light rounded-xl w-20 h-[5.375rem]">
        <Store04Icon className="size-10 text-blue-dark" />
      </div>

      <div className="flex flex-col gap-2 max-w-24">
        {isLoading ? (
          <span
            className={cn(
              "bg-gray-100 text-transparent animate-pulse w-full rounded-md",
              TEXT_TITLE_LG_CLASSNAME
            )}
          >
            ...
          </span>
        ) : (
          <span className={cn("text-gray-400", TEXT_TITLE_LG_CLASSNAME)}>
            {data?.amount}
          </span>
        )}
        <span className={cn("text-gray-300", TEXT_BODY_XS_CLASSNAME)}>
          Produtos anunciados
        </span>
      </div>
    </div>
  );
}
