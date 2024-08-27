import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/button";
import {
  FileInputPlaceholder,
  FileInputRoot,
} from "../../../components/file-input";
import {
  Input,
  InputContent,
  InputError,
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
import { ImageUploadIcon } from "hugeicons-react";
import { z } from "zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadImages } from "../../../http/upload-images";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { registerProduct } from "../../../http/register-product";
import { getCategories } from "../../../http/get-categories";
import { queryClient } from "../../../providers/react-query";

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_IMAGE_SIZE = 4; // MB

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

const registerProductForm = z.object({
  title: z.string().min(1, { message: "Título é obrigatório." }),
  image: z
    .custom<FileList>()
    .refine((files) => {
      return Array.from(files ?? []).length !== 0;
    }, "A imagem do produto é obrigatória.")
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

type RegisterProductForm = z.infer<typeof registerProductForm>;

export function NewProduct() {
  const navigate = useNavigate();

  const methods = useForm<RegisterProductForm>({
    resolver: zodResolver(registerProductForm),
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

  const { mutateAsync: registerProductFn } = useMutation({
    mutationFn: registerProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["metrics", "products-published"],
      });
    },
  });

  const { data } = useQuery({
    queryKey: ["products-categories"],
    queryFn: getCategories,
  });

  async function handleRegisterProduct(data: RegisterProductForm) {
    try {
      let images = null;
      if (data.image?.length && data.image.length > 0) {
        const files = new FormData();
        files.append("files", data.image[0]);
        images = await uploadImagesFn({
          files,
        });
      }

      const { product } = await registerProductFn({
        title: data.title,
        description: data.description,
        priceInCents: data.priceInCents,
        attachmentsIds: !images ? [] : [images.attachments[0].id],
        categoryId: data.categoryId,
      });

      const productId = product.id;

      toast.success("Produto criado com sucesso.", {
        action: {
          label: "Ver produto",
          onClick: () => navigate(`/products/edit/${productId}`),
        },
      });
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data.message)
          return toast.error(error.response.data.message);
      }

      console.error(error);
      return toast.error("Erro ao cadastrar produto.");
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  return (
    <main className="space-y-10">
      <div className="space-y-2">
        <h2 className={cn("text-gray-500", TEXT_TITLE_MD_CLASSNAME)}>
          Novo produto
        </h2>

        <span className={cn("text-gray-300", TEXT_BODY_SM_CLASSNAME)}>
          Cadastre um produto para venda no marketplace
        </span>
      </div>

      <FormProvider {...methods}>
        <form
          className="flex items-start gap-6"
          onSubmit={handleSubmit(handleRegisterProduct)}
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
            <span className={cn("text-gray-300", TEXT_TITLE_SM_CLASSNAME)}>
              Dados do produto
            </span>

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
                        R$
                        <Input
                          type="number"
                          {...register("priceInCents")}
                          placeholder="0,00"
                          step={0.01}
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
                    <TextAreaError>{errors.description.message}</TextAreaError>
                  )}
                </TextAreaRoot>

                {data && (
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
                          disabled={disabled}
                          label="Categoria"
                          placeholder="Selecione"
                        >
                          {data.categories.map((category) => (
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
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button disabled={isSubmitting} className="w-full">
                  Salvar e publicar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </main>
  );
}
