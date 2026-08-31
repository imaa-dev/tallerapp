import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsRequest } from "@/services/dashboard/dashboard.service";
import { DashboardData } from "@/types/dashboard/dashboard.type";

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await getDashboardStatsRequest();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
