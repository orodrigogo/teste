import {
  AccessIcon,
  ArrowRight02Icon,
  CallIcon,
  ImageUploadIcon,
  Loading01Icon,
  Mail02Icon,
  UserIcon,
  ViewIcon,
} from "hugeicons-react";
import {
  Input,
  InputContent,
  InputError,
  InputIcon,
  InputRoot,
} from "../../components/input";
import { Label } from "../../components/label";
import { useState } from "react";
import { Button } from "../../components/button";
import {
  TEXT_BODY_MD_CLASSNAME,
  TEXT_BODY_SM_CLASSNAME,
  TEXT_TITLE_MD_CLASSNAME,
  TEXT_TITLE_SM_CLASSNAME,
} from "../../utils/tailwindCustomClasses";
import { cn } from "../../utils/cn";
import { Link, useNavigate } from "react-router-dom";
import {
  FileInputPlaceholder,
  FileInputRoot,
} from "../../components/file-input";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { signUp } from "../../http/sign-up";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadImages } from "../../http/upload-images";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_IMAGE_SIZE = 4; //In MegaBytes

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

const signUpForm = z
  .object({
    name: z.string().min(1, { message: "O nome é obrigatório." }),
    avatar: z
      .custom<FileList>()
      .optional()
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
    phone: z.string().min(1, { message: "O telefone é obrigatório." }),
    email: z.string().email("Informe um e-mail válido."),
    password: z
      .string()
      .min(8, { message: "A senha precisa ter no mínimo 8 caracteres." }),
    passwordConfirmation: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem.",
        path: ["passwordConfirmation"],
      });
    }
  });

type SignUpForm = z.infer<typeof signUpForm>;

export function SignUp() {
  const navigate = useNavigate();

  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const methods = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const { mutateAsync: uploadImagesFn } = useMutation({
    mutationFn: uploadImages,
  });

  const { mutateAsync: signUpFn } = useMutation({
    mutationFn: signUp,
  });

  async function handleSignUp(data: SignUpForm) {
    try {
      let avatars = null;
      if (data.avatar?.length && data.avatar.length > 0) {
        const files = new FormData();
        files.append("files", data.avatar[0]);
        avatars = await uploadImagesFn({
          files,
        });
      }

      await signUpFn({
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatarId: avatars?.attachments[0].id ?? null,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      });

      toast.success("Usuário cadastrado com sucesso.", {
        action: {
          label: "Sign in",
          onClick: () => navigate("/sign-in"),
        },
      });
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data.message)
          return toast.error(error.response.data.message);
      }
      return toast.error("Erro ao cadastrar usuário.");
    }
  }

  function handleShownNewPassword() {
    setIsNewPasswordVisible((state) => !state);
  }

  function handleShownConfirmPassword() {
    setIsConfirmPasswordVisible((state) => !state);
  }

  return (
    <main className="flex flex-col gap-20 h-full justify-between px-20 py-[4.5rem] overflow-y-auto scrollbar-thin">
      <div className="space-y-12">
        <div className="flex flex-col gap-2">
          <span className={cn("text-gray-500", TEXT_TITLE_MD_CLASSNAME)}>
            Crie sua conta
          </span>
          <span className={cn("text-gray-300", TEXT_BODY_SM_CLASSNAME)}>
            Informe os seus dados pessoais e de acesso
          </span>
        </div>

        <FormProvider {...methods}>
          <form
            id="sign-up"
            className="space-y-12"
            onSubmit={handleSubmit(handleSignUp)}
          >
            <div className="space-y-5">
              <span className={cn("text-gray-500", TEXT_TITLE_SM_CLASSNAME)}>
                Perfil
              </span>

              <FileInputRoot {...register("avatar")}>
                <FileInputPlaceholder>
                  <ImageUploadIcon className="size-8 text-orange-base" />
                </FileInputPlaceholder>
              </FileInputRoot>

              <InputRoot>
                <Label>
                  Nome
                  <InputContent>
                    <InputIcon>
                      <UserIcon />
                    </InputIcon>

                    <Input
                      required
                      type="text"
                      placeholder="Seu nome completo"
                      {...register("name")}
                    />
                  </InputContent>
                </Label>

                {errors.name?.message && (
                  <InputError>{errors.name.message}</InputError>
                )}
              </InputRoot>

              <InputRoot>
                <Label>
                  Telefone
                  <InputContent>
                    <InputIcon>
                      <CallIcon />
                    </InputIcon>

                    <Input
                      required
                      type="tel"
                      placeholder="(00) 0000-0000"
                      {...register("phone")}
                    />
                  </InputContent>
                </Label>

                {errors.phone?.message && (
                  <InputError>{errors.phone.message}</InputError>
                )}
              </InputRoot>
            </div>

            <div className="space-y-5">
              <span className={cn("text-gray-500", TEXT_TITLE_SM_CLASSNAME)}>
                Acesso
              </span>

              <InputRoot>
                <Label>
                  E-mail
                  <InputContent>
                    <InputIcon>
                      <Mail02Icon />
                    </InputIcon>

                    <Input
                      required
                      type="email"
                      placeholder="Seu e-mail cadastrado"
                      {...register("email")}
                    />
                  </InputContent>
                </Label>

                {errors.email?.message && (
                  <InputError>{errors.email.message}</InputError>
                )}
              </InputRoot>

              <InputRoot>
                <Label>
                  Senha
                  <InputContent>
                    <InputIcon>
                      <AccessIcon />
                    </InputIcon>

                    <Input
                      required
                      type={isNewPasswordVisible ? "text" : "password"}
                      placeholder="Senha de acesso"
                      {...register("password")}
                    />

                    <button type="button" onClick={handleShownNewPassword}>
                      <ViewIcon className="text-gray-300" />
                    </button>
                  </InputContent>
                </Label>

                {errors.password?.message && (
                  <InputError>{errors.password.message}</InputError>
                )}
              </InputRoot>

              <InputRoot>
                <Label>
                  Confirmar senha
                  <InputContent>
                    <InputIcon>
                      <AccessIcon />
                    </InputIcon>

                    <Input
                      required
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      placeholder="Confirme a senha"
                      {...register("passwordConfirmation")}
                    />

                    <button type="button" onClick={handleShownConfirmPassword}>
                      <ViewIcon className="text-gray-300" />
                    </button>
                  </InputContent>
                </Label>

                {errors.passwordConfirmation?.message && (
                  <InputError>{errors.passwordConfirmation.message}</InputError>
                )}
              </InputRoot>
            </div>
          </form>

          <Button className="w-full" form="sign-up">
            {isSubmitting ? (
              <>
                Cadastrando...
                <Loading01Icon className="ml-auto size-5 animate-spin" />
              </>
            ) : (
              <>
                Cadastrar
                <ArrowRight02Icon className="ml-auto size-5" />
              </>
            )}
          </Button>
        </FormProvider>
      </div>

      <div className="space-y-5">
        <span className={cn("text-gray-300", TEXT_BODY_MD_CLASSNAME)}>
          Já tem uma conta?
        </span>

        <Button variants="outline" asChild>
          <Link
            to="/sign-in"
            className={cn(isSubmitting && "pointer-events-none")}
          >
            Acessar
            <ArrowRight02Icon className="ml-auto size-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
