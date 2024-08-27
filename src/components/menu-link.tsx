import {
  Link as ReactRouterLink,
  LinkProps,
  useLocation,
} from "react-router-dom";
import { cn } from "../utils/cn";
import {
  TEXT_ACTION_SM_CLASSNAME,
  TEXT_BODY_SM_CLASSNAME,
} from "../utils/tailwindCustomClasses";

interface Props extends LinkProps {}

export function MenuLink({ children, to, ...rest }: Props) {
  const { pathname } = useLocation();
  const isActive =
    to.toString() === "/"
      ? pathname === to.toString()
      : pathname.includes(to.toString());

  return (
    <ReactRouterLink
      to={to}
      className={cn(
        "flex gap-2 items-center py-2.5 px-4 text-gray-300 hover:text-orange-base transition-colors",
        !isActive && `${TEXT_BODY_SM_CLASSNAME}`,
        isActive &&
          `bg-shape rounded-[10px] text-orange-base ${TEXT_ACTION_SM_CLASSNAME}`
      )}
      {...rest}
    >
      {children}
    </ReactRouterLink>
  );
}
