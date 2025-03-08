import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            const { companyId, employeeId, searchQuery } = req.query;

            if(searchQuery) {
                const employee = await prisma.employee.findMany({
                    where: {  OR: [
                        { name: { startsWith: searchQuery as string, mode: "insensitive" } },
                        { email: { startsWith: searchQuery as string, mode: "insensitive" } }
                    ] },
                });
                return res.status(200).json(employee);
            }

            if (employeeId) {
                const employeeExists = await prisma.employee.findUnique({
                    where: { id: employeeId as string },
                });
                return res.status(200).json(employeeExists);
            }

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
                const companyEmployee = await prisma.employee.findMany({
                    where: { companyId: companyId as string },
                });
                return res.status(200).json(companyEmployee);
            }
        }

        if (req.method === "POST") {
            return res.status(200).json({});
        }

        if (req.method === "DELETE") {
        }

        res.status(405).json({ message: "Method Not Allowed" });
    }
    catch (error) {
        console.log("employee Error:", error);
        throw error;
    }
}
