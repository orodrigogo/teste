import { api } from "../providers/axios";

interface SignUpBody {
  name: string;
  phone: string;
  avatarId: string | null;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface SignUpResponse {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: {
    id: string;
    url: string;
  } | null;
}

export async function signUp({
  name,
  phone,
  avatarId,
  email,
  password,
  passwordConfirmation,
}: SignUpBody): Promise<SignUpResponse> {
  const user = await api.post<SignUpResponse>("/sellers", {
    name,
    phone,
    avatarId,
    email,
    password,
    passwordConfirmation,
  });

  return user.data;
}
