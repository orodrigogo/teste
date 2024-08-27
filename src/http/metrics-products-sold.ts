import { api } from "../providers/axios";

export interface MetricsProductsSoldResponse {
  amount: number;
}

export async function metricsProductsSold(): Promise<MetricsProductsSoldResponse> {
  const result = await api.get("/sellers/metrics/products/sold");

  return result.data;
}
