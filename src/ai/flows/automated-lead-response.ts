'use server';

/**
 * @fileOverview A flow for generating automated initial responses to new leads.
 *
 * - generateAutomatedLeadResponse - A function that generates personalized initial responses to new leads.
 * - AutomatedLeadResponseInput - The input type for the generateAutomatedLeadResponse function.
 * - AutomatedLeadResponseOutput - The return type for the generateAutomatedLeadResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedLeadResponseInputSchema = z.object({
  name: z.string().describe('The name of the lead.'),
  message: z.string().describe('The message content from the lead.'),
  source: z.string().describe('The source of the lead (e.g., WhatsApp, Website, Facebook).'),
});
export type AutomatedLeadResponseInput = z.infer<typeof AutomatedLeadResponseInputSchema>;

const AutomatedLeadResponseOutputSchema = z.object({
  response: z.string().describe('The personalized initial response to the lead.'),
});
export type AutomatedLeadResponseOutput = z.infer<typeof AutomatedLeadResponseOutputSchema>;

export async function generateAutomatedLeadResponse(
  input: AutomatedLeadResponseInput
): Promise<AutomatedLeadResponseOutput> {
  return automatedLeadResponseFlow(input);
}

const automatedLeadResponsePrompt = ai.definePrompt({
  name: 'automatedLeadResponsePrompt',
  input: {schema: AutomatedLeadResponseInputSchema},
  output: {schema: AutomatedLeadResponseOutputSchema},
  prompt: `You are an AI assistant designed to generate personalized initial responses to new leads.

  Based on the lead's message content, source, and name, craft a response that acknowledges their message, expresses gratitude, and indicates that your team will respond shortly.

  Lead Name: {{name}}
  Lead Message: {{message}}
  Lead Source: {{source}}

  Response:`,
});

const automatedLeadResponseFlow = ai.defineFlow(
  {
    name: 'automatedLeadResponseFlow',
    inputSchema: AutomatedLeadResponseInputSchema,
    outputSchema: AutomatedLeadResponseOutputSchema,
  },
  async input => {
    const {output} = await automatedLeadResponsePrompt(input);
    return output!;
  }
);
