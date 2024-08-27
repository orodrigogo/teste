import { Outlet, useNavigate } from "react-router-dom";

import logoImg from "../../assets/icons/logo.svg";
import heroImg from "../../assets/images/sign-in-hero.png";
import { Loading03Icon } from "hugeicons-react";
import { useIsAuthorized } from "../../hooks/useIsAuthorized";
import { useEffect } from "react";
import { TEXT_ACTION_MD_CLASSNAME } from "../../utils/tailwindCustomClasses";
import { cn } from "../../utils/cn";

export function AuthLayout() {
  const authStatus = useIsAuthorized();
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus === "authorized") {
      navigate("/", { replace: true });
    }
  }, [authStatus, navigate]);

  if (authStatus === "loading") {
    return (
      <div className="bg-background flex items-center justify-center h-screen gap-2">
        <span className={cn("text-orange-base", TEXT_ACTION_MD_CLASSNAME)}>
          Carregando...
        </span>
        <Loading03Icon className="size-5 animate-spin text-orange-base" />
      </div>
    );
  }

  return (
    <div className="bg-background flex items-center justify-center h-screen">
      <div className="flex justify-between max-w-[1366px] w-full">
        <div className="mt-10 space-y-16">
          <img
            src={logoImg}
            alt="logo"
            className="ml-10 max-w-[267px] aspect-auto w-full"
          />
          <img
            src={heroImg}
            alt="hero"
            className="max-w-[755px] aspect-auto w-full"
          />
        </div>

        <div className="h-[calc(100vh_-_3rem)] my-auto mr-6 w-[564px] rounded-[2rem] overflow-y-auto bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
