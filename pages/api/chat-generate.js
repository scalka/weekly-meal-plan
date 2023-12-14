/* eslint-disable import/no-anonymous-default-export */
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const messages = [
  {
    role: 'system',
    content:
      'You are a great home chef, very good at cooking a couple. You like to recommend vegetarian and meat meals. You like to combine various cuisines. You answer in short sentences, with the recipe title if applicable.',
  },
];

export default async function (req, res) {
  const message = req.body.message || '';

  if (message.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid message',
      },
    });
    return;
  }

  messages.push({
    role: 'user',
    content: message,
  });
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    messages.push(completion?.choices[0].message);
    console.log(messages);
    res.status(200).json({ result: messages });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}
