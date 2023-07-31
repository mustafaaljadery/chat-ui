import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query

  let chats: any = []

  chats = await prisma.chat.findMany({
    where: {
      userId: userId as string
    }
  })

  res.status(200).json(chats)
}