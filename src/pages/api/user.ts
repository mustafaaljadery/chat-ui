import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../utils/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await prisma.user.create({ data: {} })

  res.status(200).json(user)
}