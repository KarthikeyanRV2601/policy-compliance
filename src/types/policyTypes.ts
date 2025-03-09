export enum HomePageTabs {
    POLICY_CREATION = 'POLICY CREATION',
    POLICY_RECORD = 'POLICY RECORD',
    POLICY_APPROVAL = 'POLICY APPROVAL',
    POLICY_ACKNOWLEDGEMENT_REQUEST = 'POLICY ACKNOWLEDGEMENT REQUEST',
    POLICY_ACKNOWLEDGEMENT = 'POLICY ACKNOWLEDGEMENT',
}


export interface PolicyTemplateType {
    id: string;
    type: string;
    name: string;
    content: string;
}

export interface Policy {
    id: string;
    name: string;
    type: string;
    version: number;
    content: string;
    status: string;
}

export const ROLE_PERMISSIONS: Record<string, string[]> = {
    "CTO": ["ALL"],
    "Compliance Officer": ["InfoSec Policy", "Cryptographic Policy", "Acceptable Use Policy"],
    "Manager": ["HR Policy", "General Policy"],
};

export enum AcknowledgementStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    OVERDUE = "overdue",
}

export enum AcknowledgementRequestType {
    NEW_JOINING = "new_joining",
    PERIODIC = "periodic",
    MANUAL = "manual",
}

export interface AcknowledgementRequest {
    id: string;
    policyId: string;
    employeeId: string;
    requestedAt: Date;
    dueDate: Date;
    status: AcknowledgementStatus;
    requestType: AcknowledgementRequestType;
}

export interface AcknowledgmentRequest {
    employeeId: string;
    policyIds: string[];
}