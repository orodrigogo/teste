import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/button";
import {
  FileInputPlaceholder,
  FileInputRoot,
} from "../../../components/file-input";
import {
  Input,
  InputContent,
  InputError,
  InputIcon,
  InputRoot,
} from "../../../components/input";
import { Label } from "../../../components/label";
import { Select, SelectItem } from "../../../components/select";
import {
  TextArea,
  TextAreaContent,
  TextAreaError,
  TextAreaRoot,
} from "../../../components/textarea";
import { cn } from "../../../utils/cn";
import {
  TEXT_BODY_SM_CLASSNAME,
  TEXT_TITLE_MD_CLASSNAME,
  TEXT_TITLE_SM_CLASSNAME,
} from "../../../utils/tailwindCustomClasses";
import {
  ArrowLeft02Icon,
  ImageUploadIcon,
  Tick02Icon,
  UnavailableIcon,
} from "hugeicons-react";
import { z } from "zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadImages } from "../../../http/upload-images";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { getCategories } from "../../../http/get-categories";
import { editProduct } from "../../../http/edit-product";
import { useRemoteImageAsFileList } from "../../../hooks/useRemoteImageAsFileList";
import { queryClient } from "../../../providers/react-query";
import { Link } from "../../../components/link";
import { updateProductStatus } from "../../../http/update-product-status";
import { getFormmatedStatus, Status } from "../../../utils/utils";
import { Tag } from "../../../components/tag";
import { getProduct } from "../../../http/get-product";

const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/default",
];
const MAX_IMAGE_SIZE = 4; // MB

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

