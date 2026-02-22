
'use server';
/**
 * @fileOverview Assistant IA pour conseiller les clients de la pharmacie.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssistantInputSchema = z.object({
  message: z.string().describe('Le message de l\'utilisateur.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional(),
});

const AssistantOutputSchema = z.string();

export async function pharmacyAssistant(input: z.infer<typeof AssistantInputSchema>): Promise<string> {
  const prompt = ai.definePrompt({
    name: 'pharmacyAssistantPrompt',
    input: {schema: AssistantInputSchema},
    output: {schema: AssistantOutputSchema},
    prompt: `Tu es l'assistant IA expert de la Pharmacie Nouvelle d'Ivry. 
    Ton but est d'aider les clients avec des conseils de santé bienveillants et professionnels.
    
    CONSIGNES :
    1. Sois toujours poli et professionnel.
    2. Si l'utilisateur pose une question médicale grave, suggère de consulter un médecin ou d'appeler le 15.
    3. Tu peux conseiller des produits de parapharmacie (dermo-cosmétique, vitamines, hygiène) disponibles à la pharmacie.
    4. Réponds en français.
    5. Ne donne jamais de dosage précis pour des médicaments sur ordonnance, renvoie vers le pharmacien.
    
    HISTORIQUE DE LA CONVERSATION :
    {{#each history}}
    {{role}}: {{content}}
    {{/each}}
    
    MESSAGE UTILISATEUR :
    {{{message}}}`
  });

  const {text} = await prompt(input);
  return text;
}
