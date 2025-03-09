import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { companyId, policyId } = req.query;

      if (companyId) {
        const companyExists = await prisma.company.findUnique({
          where: { id: companyId as string },
        });

        if (!companyExists) {
          return NextResponse.json(
            { error: "Invalid companyId: Company does not exist" },
            { status: 400 }
          );
        }

        const policies = await prisma.policy.findMany({
          where: { companyId: companyId as string }
        });

        return res.status(200).json(policies);

      } else if (policyId) {
        const policy = await prisma.policy.findUnique({
          where: { id: policyId as string }
        });

        return res.status(200).json(policy);
      }
    }

    if (req.method === "POST") {
      const { companyId, name, type, content, updating, policyId } = req.body;

      const companyExists = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!companyExists) {
        return NextResponse.json(
          { error: "Invalid companyId: Company does not exist" },
          { status: 400 }
        );
      }

      if (!updating) {
        await prisma.policy.create({
          data: { companyId, name, type, content, version: 1, status: "pending", approvedBy: null, createdAt: new Date(), updatedAt: new Date() }
        });
      } else {
        const policy = await prisma.policy.findUnique({ where: { id: policyId } });
        if (!policy) throw new Error("Policy not found");
        await prisma.policy.update({
          where: { id: policyId },
          data: { name, content, version: policy?.version + 1, status: "pending", approvedBy: null, updatedAt: new Date(), acknowledgementRecord: [] }
        });
      }

      return res.status(200).json({});
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
