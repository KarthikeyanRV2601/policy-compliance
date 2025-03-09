import { AcknowledgementStatus } from "@/types";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { employeeId, policies } = req.body;

        if (!employeeId || !policies) {
            return res.status(400).json({ error: "Missing required fields: employeeId, policies" });
        }

        try {

            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
            });

            if (!employee) {
                return res.status(404).json({ error: "Employee not found" });
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

            return res.status(200).json({ message: "Acknowledgement requests created successfully" });
        } catch (error) {
            console.error("Error requesting acknowledgement:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }


}
