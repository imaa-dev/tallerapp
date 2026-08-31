import { useQuery } from "@tanstack/react-query";
import { getOrganizationRequest } from "@/services/organization/organization.service";
import { OrganizationDetail } from "@/types/organization/organization.type";

export const useOrganization = () => {
  return useQuery<OrganizationDetail>({
    queryKey: ["organization"],
    queryFn: async () => {
      const { data } = await getOrganizationRequest();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
