import {
  Calendar04Icon,
  Loading03Icon,
  UserMultipleIcon,
} from "hugeicons-react";
import { cn } from "../../../utils/cn";
import {
  TEXT_ACTION_MD_CLASSNAME,
  TEXT_BODY_XS_CLASSNAME,
  TEXT_LABEL_SM_CLASSNAME,
  TEXT_TITLE_SM_CLASSNAME,
} from "../../../utils/tailwindCustomClasses";
import { useQuery } from "@tanstack/react-query";
import { metricsProductsViewersPerDay } from "../../../http/metrics-products-viewers-per-day";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg p-2 space-y-2 shadow-md">
        <span
          className={cn(
            "text-gray-400",
            TEXT_LABEL_SM_CLASSNAME,
            "text-[0.625rem]"
          )}
        >
          {format(label, "d 'de' MMMM", { locale: ptBR })}
        </span>
        <div className="flex gap-2 items-center">
          <UserMultipleIcon className="size-4 text-orange-base" />
          <span className={cn("text-gray-300", TEXT_BODY_XS_CLASSNAME)}>
            {payload[0].value}{" "}
            {payload[0].value === 1 ? "visitante" : "visitantes"}
          </span>
        </div>
      </div>
    );
  }

  return null;
}

export function MetricsProductViewersChart() {
  const { data } = useQuery({
    queryKey: ["metrics", "products-viewers-per-day"],
    queryFn: metricsProductsViewersPerDay,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="flex flex-col bg-white rounded-xl flex-1 p-6 gap-7">
      <div className="flex items-center justify-between">
        <span className={cn("text-gray-500", TEXT_TITLE_SM_CLASSNAME)}>
          Visitantes
        </span>

        <div className="flex items-center gap-2">
          <Calendar04Icon className="size-4 text-blue-dark" />

          {data?.viewsPerDay ? (
            <span
              className={cn(
                "text-gray-300",
                TEXT_LABEL_SM_CLASSNAME,
                "text-[0.625rem] leading-none"
              )}
            >
              {format(data.viewsPerDay[0].date, "d 'de' MMMM", {
                locale: ptBR,
              })}{" "}
              -{" "}
              {format(
                data.viewsPerDay[data.viewsPerDay.length - 1].date,
                "d 'de' MMMM",
                {
                  locale: ptBR,
                }
              )}
            </span>
          ) : (
            <span
              className={cn(
                "text-transparent",
                TEXT_LABEL_SM_CLASSNAME,
                "text-[0.625rem] leading-none rounded bg-gray-100 animate-pulse"
              )}
            >
              Carregando as datas...
            </span>
          )}
        </div>
      </div>

      {data ? (
        <div className="w-full h-[16.625rem] text-gray-100">
          <ResponsiveContainer>
            <LineChart data={data?.viewsPerDay}>
              <Line
                type="monotone"
                dataKey="amount"
                className="stroke-blue-base"
                stroke="#5EC5FD"
                strokeWidth={2}
                dot={false}
              />
              <CartesianGrid
                className="stroke-gray-200"
                strokeDasharray="9"
                strokeOpacity="30%"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => new Date(value).getDate().toString()}
                tick={{ fill: "#949494", fontSize: 10, fontWeight: 500 }}
                interval={0}
                tickMargin={20}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#949494", fontSize: 12 }}
              />
              <Tooltip cursor={false} content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div
          className={cn(
            "text-blue-dark flex gap-2 items-center justify-center h-full",
            TEXT_ACTION_MD_CLASSNAME
          )}
        >
          <span>Carregando dados</span>
          <Loading03Icon className="animate-spin" />
        </div>
      )}
    </div>
  );
}