const editProductForm = z.object({
  title: z.string().min(1, { message: "Título é obrigatório." }),
  image: z
    .custom<FileList>()
    .refine((files) => {
      return Array.from(files ?? []).every(
        (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE
      );
    }, `A imagem precisa ser menor do que ${MAX_IMAGE_SIZE}MB`)
    .refine((files) => {
      return Array.from(files ?? []).every((file) =>
        ACCEPTED_IMAGE_TYPES.includes(file.type)
      );
    }, "Tipo de arquivo precisa ser uma imagem PNG ou JPG."),
  priceInCents: z.coerce
    .number()
    .gt(0, { message: "Preço precisa ser positivo." })
    .transform((value) => Math.trunc(value * 100)),
  description: z.string(),
  categoryId: z.string({ required_error: "Categoria é obrigatória." }),
});

type EditProductForm = z.infer<typeof editProductForm>;

export function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    navigate("/");
  }

  const { data: productData } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct({ id: id! }),
  });

  const fileList = useRemoteImageAsFileList({
    id: productData?.product.attachments[0]?.id,
    url: productData?.product.attachments[0]?.url,
  });

  const methods = useForm<EditProductForm>({
    values: {
      categoryId: productData?.product.category.id ?? "",
      description: productData?.product.description ?? "",
      image: fileList,
      priceInCents: productData?.product.priceInCents
        ? productData.product.priceInCents / 100
        : 0,
      title: productData?.product.title ?? "",
    },
    resolver: zodResolver(editProductForm),
  });

  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { isSubmitting, errors },
  } = methods;

  const { mutateAsync: uploadImagesFn } = useMutation({
    mutationFn: uploadImages,
  });

  const { mutateAsync: editProductFn } = useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });

  const { mutateAsync: updateProductStatusFn } = useMutation({
    mutationFn: updateProductStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", id] });
      queryClient.invalidateQueries({
        queryKey: ["metrics", "products-published"],
      });
      queryClient.invalidateQueries({
        queryKey: ["metrics", "products-sold"],
      });
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["products-categories"],
    queryFn: getCategories,
  });

  async function handleEditProduct(data: EditProductForm) {
    try {
      let images = null;

      if (data.image?.length && data.image.length > 0) {
        const files = new FormData();
        files.append("files", data.image[0]);
        images = await uploadImagesFn({
          files,
        });
      } else {
        images = productData?.product;
      }

      await editProductFn({
        id: id!,
        data: {
          title: data.title,
          description: data.description,
          priceInCents: data.priceInCents,
          attachmentsIds: !images ? [] : [images.attachments[0].id],
          categoryId: data.categoryId,
        },
      });

      toast.success("Produto editado com sucesso.");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data.message)
          return toast.error(error.response.data.message);
      }

      console.error(error);
      return toast.error("Erro ao editar produto.");
    }
  }

  async function handleUpdateProductStatus(status: Status) {
    try {
      await updateProductStatusFn({ id: id!, status });

      toast.success("Status do produto editado com sucesso.");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data.message)
          return toast.error(error.response.data.message);
      }

      console.error(error);
      return toast.error("Erro ao editar status do produto.");
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  return (
    <main className="space-y-10">
      <div className="relative flex items-end justify-between gap-6">
        <Link
          onClick={handleCancel}
          className="absolute -top-2 left-0 -translate-y-full flex items-center gap-2"
        >
          <ArrowLeft02Icon />
          Voltar
        </Link>

        <div className="space-y-2">
          <h2 className={cn("text-gray-500", TEXT_TITLE_MD_CLASSNAME)}>
            Editar produto
          </h2>

          <span className={cn("text-gray-300", TEXT_BODY_SM_CLASSNAME)}>
            Gerencie as informações do produto cadastrado
          </span>
        </div>

        <div className="flex items-center gap-4">
          {productData?.product.status &&
          productData.product.status === "available" ? (
            <>
              <Link onClick={() => handleUpdateProductStatus("sold")}>
                <Tick02Icon />
                Marcar como vendido
              </Link>

              <Link onClick={() => handleUpdateProductStatus("cancelled")}>
                <UnavailableIcon />
                Desativar anúncio
              </Link>
            </>
          ) : productData?.product.status &&
            productData.product.status === "sold" ? (
            <>
              <Link onClick={() => handleUpdateProductStatus("available")}>
                <Tick02Icon />
                Marcar como disponível
              </Link>

              <Link disabled>
                <UnavailableIcon />
                Produto vendido
              </Link>
            </>
          ) : (
            productData?.product.status &&
            productData.product.status === "cancelled" && (
              <>
                <Link disabled>
                  <Tick02Icon />
                  Produto desabilitado
                </Link>

                <Link onClick={() => handleUpdateProductStatus("available")}>
                  <UnavailableIcon />
                  Reativar anúncio
                </Link>
              </>
            )
          )}
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleEditProduct)}>
          <fieldset
            disabled={productData?.product.status !== "available"}
            className="flex items-start gap-6"
          >
            <div className="max-w-[26rem] w-full space-y-2">
              <FileInputRoot
                className="w-full aspect-[416/340]"
                {...register("image")}
              >
                <FileInputPlaceholder
                  className={cn(
                    "text-gray-300 flex flex-col items-center text-center gap-4 max-w-40",
                    TEXT_BODY_SM_CLASSNAME
                  )}
                >
                  <ImageUploadIcon className="size-10 text-orange-base" />
                  Selecione a imagem do produto
                </FileInputPlaceholder>
              </FileInputRoot>

              {errors.image && <InputError>{errors.image.message}</InputError>}
            </div>

            <div className="bg-white rounded-[20px] p-8 space-y-8">
              <div className="flex items-center justify-between">
                <span className={cn("text-gray-300", TEXT_TITLE_SM_CLASSNAME)}>
                  Dados do produto
                </span>

                {productData?.product.status && (
                  <Tag variant={productData.product.status}>
                    {getFormmatedStatus(productData.product.status)}
                  </Tag>
                )}
              </div>

              <div className="space-y-10">
                <div className="space-y-5">
                  <div className="flex items-center gap-5">
                    <InputRoot className="flex-2">
                      <Label>
                        Título
                        <InputContent>
                          <Input
                            placeholder="Nome do produto"
                            {...register("title")}
                          />
                        </InputContent>
                      </Label>
                      {errors.title && (
                        <InputError>{errors.title.message}</InputError>
                      )}
                    </InputRoot>

                    <InputRoot className="flex-1">
                      <Label>
                        Valor
                        <InputContent>
                          <InputIcon>R$</InputIcon>
                          <Input
                            type="number"
                            {...register("priceInCents")}
                            placeholder="0,00"
                            step="0.01"
                          />
                        </InputContent>
                      </Label>
                      {errors.priceInCents && (
                        <InputError>{errors.priceInCents.message}</InputError>
                      )}
                    </InputRoot>
                  </div>

                  <TextAreaRoot>
                    <Label>
                      Descrição
                      <TextAreaContent>
                        <TextArea
                          placeholder="Escreva detalhes sobre o produto, tamanho, características"
                          {...register("description")}
                        />
                      </TextAreaContent>
                    </Label>
                    {errors.description && (
                      <TextAreaError>
                        {errors.description.message}
                      </TextAreaError>
                    )}
                  </TextAreaRoot>

                  {categoriesData && (
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({
                        field: { name, onChange, value, disabled },
                      }) => {
                        return (
                          <Select
                            name={name}
                            onValueChange={onChange}
                            selectedValue={value}
                            setSelectedValue={() => resetField("categoryId")}
                            disabled={
                              disabled ||
                              productData?.product.status !== "available"
                            }
                            label="Categoria"
                            placeholder="Selecione"
                          >
                            {categoriesData.categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.title}
                              </SelectItem>
                            ))}
                          </Select>
                        );
                      }}
                    />
                  )}

                  {errors.categoryId && (
                    <InputError>{errors.categoryId.message}</InputError>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    className="w-full"
                    type="button"
                    variants="outline"
                    onClick={handleCancel}
                    disabled={false}
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={
                      isSubmitting ||
                      productData?.product.status !== "available"
                    }
                    className="w-full"
                  >
                    Salvar e atualizar
                  </Button>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </FormProvider>
    </main>
  );
}
