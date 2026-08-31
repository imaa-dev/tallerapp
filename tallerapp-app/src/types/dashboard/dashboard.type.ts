export type ServiceStatusCount = {
  slug: string;
  label: string;
  count: number;
  color: string;
};

export type DashboardServices = {
  total: number;
  active: number;
  status: ServiceStatusCount[];
};

export type DashboardClients = {
  total: number;
  new_this_month: number;
  recurring: number;
};

export type DashboardBusiness = {
  revenue_this_month: number;
  avg_ticket: number;
};

export type DashboardCounts = {
  products: number;
  clients: number;
  services: number;
  services_reparaciones: number;
  others: number;
};

export type DashboardData = {
  services: DashboardServices;
  clients: DashboardClients;
  business: DashboardBusiness;
  counts: DashboardCounts;
};
