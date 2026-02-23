/**
 * Configuration spécifique de la Pharmacie Nouvelle d'Ivry
 * Solution monolocal - NON multi-tenant
 */

export const PHARMACY_CONFIG = {
  name: 'Pharmacie Nouvelle d\'Ivry',
  address: {
    street: 'Adresse à compléter',
    zipCode: '94200',
    city: 'Ivry-sur-Seine',
    country: 'France'
  },
  contact: {
    phone: '+33 (à compléter)',
    email: 'contact@pharmacie-ivry.fr',
    whatsapp: '+33 (à compléter)'
  },
  hours: {
    monday_friday: '09:00 - 19:00',
    saturday: '09:00 - 13:00',
    sunday: 'Fermée'
  },
  services: {
    clickAndCollect: true,
    delivery: false,
    videoCalls: true,
    prescriptionScanning: true
  },
  ai: {
    prescriptionAnalysis: true,
    medicationMatching: true,
    automatedReviewThreshold: 0.8
  },
  security: {
    hdsCompliant: true,
    dataRetentionDays: 30,
    encryptionLevel: 'AES256'
  }
} as const;

export type PharmacyConfig = typeof PHARMACY_CONFIG;
