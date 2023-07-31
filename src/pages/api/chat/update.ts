import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../utils/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, messages } = req.body

  const chat = await prisma.chat.update({
    where: {
      id: id
    },
    data: {
      messages: messages
    }
  })

  res.status(200).json(chat)
}
