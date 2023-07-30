import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../utils/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chatId } = req.body

  const chat = await prisma.chat.delete({
    where: {
      id: chatId
    }
  })

  res.status(200).json(chat)
}