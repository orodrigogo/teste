import { api } from "../providers/axios";
import { Status } from "../utils/utils";

interface GetOwnProductsParams {
  search: string | null;
  status: string | null;
}

interface GetOwnProductsResponse {
  products: {
    id: string;
    title: string;
    description: string;
    priceInCents: number;
    status: Status;
    owner: {
      id: string;
      name: string;
      phone: string;
      email: string;
      avatar: {
        id: string;
        url: string;
      } | null;
    };
    category: {
      id: string;
      title: string;
      slug: string;
    };
    attachments: {
      id: string;
      url: string;
    }[];
  }[];
}

export async function getOwnProducts({
  search,
  status,
}: GetOwnProductsParams): Promise<GetOwnProductsResponse> {
  const result = await api.get("/products/me", { params: { search, status } });

  return result.data;
}
