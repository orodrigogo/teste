import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 bg-background">
      <h1 className="text-4xl font-bold">Página não encontrada</h1>
      <p>
        Voltar para o{" "}
        <Link to="/" className="text-orange-base">
          Dashboard
        </Link>
      </p>
    </div>
  );
}
