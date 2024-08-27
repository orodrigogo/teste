import { cn } from "../../../utils/cn";
import {
  TEXT_BODY_SM_CLASSNAME,
  TEXT_TITLE_MD_CLASSNAME,
} from "../../../utils/tailwindCustomClasses";
import { MetricsProductSoldCard } from "./metrics-products-sold-card";
import { MetricsProductPublishedCard } from "./metrics-products-published-card";
import { MetricsProductViewersCard } from "./metrics-products-viewers-card";
import { MetricsProductViewersChart } from "./metrics-products-viewers-chart";

export function Dashboard() {
  return (
    <main className="space-y-10">
      <div className="space-y-2">
        <span className={cn("text-gray-500", TEXT_TITLE_MD_CLASSNAME)}>
          Últimos 30 dias
        </span>

        <p className={cn("text-gray-300", TEXT_BODY_SM_CLASSNAME)}>
          Confira as estatísticas da sua loja no último mês
        </p>
      </div>

      <div className="flex gap-6">
        <div className="space-y-4">
          <MetricsProductSoldCard />

          <MetricsProductPublishedCard />

          <MetricsProductViewersCard />
        </div>

        <MetricsProductViewersChart />
      </div>
    </main>
  );
}
