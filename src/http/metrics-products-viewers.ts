import { api } from "../providers/axios";

export interface MetricsProductsViewersResponse {
  amount: number;
}

export async function metricsProductsViewers(): Promise<MetricsProductsViewersResponse> {
  const result = await api.get("/sellers/metrics/views");

  return result.data;
}
