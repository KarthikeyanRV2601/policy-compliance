import { Employee } from "@prisma/client";

export enum HomePageTabs {
    POLICY_CREATION = 'POLICY CREATION',
    POLICY_RECORD = 'POLICY RECORD',
    POLICY_APPROVAL = 'POLICY APPROVAL',
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
