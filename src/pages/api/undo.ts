import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { ROLE_PERMISSIONS } from "@/types";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method Not Allowed" });
        return;
    }


    try {
        const { policyId, approverRole, policyType, approverId } = req.body;

        if (
            !ROLE_PERMISSIONS[approverRole] ||
            (!ROLE_PERMISSIONS[approverRole].includes("ALL") &&
                !ROLE_PERMISSIONS[approverRole].includes(policyType))
        ) {
            res.status(403).json({ error: "You are not authorized to approve this policy." });
            return;
        }

        if (!policyId) {
            res.status(400).json({ error: "Missing policy ID" });
            return;
        }

        const policy = await prisma.policy.findUnique({ where: { id: policyId } });

        if (!policy) {
            res.status(404).json({ error: "Policy not found" });
            return;
        }

        const previousStatus =
            policy.status === "approved" || policy.status === "rejected" ? "pending" : policy.status;

        const updatedPolicy = await prisma.policy.update({
            where: { id: policyId },
            data: {
                status: previousStatus,
                approvedBy: approverId,
                updatedAt: new Date(),
            },
        });

        res.status(200).json(updatedPolicy);
        return;
    } catch (error: any) {
        console.log("Undo policy action error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
}
