import { useQuery } from "@tanstack/react-query";
import { taxonomyService } from "../services/taxonomyService";

const TAXONOMY_QUERY_KEY = ["taxonomy"] as const;

export function useTaxonomy() {
  const query = useQuery({
    queryKey: TAXONOMY_QUERY_KEY,
    queryFn: taxonomyService.getTaxonomy,
    staleTime: Infinity,
  });

  return {
    levels: query.data?.levels ?? [],
    departments: query.data?.departments ?? [],
    goals: query.data?.goals ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
