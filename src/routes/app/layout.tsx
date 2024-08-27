import { Outlet } from "react-router-dom";
import { Menu } from "../../components/menu";
import { useSignOutOnUnauthorized } from "../../hooks/useSignOutOnUnauthorized";

export function AppLayout() {
  useSignOutOnUnauthorized();

  return (
    <div className="bg-background min-h-screen">
      <Menu />

      <div className="max-w-5xl w-full mx-auto py-16">
        <Outlet />
      </div>
    </div>
  );
}
