import { api } from "../providers/axios";
import { Status } from "../utils/utils";

interface EditProductParams {
  id: string;
}

interface EditProductResponse {
  product: {
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
  };
}

export async function getProduct({
  id,
}: EditProductParams): Promise<EditProductResponse> {
  const result = await api.get(`/products/${id}`);

  return result.data;
}
