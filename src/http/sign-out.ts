import { api } from "../providers/axios";

export async function signOut() {
  await api.post("/sign-out");
}
