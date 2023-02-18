export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  try {
    console.log('antes de la response')
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: `Answer as you were the artificial intelligence ChatGPT. The user writes a prompt and you have to answer naturally. The prompt is:\n\n${prompt}`,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    console.log('before check')

    if (!response.ok) {
      console.error(response.statusText)
      return res.status(500).json({ error: 'OpenAI API error' })
    }

    console.log('after check')

    const json = await response.json()

    console.log(json)

    return res.status(200).json({ response: json.choices[0].text.trim() })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e })
  }
}
