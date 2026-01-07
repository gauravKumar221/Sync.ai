'use server';

/**
 * @fileOverview Summarizes a lead conversation to provide a quick understanding of the context.
 *
 * - summarizeLeadConversation - A function that summarizes the lead conversation.
 * - SummarizeLeadConversationInput - The input type for the summarizeLeadConversation function.
 * - SummarizeLeadConversationOutput - The return type for the summarizeLeadConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLeadConversationInputSchema = z.object({
  conversation: z.string().describe('The complete conversation between the lead and the agent.'),
});
export type SummarizeLeadConversationInput = z.infer<typeof SummarizeLeadConversationInputSchema>;

const SummarizeLeadConversationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the lead conversation.'),
});
export type SummarizeLeadConversationOutput = z.infer<typeof SummarizeLeadConversationOutputSchema>;

export async function summarizeLeadConversation(input: SummarizeLeadConversationInput): Promise<SummarizeLeadConversationOutput> {
  return summarizeLeadConversationFlow(input);
}

const summarizeLeadConversationPrompt = ai.definePrompt({
  name: 'summarizeLeadConversationPrompt',
  input: {schema: SummarizeLeadConversationInputSchema},
  output: {schema: SummarizeLeadConversationOutputSchema},
  prompt: `Summarize the following lead conversation. Focus on key details, important points, and the overall context of the conversation.  The output should be a concise summary, no more than 200 words.\n\nConversation:\n{{{conversation}}}`,
});

const summarizeLeadConversationFlow = ai.defineFlow(
  {
    name: 'summarizeLeadConversationFlow',
    inputSchema: SummarizeLeadConversationInputSchema,
    outputSchema: SummarizeLeadConversationOutputSchema,
  },
  async input => {
    const {output} = await summarizeLeadConversationPrompt(input);
    return output!;
  }
);
