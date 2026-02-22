'use server';
/**
 * @fileOverview A Genkit flow for generating personalized product recommendations based on user history.
 *
 * - personalizedProductRecommendations - A function that handles the personalized product recommendation process.
 * - PersonalizedProductRecommendationsInput - The input type for the personalizedProductRecommendations function.
 * - PersonalizedProductRecommendationsOutput - The return type for the personalizedProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductHistorySchema = z.object({
  name: z.string().describe('Product name.'),
  category: z.string().describe('Product category (e.g., "Santé", "Beauté", "Hygiène", "Bébé").'),
  description: z.string().optional().describe('Brief description of the product.'),
  price: z.number().optional().describe('Price of the product.'),
  purchasedDate: z.string().optional().describe('Date of purchase, if applicable.'),
  viewCount: z.number().optional().describe('Number of times the product was viewed, if applicable.'),
  lastViewedDate: z.string().optional().describe('Last date the product was viewed, if applicable.'),
});

const PersonalizedProductRecommendationsInputSchema = z.object({
  userProfile: z.object({
    name: z.string().optional().describe('The name of the user.'),
    age: z.number().optional().describe('The age of the user.'),
    skinType: z.string().optional().describe('The skin type of the user, e.g., "dry", "oily", "sensitive".'),
    concerns: z.array(z.string()).optional().describe('Specific health or beauty concerns of the user.'),
  }).optional().describe('Optional user profile information for better personalization.'),
  purchaseHistory: z.array(ProductHistorySchema).optional().describe('A list of products the user has previously purchased.'),
  browsingHistory: z.array(ProductHistorySchema).optional().describe('A list of products the user has recently browsed.'),
  currentCartItems: z.array(ProductHistorySchema).optional().describe('A list of products currently in the user\'s shopping cart. Products in this list should generally not be re-recommended unless explicitly for complementary purposes.'),
});
export type PersonalizedProductRecommendationsInput = z.infer<typeof PersonalizedProductRecommendationsInputSchema>;

const RecommendedProductSchema = z.object({
  productName: z.string().describe('The name of the recommended product.'),
  category: z.string().describe('The category of the recommended product (e.g., "Santé", "Beauté", "Hygiène", "Bébé").'),
  reason: z.string().describe('A concise reason why this product is recommended for the user, based on their history or profile.'),
  link: z.string().url().describe('A simulated URL for the product detail page.'),
});

const PersonalizedProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendedProductSchema).describe('A list of personalized product recommendations for the user.'),
  message: z.string().optional().describe('An optional message accompanying the recommendations.'),
});
export type PersonalizedProductRecommendationsOutput = z.infer<typeof PersonalizedProductRecommendationsOutputSchema>;

export async function personalizedProductRecommendations(input: PersonalizedProductRecommendationsInput): Promise<PersonalizedProductRecommendationsOutput> {
  return personalizedProductRecommendationsFlow(input);
}

const recommendationPrompt = ai.definePrompt({
  name: 'personalizedProductRecommendationPrompt',
  input: {schema: PersonalizedProductRecommendationsInputSchema},
  output: {schema: PersonalizedProductRecommendationsOutputSchema},
  prompt: `You are an expert personalized product recommendation assistant for Pharmacie Nouvelle d'Ivry, a pharmacy specializing in health, beauty, hygiene, and baby products. Your goal is to suggest highly relevant products to a user based on their past interactions and preferences.

Analyze the user's provided information:
{{#if userProfile}}
User Profile:
  Name: {{userProfile.name}}
  {{#if userProfile.age}}Age: {{userProfile.age}}{{/if}}
  {{#if userProfile.skinType}}Skin Type: {{userProfile.skinType}}{{/if}}
  {{#if userProfile.concerns.length}}Concerns:
  {{#each userProfile.concerns}}- {{this}}
  {{/each}}{{/if}}
{{/if}}

{{#if purchaseHistory.length}}
Purchase History:
{{#each purchaseHistory}}
  - Name: {{name}}, Category: {{category}}{{#if purchasedDate}}, Purchased: {{purchasedDate}}{{/if}}
{{/each}}
{{/if}}

{{#if browsingHistory.length}}
Browsing History:
{{#each browsingHistory}}
  - Name: {{name}}, Category: {{category}}{{#if viewCount}}, Viewed: {{viewCount}} times{{/if}}{{#if lastViewedDate}}, Last Viewed: {{lastViewedDate}}{{/if}}
{{/each}}
{{/if}}

{{#if currentCartItems.length}}
Current Cart Items:
{{#each currentCartItems}}
  - Name: {{name}}, Category: {{category}}
{{/each}}
{{/if}}

Based on this data, recommend 3-5 unique and relevant products that the user might be interested in. Focus on products that complement their past purchases, address their concerns, or are similar to their browsing interests. Avoid recommending items that are explicitly in their current cart unless there is a clear complementary product suggestion.
For each recommendation, provide a product name, its general category, a concise reason for the recommendation, and a simulated product URL.
Ensure the tone is helpful and professional, reflecting a pharmacy environment. The recommendations should be diverse if the history allows it (e.g., a mix of health and beauty if both are present in history).

Output format MUST be JSON, matching the specified schema.`,
});

const personalizedProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedProductRecommendationsFlow',
    inputSchema: PersonalizedProductRecommendationsInputSchema,
    outputSchema: PersonalizedProductRecommendationsOutputSchema,
  },
  async (input) => {
    const {output} = await recommendationPrompt(input);
    return output!;
  }
);
