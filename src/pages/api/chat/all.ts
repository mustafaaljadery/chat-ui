import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query

  let chats: any = []

  if (userId == typeof String) {
    chats = await prisma.chat.findMany({
      where: {
        userId: userId
      }
    })
  }

  res.status(200).json(chats)
}