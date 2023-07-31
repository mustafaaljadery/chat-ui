import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { prisma } from "../../../utils/prisma"

export const runtime = 'edge'

export default async function POST(req: Request) {
  const { messages, key, chatId } = await req.json()

  const config = new Configuration({
    apiKey: key
  })

  const openai = new OpenAIApi(config)

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}