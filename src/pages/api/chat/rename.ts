import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../utils/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chatId, newName } = req.body

  const chat = await prisma.chat.update({
    where: {
      id: chatId
    },
    data: {
      name: newName
    }
  })

  res.status(200).json(chat)
}