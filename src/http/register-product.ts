import { api } from "../providers/axios";

interface RegisterProductBody {
  title: string;
  categoryId: string;
  description: string;
  priceInCents: number;
  attachmentsIds: string[];
}

interface RegisterProductResponse {
  product: {
    id: string;
    title: string;
    description: string;
    priceInCents: number;
    status: string;
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

export async function registerProduct({
  attachmentsIds,
  categoryId,
  description,
  priceInCents,
  title,
}: RegisterProductBody): Promise<RegisterProductResponse> {
  const product = await api.post<RegisterProductResponse>("/products", {
    attachmentsIds,
    categoryId,
    description,
    priceInCents,
    title,
  });

  return product.data;
}
