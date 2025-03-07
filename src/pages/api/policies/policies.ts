import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const policies = await prisma.policy.findMany();
      return res.status(200).json(policies);
    }

    if (req.method === "POST") {
      const { companyId, name, type, content } = req.body;

      const companyExists = await prisma.company.findUnique({
        where: { id: companyId },
      });
      if (!companyExists) {
        return NextResponse.json(
          { error: "Invalid companyId: Company does not exist" },
          { status: 400 }
        );
      }

      const policy = await prisma.policy.create({
        data: { companyId, name, type, content, version: 1, status: "pending", approvedBy: null, createdAt: new Date(), updatedAt: new Date() }
      });

      return res.status(200).json(policy);
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      const policyDeleteResponse = await prisma.policy.delete({
        where: { id }
      });
      return res.status(200).json(policyDeleteResponse);
    }

    res.status(405).json({ message: "Method Not Allowed" });
  }
  catch (error) {
    console.log("createPolicy Error:", error);
    throw error;
  }
}
