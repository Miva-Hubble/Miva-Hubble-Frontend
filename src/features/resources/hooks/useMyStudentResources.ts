import { useQuery } from "@tanstack/react-query";
import { studentResourceKeys } from "../constants/studentResourceKeys";
import { studentResourceService } from "../services/studentResourceService";

/** Private submission list for the authenticated student. */
export function useMyStudentResources() {
  const query = useQuery({
    queryKey: studentResourceKeys.mine(),
    queryFn: studentResourceService.getMine,
    refetchOnMount: "always",
  });

  return {
    resources: query.data?.resources ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
