import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiTutorService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(AiTutorService.name);

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      this.logger.log('OpenAI Service initialized');
    } else {
      this.logger.warn('OPENAI_API_KEY not found. Using Mock AI Service.');
    }
  }

  async askTutor(
    question: string,
    context?: { subject?: string; grade?: string },
  ): Promise<string> {
    if (!this.openai) {
      return this.getMockResponse(question, context);
    }

    try {
      const systemPrompt = `You are an intelligent and helpful AI tutor for students. 
      Subject: ${context?.subject || 'General'}
      Grade Level: ${context?.grade || 'Unknown'}
      
      Instructions:
      - Explain concepts simply and clearly.
      - Do not just give the answer; explain the "Why" and "How".
      - Be encouraging and positive.
      - Answer in the same language as the question (likely Arabic or English).`;

      const completion = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
        model: 'gpt-3.5-turbo', // Use 3.5 for cost / speed, or gpt-4o if available
      });

      return (
        completion.choices[0].message.content ||
        'Sorry, I could not generate a response.'
      );
    } catch (error) {
      this.logger.error('OpenAI API Error', error);
      return 'Sorry, I am having trouble connecting to my brain right now. Please try again later.';
    }
  }

  private getMockResponse(question: string, context?: any): string {
    // Simple Keyword matching for mock
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('math') || lowerQ.includes('calc')) {
      return 'MOOCK: Mathematics is the language of the universe! To solve this, break it down step by step.';
    }
    if (lowerQ.includes('history') || lowerQ.includes('date')) {
      return 'MOCK: History teaches us about the past. What specific event are you asking about?';
    }

    return `MOCK RESPONSE: That's an interesting question about ${context?.subject || 'this topic'}. 
    Since I am in Mock Mode (No API Key), I can't give a real answer, but I'm listening!
    You asked: "${question}"`;
  }
}
