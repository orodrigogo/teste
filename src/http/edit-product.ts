import { api } from "../providers/axios";
import { Status } from "../utils/utils";

interface EditProductParams {
  id: string;
  data: EditProductBody;
}

interface EditProductBody {
  title: string;
  categoryId: string;
  description: string;
  priceInCents: number;
  attachmentsIds: string[];
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

export async function editProduct({
  id,
  data: { attachmentsIds, categoryId, description, priceInCents, title },
}: EditProductParams): Promise<EditProductResponse> {
  const product = await api.put<EditProductResponse>(`/products/${id}`, {
    attachmentsIds,
    categoryId,
    description,
    priceInCents,
    title,
  });

  return product.data;
}
