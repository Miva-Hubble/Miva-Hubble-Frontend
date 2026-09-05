import { useQuery } from "@tanstack/react-query";
import { vaultKeys } from "../constants/vaultKeys";
import { vaultService } from "../services/vaultService";

export function useVaultResources(params: { search?: string; courseCode?: string; resourceType?: string } = {}) {
  const query = useQuery({ queryKey: vaultKeys.list(params), queryFn: () => vaultService.getVault(params), refetchOnMount: "always" });
  return { resources: query.data?.resources ?? [], pagination: query.data?.pagination, isLoading: query.isLoading, isError: query.isError, error: query.error, refetch: query.refetch, isRefetching: query.isRefetching };
}
