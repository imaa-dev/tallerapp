export const ServiceStatus = {
    Reception: 1,
    Diagnosis: 2,
    SparePartApproval: 3,
    CostApproval: 4,
    InRepair: 5,
    Repaired: 6,
    Delivered: 7,
    Incident: 8,
} as const;

export type ServiceStatusValue = (typeof ServiceStatus)[keyof typeof ServiceStatus];
