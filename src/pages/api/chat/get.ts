import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../utils/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  const chat = await prisma.chat.findFirst({ where: { id: id as string } })

  res.status(200).json(chat)
}