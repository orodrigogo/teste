import { api } from "../providers/axios";

export interface MetricsProductsViewersPerDayResponse {
  viewsPerDay: {
    date: string;
    amount: number;
  }[];
}

export async function metricsProductsViewersPerDay(): Promise<MetricsProductsViewersPerDayResponse> {
  const result = await api.get("/sellers/metrics/views/days");

  return result.data;
}
