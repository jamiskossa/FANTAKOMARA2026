---
description: Repository Information Overview
alwaysApply: true
---

# Pharmacie Nouvelle d'Ivry Online Information

## Summary
A comprehensive Next.js-based online pharmacy platform. Key features include a product catalog, shopping cart, user account management, "Click & Collect" services, prescription scanning ("Scan Ordonnance"), AI-powered product recommendations via Google Genkit, and a health/beauty blog.

## Structure
- **src/app/**: Next.js App Router routes for admin, client, blog, and e-commerce features.
- **src/components/**: UI components organized by feature (admin, home, layout, ui, etc.).
- **src/firebase/**: Firebase SDK configuration, Firestore rules, and authentication providers.
- **src/ai/**: AI flows and configuration using Google Genkit.
- **src/lib/**: Utility logic for image compression, medication parsing, and pharmacy configuration.
- **src/hooks/**: Custom React hooks for UI and state management.
- **docs/**: Technical blueprints and backend schema definitions.
- **public/**: Static assets and images.

## Language & Runtime
**Language**: TypeScript  
**Version**: 5.9.3  
**Build System**: Next.js (v15.5.9)  
**Package Manager**: npm  

## Dependencies
**Main Dependencies**:
- `next`: 15.5.9
- `react`: 19.2.1
- `firebase`: 11.9.1
- `genkit`: 1.28.0 (AI Framework)
- `@genkit-ai/google-genai`: 1.28.0
- `zod`: 3.24.2 (Validation)
- `react-hook-form`: 7.54.2
- `recharts`: 2.15.1 (Data Visualization)
- `lucide-react`: 0.475.0 (Icons)

**Development Dependencies**:
- `tailwindcss`: 3.4.1
- `typescript`: 5.9.3
- `genkit-cli`: 1.28.0
- `postcss`: 8

## Build & Installation
```bash
# Install dependencies
npm install

# Run development server (on port 9002)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint and typecheck
npm run lint
npm run typecheck
```

## Testing

**Framework**: Firebase Rules Unit Testing (`@firebase/rules-unit-testing`)
**Test Location**: `firestoreRulesTest.js`
**Naming Convention**: Standalone test script for security rules.
**Configuration**: `firestore.rules`, `firebase.json`

**Run Command**:
```bash
# To run Firestore rules validation tests
node firestoreRulesTest.js
```
