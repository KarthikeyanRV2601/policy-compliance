import { ROLE_PERMISSIONS } from "@/types";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST"){
    res.status(405).json({ error: "Method Not Allowed" })
    return
  };

  try {
    const { policyId, approverId, approverRole, policyType } = req.body;

    if (
      !ROLE_PERMISSIONS[approverRole] || // Invalid role
      (!ROLE_PERMISSIONS[approverRole].includes("ALL") &&
        !ROLE_PERMISSIONS[approverRole].includes(policyType))
    ) {
      res.status(403).json({ error: "You are not authorized to approve this policy." });
      return;
    }

    const policy = await prisma.policy.update({
      where: { id: policyId },
      data: {
        status: "approved",
        approvedBy: approverId,
        updatedAt: new Date()
      },
    });

    res.status(200).json({ message: "Policy approved successfully", policy });
    return;
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
}
