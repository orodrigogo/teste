import { SaleTag02Icon, Search01Icon } from "hugeicons-react";
import {
  Input,
  InputContent,
  InputIcon,
  InputRoot,
} from "../../../components/input";
import { Tag } from "../../../components/tag";
import { cn } from "../../../utils/cn";
import {
  TEXT_BODY_SM_CLASSNAME,
  TEXT_LABEL_MD_CLASSNAME,
  TEXT_SUBTITLE_CLASSNAME,
  TEXT_TITLE_MD_CLASSNAME,
  TEXT_TITLE_SM_CLASSNAME,
} from "../../../utils/tailwindCustomClasses";
import { Select, SelectItem } from "../../../components/select";
import { Button } from "../../../components/button";
import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOwnProducts } from "../../../http/get-own-products";
import { getFormmatedStatus } from "../../../utils/utils";

const status: Record<string, string> = {
  available: "Anunciado",
  sold: "Vendido",
  cancelled: "Desativado",
};

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchValue = searchParams.get("search");
  const statusValue = searchParams.get("status");

  const [value, setValue] = useState<string>(statusValue ?? "");

  const { data } = useQuery({
    queryKey: ["own-products", searchValue, statusValue],
    queryFn: () => getOwnProducts({ search: searchValue, status: statusValue }),
  });

  function handleFiltersSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const search = formData.get("search");

    setSearchParams((state) => {
      if (typeof search === "string" && search.length > 0) {
        state.set("search", search);
      } else {
        state.delete("search");
      }

      if (value) {
        state.set("status", value);
      } else {
        state.delete("status");
      }

      return state;
    });
  }

  return (
    <main className="space-y-10">
      <div className="space-y-2">
        <span className={cn("text-gray-500", TEXT_TITLE_MD_CLASSNAME)}>
          Seus produtos
        </span>

        <p className={cn("text-gray-300", TEXT_BODY_SM_CLASSNAME)}>
          Acesse gerencie a sua lista de produtos à venda
        </p>
      </div>

      <div className="flex items-start gap-6">
        <div className="space-y-10 w-80 bg-white rounded-[20px] p-6">
          <form
            id="filters"
            className="space-y-6"
            onSubmit={handleFiltersSubmit}
          >
            <span className={cn("text-gray-300", TEXT_TITLE_SM_CLASSNAME)}>
              Filtrar
            </span>

            <div className="space-y-5">
              <InputRoot>
                <InputContent>
                  <InputIcon>
                    <Search01Icon className="size-6" />
                  </InputIcon>

                  <Input
                    defaultValue={searchValue ?? undefined}
                    type="text"
                    name="search"
                    placeholder="Pesquisar"
                  />
                </InputContent>
              </InputRoot>

              <Select
                IconComponent={<SaleTag02Icon />}
                label="Status"
                placeholder="Status"
                selectedValue={value}
                setSelectedValue={setValue}
              >
                {Object.keys(status).map((option) => (
                  <SelectItem key={option} value={option}>
                    {status[option]}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </form>

          <Button form="filters" className="w-full justify-center">
            Aplicar filtro
          </Button>
        </div>

        <div className="flex-1 flex flex-wrap gap-4">
          {data ? (
            data.products.map((product) => (
              <Link
                to={`/products/edit/${product.id}`}
                key={product.id}
                className="w-80 bg-white rounded-[20px] p-1 space-y-1 ring ring-transparent hover:ring-blue-base transition-shadow"
              >
                <div className="rounded-2xl overflow-hidden relative">
                  <img
                    className="aspect-[2.24] object-cover"
                    src={product.attachments[0].url}
                    alt={product.title}
                  />

                  <div className="absolute pl-2 top-2 right-2 flex flex-wrap items-center gap-1">
                    <Tag variant={product.status}>
                      {getFormmatedStatus(product.status)}
                    </Tag>
                    <Tag>{product.category.title}</Tag>
                  </div>
                </div>

                <div className="p-3 pb-4 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={cn(
                        "text-gray-400 flex-1",
                        TEXT_SUBTITLE_CLASSNAME
                      )}
                    >
                      {product.title}
                    </span>

                    <span
                      className={cn(
                        "text-gray-500 space-x-1",
                        TEXT_LABEL_MD_CLASSNAME
                      )}
                    >
                      R${" "}
                      <span className={cn(TEXT_TITLE_SM_CLASSNAME)}>
                        {new Intl.NumberFormat("pt-BR", {
                          minimumFractionDigits: 2,
                        }).format(product.priceInCents / 100)}
                      </span>
                    </span>
                  </div>

                  <p
                    className={cn(
                      "text-gray-300 line-clamp-2",
                      TEXT_BODY_SM_CLASSNAME
                    )}
                  >
                    {product.description}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="w-80 h-64 bg-gray-100/40 animate-pulse rounded-[20px] p-1 space-y-1" />
          )}
        </div>
      </div>
    </main>
  );
}
