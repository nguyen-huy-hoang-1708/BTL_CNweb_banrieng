import Groq from 'groq-sdk';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groqClient = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

export async function createChatCompletion(messages: ChatMessage[], model = 'gpt-oss-20b', temperature = 0.6) {
  if (!groqClient) {
    throw new Error('Missing GROQ_API_KEY environment variable');
  }
  const completion = await groqClient.chat.completions.create({
    model,
    messages,
    temperature,
  });
  return completion;
}

export interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export function extractFirstMessageContent(completion: Groq.Chat.Completions.ChatCompletion | null) {
  return completion?.choices?.[0]?.message?.content?.trim() || null;
}