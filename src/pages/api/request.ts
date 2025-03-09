import { AcknowledgementStatus } from "@/types";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { employeeId, policies } = req.body;

        if (!employeeId || !policies) {
            res.status(400).json({ error: "Missing required fields: employeeId, policies" });
            return;
        }

        try {

            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
            });

            if (!employee) {
                res.status(404).json({ error: "Employee not found" });
                return;
            }

            const dueDate =
                employee.newJoinee
                    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            await prisma.acknowledgementRequest.createMany({
                data: policies.map((policy: string) => ({
                    policyId: policy,
                    employeeId,
                    requestedAt: new Date(),
                    dueDate,
                    status: AcknowledgementStatus.PENDING,
                    escalationSent: false
                })),
            });

            res.status(200).json({ message: "Acknowledgement requests created successfully" });
            return;
        } catch (error) {
            console.error("Error requesting acknowledgement:", error);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
    }


}
