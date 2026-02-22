
'use server';
/**
 * @fileOverview Flux IA pour suggérer des réapprovisionnements de stock.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RestockInputSchema = z.object({
  productName: z.string(),
  currentStock: z.number(),
  salesHistory: z.array(z.object({
    date: z.string(),
    quantity: z.number()
  })).describe('Historique des ventes récentes')
});

const RestockOutputSchema = z.object({
  suggestedQuantity: z.number(),
  reason: z.string(),
  priority: z.enum(['low', 'medium', 'high'])
});

export async function suggestRestock(input: z.infer<typeof RestockInputSchema>) {
  const prompt = ai.definePrompt({
    name: 'restockSuggestionPrompt',
    input: {schema: RestockInputSchema},
    output: {schema: RestockOutputSchema},
    prompt: `Tu es un assistant expert en gestion de stock pour la Pharmacie Nouvelle d'Ivry.
    Produit : {{productName}}
    Stock actuel : {{currentStock}}
    Historique : {{#each salesHistory}}- {{date}}: {{quantity}} vendus{{/each}}
    
    Analyse la tendance et suggère une quantité à commander pour les 30 prochains jours.`
  });

  const {output} = await prompt(input);
  return output!;
}
