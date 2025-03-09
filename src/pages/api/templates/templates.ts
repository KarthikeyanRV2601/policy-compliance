import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const policyTemplates = await prisma.policyTemplate.findMany();
    res.status(200).json(policyTemplates);
    return;
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
    res.status(200).json(policyTemplatesCreate);
    return;
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    const policyTemplatesDelete = await prisma.policyTemplate.delete({
      where: { id }
    });
    res.status(200).json(policyTemplatesDelete);
    return;
  }

  res.status(405).json({ message: "Method Not Allowed" });
  return;
}
