import { ChartHistogramIcon, PackageIcon, PlusSignIcon } from "hugeicons-react";
import { Button } from "./button";
import { User } from "./user";

import shortLogo from "../assets/icons/short-logo.svg";
import { MenuLink } from "./menu-link";
import { Link } from "react-router-dom";

export function Menu() {
  return (
    <header className="flex items-center justify-between p-5 border-b border-shape bg-background">
      <img src={shortLogo} alt="" />

      <nav className="flex flex-1 gap-2 items-center justify-center">
        <MenuLink to="/">
          <ChartHistogramIcon className="size-5" />
          Dashboard
        </MenuLink>

        <MenuLink to="/products">
          <PackageIcon className="size-5" />
          Produtos
        </MenuLink>
      </nav>

      <div className="flex items-center gap-4">
        <Button size="sm" asChild>
          <Link to="/products/new">
            <PlusSignIcon className="size-5 text-white" />
            Novo produto
          </Link>
        </Button>

        <User />
      </div>
    </header>
  );
}
