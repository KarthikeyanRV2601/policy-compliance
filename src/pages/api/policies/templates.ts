import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const policyTemplates = await prisma.policyTemplate.findMany();
    return res.status(200).json(policyTemplates);
  }

  if (req.method === "POST") {
    const { name, type, content, createdBy } = req.body;
    const policyTemplatesCreate = await prisma.policyTemplate.create({
      data: {
        name,
        type,
        content,
        createdBy
      }
    });
    return res.status(200).json(policyTemplatesCreate);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    const policyTemplatesDelete = await prisma.policyTemplate.delete({
      where: { id }
    });
    return res.status(200).json(policyTemplatesDelete);
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
