import { useQuery } from "@tanstack/react-query";
import { me } from "../http/me";

export function useIsAuthorized() {
  const { status, fetchStatus } = useQuery({
    queryKey: ["profile"],
    queryFn: me,
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  if (fetchStatus === "fetching") {
    return "loading";
  }

  if (status === "success") {
    return "authorized";
  }

  return "not-authorized";
}
