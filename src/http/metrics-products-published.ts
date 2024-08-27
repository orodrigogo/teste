import { api } from "../providers/axios";

export interface MetricsProductsPublishedResponse {
  amount: number;
}

export async function metricsProductsPublished(): Promise<MetricsProductsPublishedResponse> {
  const result = await api.get("/sellers/metrics/products/total");

  return result.data;
}
