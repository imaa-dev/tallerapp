export const ServiceStatus = {
    Reception: 1,
    Diagnosis: 2,
    SparePartApproval: 3,
    InRepair: 4,
    Repaired: 5,
    Delivered: 6,
    Incident: 7,
} as const;

export type ServiceStatusValue = (typeof ServiceStatus)[keyof typeof ServiceStatus];
