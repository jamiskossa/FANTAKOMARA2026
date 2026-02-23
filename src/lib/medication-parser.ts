/**
 * Parsing intelligent des médicaments à partir du texte OCR
 * Utilise fuzzy matching pour correction automatique des fautes
 */

export interface ParsedMedication {
  name: string;
  dosage: string;
  quantity: number;
  instructions: string;
  confidence: number;
}

/**
 * Base de référence des médicaments courants
 */
const MEDICATION_REFERENCE = [
  { name: 'doliprane', alternatives: ['paracétamol', 'tylenol', 'panadol'] },
  { name: 'amoxicilline', alternatives: ['amoxicilline', 'augmentin'] },
  { name: 'ibuprofène', alternatives: ['advil', 'nurofen', 'ibupirac'] },
  { name: 'metformine', alternatives: ['glucophage'] },
  { name: 'lisinopril', alternatives: ['zestril', 'prinivil'] },
  { name: 'oméprazole', alternatives: ['loses', 'mopral'] },
  { name: 'atorvastatine', alternatives: ['tahor'] },
  { name: 'amlodipine', alternatives: ['norvasc'] },
  { name: 'simvastatine', alternatives: ['zocor'] },
  { name: 'losartan', alternatives: ['cozaar'] },
];

/**
 * Calcul de similarité Levenshtein (fuzzy matching)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const d = Array(len2 + 1)
    .fill(null)
    .map(() => Array(len1 + 1).fill(0));

  for (let i = 0; i <= len1; i++) d[0][i] = i;
  for (let j = 0; j <= len2; j++) d[j][0] = j;

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      d[j][i] = Math.min(
        d[j][i - 1] + 1,
        d[j - 1][i] + 1,
        d[j - 1][i - 1] + indicator
      );
    }
  }

  return d[len2][len1];
}

/**
 * Calcul de similarité (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLen = Math.max(str1.length, str2.length);
  return 1 - distance / maxLen;
}

/**
 * Trouve le meilleur match pour un nom de médicament
 */
function findBestMedicationMatch(input: string): string | null {
  let bestMatch = null;
  let bestScore = 0.5; // Seuil minimum de confiance

  for (const med of MEDICATION_REFERENCE) {
    const allNames = [med.name, ...med.alternatives];

    for (const name of allNames) {
      const score = calculateSimilarity(input, name);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = med.name;
      }
    }
  }

  return bestMatch;
}

/**
 * Extraction de dosage (ex: "500mg", "1000 mg", "2 tablets")
 */
function extractDosage(text: string): string {
  const dosagePattern = /(\d+(?:[.,]\d+)?)\s*(mg|g|ml|l|tabs?|cp|comprimés?|gélules?)/gi;
  const match = text.match(dosagePattern);
  return match ? match[0] : '';
}

/**
 * Extraction de quantité
 */
function extractQuantity(text: string): number {
  const quantityPattern = /(\d+)\s*(?:boîte|box|paquet|lot|flacon|bouteille)/i;
  const match = text.match(quantityPattern);
  return match ? parseInt(match[1]) : 1;
}

/**
 * Extraction des instructions (matin, soir, etc)
 */
function extractInstructions(text: string): string {
  const instructionKeywords = [
    'matin',
    'midi',
    'soir',
    'nuit',
    'avant',
    'après',
    'repas',
    'jeun',
    '3x par jour',
    'fois par jour',
  ];

  const found = instructionKeywords.filter((keyword) =>
    text.toLowerCase().includes(keyword)
  );

  return found.length > 0 ? found.join(', ') : '';
}

/**
 * Parse OCR text → Medications
 */
export function parseMedications(ocrText: string): ParsedMedication[] {
  if (!ocrText || typeof ocrText !== 'string') {
    return [];
  }

  // Split par lignes
  const lines = ocrText.split('\n').filter((line) => line.trim());
  const medications: ParsedMedication[] = [];

  for (const line of lines) {
    if (line.length < 3) continue; // Skip très court texte

    // Essayer de trouver un médicament
    const words = line.split(/[\s,;.]+/);
    let foundMedication = null;

    for (const word of words) {
      const match = findBestMedicationMatch(word);
      if (match) {
        foundMedication = match;
        break;
      }
    }

    if (foundMedication) {
      const dosage = extractDosage(line);
      const quantity = extractQuantity(line);
      const instructions = extractInstructions(line);
      const similarity = calculateSimilarity(
        line.toLowerCase(),
        foundMedication.toLowerCase()
      );

      medications.push({
        name: foundMedication,
        dosage: dosage || 'Non spécifié',
        quantity,
        instructions: instructions || 'Consulter ordonnance',
        confidence: Math.round(similarity * 100),
      });
    }
  }

  // Dédupliquer
  const uniqueMeds = Array.from(
    new Map(medications.map((m) => [m.name.toLowerCase(), m])).values()
  );

  return uniqueMeds;
}

/**
 * Valider qualité de l'OCR
 */
export function validateOCRQuality(ocrText: string): {
  isValid: boolean;
  confidence: number;
  reason?: string;
} {
  if (!ocrText || ocrText.length < 10) {
    return {
      isValid: false,
      confidence: 0,
      reason: 'Texte trop court - image non lisible',
    };
  }

  // Vérifier si on détecte au moins un mot-clé médical
  const medicalKeywords = [
    'médicament',
    'mg',
    'comprimé',
    'ordonnance',
    'patient',
    'dosage',
  ];
  const hasKeyword = medicalKeywords.some((kw) =>
    ocrText.toLowerCase().includes(kw)
  );

  const confidence = hasKeyword ? 0.8 : 0.5;

  return {
    isValid: confidence > 0.5,
    confidence,
    reason: hasKeyword ? undefined : 'Aucune donnée médicale détectée',
  };
}
