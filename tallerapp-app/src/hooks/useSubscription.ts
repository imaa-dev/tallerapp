import { useQuery } from "@tanstack/react-query";
import { getSubscriptionRequest, getPlansRequest } from "@/services/subscription/subscription.service";
import { Subscription, Plan } from "@/types/subscription/subscription.type";

export const useSubscription = () => {
  return useQuery<Subscription>({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data } = await getSubscriptionRequest();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const usePlans = () => {
  return useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data } = await getPlansRequest();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
