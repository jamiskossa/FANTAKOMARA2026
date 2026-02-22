'use server';
/**
 * @fileOverview A Genkit flow for extracting medication details from prescription images.
 *
 * - extractPrescriptionInformation - A function that handles the prescription information extraction process.
 * - PrescriptionInformationExtractorInput - The input type for the extractPrescriptionInformation function.
 * - PrescriptionInformationExtractorOutput - The return type for the extractPrescriptionInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrescriptionInformationExtractorInputSchema = z.object({
  prescriptionImage: z
    .string()
    .describe(
      "A photo of a prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type PrescriptionInformationExtractorInput = z.infer<
  typeof PrescriptionInformationExtractorInputSchema
>;

const MedicationDetailSchema = z.object({
  name: z.string().describe('The name of the medication.'),
  dosage: z.string().describe('The dosage of the medication (e.g., "10mg", "2 pills").'),
  quantity: z.string().describe('The quantity of the medication (e.g., "30 tablets", "1 bottle").'),
  instructions: z.string().describe('Clear instructions for taking the medication.'),
});

const PrescriptionInformationExtractorOutputSchema = z.object({
  medications: z.array(MedicationDetailSchema).describe('An array of extracted medication details.'),
});
export type PrescriptionInformationExtractorOutput = z.infer<
  typeof PrescriptionInformationExtractorOutputSchema
>;

export async function extractPrescriptionInformation(
  input: PrescriptionInformationExtractorInput
): Promise<PrescriptionInformationExtractorOutput> {
  return prescriptionInformationExtractorFlow(input);
}

const prescriptionInformationPrompt = ai.definePrompt({
  name: 'prescriptionInformationPrompt',
  input: {schema: PrescriptionInformationExtractorInputSchema},
  output: {schema: PrescriptionInformationExtractorOutputSchema},
  prompt: `You are an AI assistant specialized in extracting medication details from prescription images.

Your task is to accurately identify and extract the following information for each medication listed in the provided prescription image:
- Medication Name
- Dosage
- Quantity
- Clear instructions on how to take the medication

Return the extracted information in a structured JSON format, as an array of medication objects.

Prescription Image: {{media url=prescriptionImage}}`,
});

const prescriptionInformationExtractorFlow = ai.defineFlow(
  {
    name: 'prescriptionInformationExtractorFlow',
    inputSchema: PrescriptionInformationExtractorInputSchema,
    outputSchema: PrescriptionInformationExtractorOutputSchema,
  },
  async input => {
    const {output} = await prescriptionInformationPrompt(input);
    if (!output) {
      throw new Error('Failed to extract prescription information.');
    }
    return output;
  }
);
