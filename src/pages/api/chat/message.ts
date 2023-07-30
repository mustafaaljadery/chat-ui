import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: localStorage.getItem("key") || ""
});

const openai = new OpenAIApi(configuration);

export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    const { prompt } = req.body

    const response = openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 50,
      temperature: 0.7,
      stream: true,  // mandatory for streaming
    }, { responseType: 'stream' });

    response.then(resp => {
      resp.data.on('data', (data: any) => {
        const lines = data.toString().split('\n').filter((line: any) => line.trim() !== '');

        for (const line of lines) {

          const message = line.replace(/^data: /, '');

          if (message === '[DONE]') {
            res.end();
            return
          }

          const parsed = JSON.parse(message)
          const data = { response: parsed.choices[0].text }
          const writeData = `data: ${JSON.stringify(data)}`
          res.write(writeData)
        }
      });
    })

    // Cleanup function
    req.on('close', () => {
      res.end();
    });
  } else {
    // Handle other HTTP methods or return an appropriate error response
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}