import {
  AccessIcon,
  ArrowRight02Icon,
  Loading01Icon,
  Mail02Icon,
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
} from "../../utils/tailwindCustomClasses";
import { cn } from "../../utils/cn";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "../../http/sign-in";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

const signInForm = z.object({
  email: z.string().email({ message: "Informe um e-mail válido." }),
  password: z.string(),
});

type SignInForm = z.infer<typeof signInForm>;

export function SignIn() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  function handleShownPassword() {
    setIsPasswordVisible((state) => !state);
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
  });

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  });

  async function handleSignIn(data: SignInForm) {
    try {
      await authenticate({ email: data.email, password: data.password });
      navigate("/");
    } catch (error) {
      toast.error("Credenciais inválidas.");
    }
  }

  return (
    <main className="flex flex-col gap-2 h-full justify-between px-20 py-[4.5rem]">
      <div className="space-y-12">
        <div className="flex flex-col gap-2">
          <span className={cn("text-gray-500", TEXT_TITLE_MD_CLASSNAME)}>
            Acesse sua conta
          </span>
          <span className={cn("text-gray-300", TEXT_BODY_SM_CLASSNAME)}>
            Informe seu e-mail e senha para entrar
          </span>
        </div>

        <form
          id="login"
          className="space-y-5"
          onSubmit={handleSubmit(handleSignIn)}
        >
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
              <InputError>{errors.email?.message}</InputError>
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
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Sua senha de acesso"
                  {...register("password")}
                />

                <button type="button" onClick={handleShownPassword}>
                  <ViewIcon className="text-gray-300" />
                </button>
              </InputContent>
            </Label>

            {errors.password?.message && (
              <InputError>{errors.password?.message}</InputError>
            )}
          </InputRoot>
        </form>

        <Button className="w-full" form="login" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              Acessando...
              <Loading01Icon className="ml-auto size-5 animate-spin" />
            </>
          ) : (
            <>
              Acessar
              <ArrowRight02Icon className="ml-auto size-5" />
            </>
          )}
        </Button>
      </div>

      <div className="space-y-5">
        <span className={cn("text-gray-300", TEXT_BODY_MD_CLASSNAME)}>
          Ainda não tem uma conta?
        </span>

        <Button variants="outline" asChild>
          <Link
            to="/sign-up"
            className={cn(isSubmitting && "pointer-events-none")}
          >
            Cadastrar
            <ArrowRight02Icon className="ml-auto size-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
