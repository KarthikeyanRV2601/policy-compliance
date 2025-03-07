import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { ROLE_PERMISSIONS } from "@/types";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }


    try {
        const { policyId, approverRole, policyType, approverId } = req.body;

        if (
            !ROLE_PERMISSIONS[approverRole] ||
            (!ROLE_PERMISSIONS[approverRole].includes("ALL") &&
                !ROLE_PERMISSIONS[approverRole].includes(policyType))
        ) {
            return res.status(403).json({ error: "You are not authorized to approve this policy." });
        }

        if (!policyId) {
            return res.status(400).json({ error: "Missing policy ID" });
        }

        const policy = await prisma.policy.findUnique({ where: { id: policyId } });

        if (!policy) {
            return res.status(404).json({ error: "Policy not found" });
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
    } catch (error: any) {
        console.log("Undo policy action error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
