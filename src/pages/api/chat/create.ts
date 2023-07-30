import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../utils/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body

  const chat = await prisma.chat.create({
    data: {
      userId: userId
    }
  })

  res.status(200).json(chat)
}