import { api } from "../providers/axios";

interface GetCategoriesResponse {
  categories: {
    id: string;
    title: string;
    slug: string;
  }[];
}

export async function getCategories(): Promise<GetCategoriesResponse> {
  const result = await api.get("/categories");

  return result.data;
}
