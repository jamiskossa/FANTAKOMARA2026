'use server';
/**
 * @fileOverview A Genkit flow for natural language product search.
 *
 * - naturalLanguageSearch - A function that handles natural language product queries.
 * - NaturalLanguageSearchInput - The input type for the naturalLanguageSearch function.
 * - NaturalLanguageSearchOutput - The return type for the naturalLanguageSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NaturalLanguageSearchInputSchema = z.string().describe('A natural language query for product search, e.g., "Find an anti-aging cream for sensitive skin."');
export type NaturalLanguageSearchInput = z.infer<typeof NaturalLanguageSearchInputSchema>;

const ProductSchema = z.object({
  id: z.string().describe('Unique identifier for the product.'),
  name: z.string().describe('The name of the product.'),
  description: z.string().describe('A short description of the product.'),
  price: z.number().optional().describe('The price of the product.'),
  category: z.string().optional().describe('The category of the product (e.g., "Soins Visage", "Compléments").'),
  brand: z.string().optional().describe('The brand of the product.'),
});

const NaturalLanguageSearchOutputSchema = z.array(ProductSchema).describe('A list of products that match the natural language query.');
export type NaturalLanguageSearchOutput = z.infer<typeof NaturalLanguageSearchOutputSchema>;

export async function naturalLanguageSearch(input: NaturalLanguageSearchInput): Promise<NaturalLanguageSearchOutput> {
  return naturalLanguageSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'naturalLanguageSearchPrompt',
  input: {schema: NaturalLanguageSearchInputSchema},
  output: {schema: NaturalLanguageSearchOutputSchema},
  prompt: `You are an intelligent product search engine for a pharmacy.\nYour task is to interpret a user's natural language query and provide a list of relevant products.\nFor each product, include an 'id', 'name', 'description', 'price', 'category', and 'brand'.\nThe 'id' should be a simple placeholder string, as you do not have a real database.\nThe 'price' should be a plausible number.\nIf no relevant products are found based on the query, return an empty array.\n\nUser Query: {{{it}}}`,
});

const naturalLanguageSearchFlow = ai.defineFlow(
  {
    name: 'naturalLanguageSearchFlow',
    inputSchema: NaturalLanguageSearchInputSchema,
    outputSchema: NaturalLanguageSearchOutputSchema,
  },
  async (query) => {
    const {output} = await prompt(query);
    return output!;
  }
);
