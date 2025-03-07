import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { employeeId, policyId, ackType } = req.body;

    const acknowledgment = await prisma.acknowledgement.create({
      data: { employeeId, policyId, ackType }
    });

    return res.status(200).json(acknowledgment);
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
