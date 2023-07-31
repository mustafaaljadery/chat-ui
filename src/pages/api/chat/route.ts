import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge'

export default async function POST(req: Request) {
  const { messages, key, model } = await req.json()

  const config = new Configuration({
    apiKey: key
  })

  const openai = new OpenAIApi(config)

  const response = await openai.createChatCompletion({
    model: model == "gpt-3.5" ? 'gpt-3.5-turbo' : "gpt-4",
    stream: true,
    messages
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}