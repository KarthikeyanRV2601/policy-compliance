import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function checkAcknowledgmentStatus(employeeId: string, lastAcknowledgedAt: Date) {
    
    console.log({employeeId, lastAcknowledgedAt});
    const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        include: { acknowledgements: true }
    });

    if (!employee) throw new Error("Employee not found");

    const today = new Date();

    const daysSinceJoining = Math.floor((today.getTime() - employee.joinedAt.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceJoining <= 30 && !lastAcknowledgedAt) {
        return { needsAcknowledgment: true, reason: "New employee - acknowledge within 30 days" };
    }

    if (lastAcknowledgedAt) {
        const lastAckDate = new Date(lastAcknowledgedAt);
        const daysSinceLastAck = Math.floor((today.getTime() - lastAckDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceLastAck >= 365) {
            return { needsAcknowledgment: true, reason: "Annual acknowledgment required" };
        }
    } else {
        return { needsAcknowledgment: true, reason: "Never acknowledged before" };
    }

    return { needsAcknowledgment: false };
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === "GET") {
        const { userId } = req.query;


        const pendingAckRequests = await prisma.acknowledgementRequest.findMany({
            where: { employeeId: userId as string }
        });

        pendingAckRequests.forEach(async (ack) => {

            const policy = await prisma.policy.findUnique({
                where: { id: ack.policyId }
            });

            if (policy) {
                const acknowledged = await prisma.acknowledgement.findMany({
                    where: { employeeId: userId as string, policyId: ack.policyId, policyVersion: policy.version }
                });
                if (acknowledged.length > 0) {
                    const { needsAcknowledgment } = await checkAcknowledgmentStatus(userId as string, acknowledged[0].acknowledgedAt);
                    if (needsAcknowledgment) {
                        await prisma.acknowledgementRequest.update({
                            where: { id: ack.id },
                            data: {
                                status: 'pending'
                            }
                        })
                    }
                }

            }
        })


        const pendingAcksAfterProcessing = await prisma.acknowledgementRequest.findMany({
            where: { employeeId: userId as string, status: 'pending' }
        });

        res.status(200).json(pendingAcksAfterProcessing);
    }

    if (req.method === "POST") {
        try {
            const { employeeId, policyId } = req.body;
            const policy = await prisma.policy.findUnique({
                where: { id: policyId }
            });


            if (policy) {
                const existing = await prisma.acknowledgement.findFirst({
                    where: { employeeId, policyId, policyVersion: policy.version },
                });
                if (existing) {
                    return res.status(400).json({ error: "Policy already acknowledged" });
                }
            }


            const employee = await prisma.employee.findUnique({
                where: { id: employeeId }
            });

            if (policy) {
                const response = await prisma.acknowledgement.create({
                    data: {
                        employeeId,
                        policyId,
                        policyVersion: policy.version,
                        acknowledgedAt: new Date(),
                        acknowledgementType: policy.policyType || 'manual',
                    },
                });
            }

            const response = await prisma.acknowledgementRequest.updateMany({
                where: { employeeId, policyId, status: "pending" },
                data: { status: "acknowledged" },
            });
            if (employee) {
                const updateResponse = await prisma.employee.update({
                    where: { id: employeeId },
                    data: {
                        acknowledgementRecord: [...employee.acknowledgementRecord, policyId]
                    }
                })
            }

            if (policy) {
                const updateResponse = await prisma.policy.update({
                    where: { id: policyId },
                    data: {
                        acknowledgementRecord: [...policy?.acknowledgementRecord, employeeId]
                    }
                })
            }


            res.status(200).json({ message: "Policy acknowledged successfully" });
        } catch (error) {
            console.error("Acknowledgement error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
