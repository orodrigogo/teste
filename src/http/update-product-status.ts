import { api } from "../providers/axios";
import { Status } from "../utils/utils";

interface UpdateProductStatusParams {
  id: string;
  status: Status;
}

interface UpdateProductStatusResponse {
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

export async function updateProductStatus({
  id,
  status,
}: UpdateProductStatusParams): Promise<UpdateProductStatusResponse> {
  const product = await api.patch<UpdateProductStatusResponse>(
    `/products/${id}/${status}`
  );

  return product.data;
}
