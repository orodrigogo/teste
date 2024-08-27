import * as Popover from "@radix-ui/react-popover";
import { Logout01Icon, UserAccountIcon } from "hugeicons-react";
import { TEXT_BODY_SM_CLASSNAME } from "../utils/tailwindCustomClasses";
import { Link } from "./link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signOut } from "../http/sign-out";
import { useNavigate } from "react-router-dom";
import { me } from "../http/me";

export function User() {
  const { mutateAsync: signOutFn } = useMutation({
    mutationFn: signOut,
  });
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: me,
  });

  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOutFn();
      navigate("/sign-in");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Popover.Root>
      <Popover.Trigger className="rounded-xl ring-1 ring-shape overflow-hidden">
        {data?.seller.avatar?.url ? (
          <img
            className="size-12 object-cover"
            src={data?.seller.avatar?.url}
            alt=""
          />
        ) : (
          <UserAccountIcon className="size-12 text-orange-base" />
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={12}
          align="end"
          className="bg-white rounded-xl p-4 space-y-5 w-[168px]"
        >
          <div className="flex gap-3">
            <div className="rounded-xl ring-1 ring-shape overflow-hidden">
              {data?.seller.avatar?.url ? (
                <img
                  className="size-8 rounded-xl ring-1 ring-shape shrink-0 object-cover"
                  src={data?.seller.avatar?.url}
                  alt=""
                />
              ) : (
                <UserAccountIcon className="size-8 text-orange-base" />
              )}
            </div>

            <span className={`text-gray-300 ${TEXT_BODY_SM_CLASSNAME}`}>
              {data?.seller.name}
            </span>
          </div>

          <div className="w-full h-px bg-shape" />

          <Link className="w-full" onClick={handleSignOut}>
            Sair
            <Logout01Icon className="size-5" />
          </Link>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
