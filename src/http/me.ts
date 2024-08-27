import { api } from "../providers/axios";

interface MeResponse {
  seller: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar: {
      id: string;
      url: string;
    } | null;
  };
}

export async function me(): Promise<MeResponse> {
  const user = await api.get<MeResponse>("/sellers/me");

  return user.data;
}
