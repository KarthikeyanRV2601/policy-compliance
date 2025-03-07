import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({
        id: "sprinto-employee-1",
        name: "Karthikeyan",
        role: "CTO",
    });
}
