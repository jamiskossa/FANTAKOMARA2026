# 🔒 Guide de Sécurité - Pharmacie Nouvelle d'Ivry

## ⚠️ ALERTE SÉCURITÉ CRITIQUE

Une clé API Firebase a été **exposée publiquement sur GitHub** dans l'historique Git.

**Clé compromise :** `AIzaSyD4C8NWeI8_jgOuRRN4xZDyYspYkUNLwlc`

### Actions prises ✅

1. **Clé désactivée** sur Google Cloud Console
2. **Nouvelle clé générée** 
3. **.env.local** créé avec variables sécurisées
4. **Git history nettoyé** avec `git filter-branch`

---

## 📋 Configuration des Secrets

### 1. Copier `.env.example` → `.env.local`

```bash
cp .env.example .env.local
```

### 2. Remplir les vraies valeurs

Récupérez les valeurs depuis [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

- **API Key** : Créer une nouvelle clé (remplacer celle exposée)
- **Auth Domain, Project ID, etc.** : Copier depuis Firebase Console

### 3. NE JAMAIS commiter `.env.local`

Le `.gitignore` empêche cela, mais vérifiez toujours :

```bash
git status  # Vérifier que .env.local n'apparaît PAS
```

---

## 🔐 Sécurité Firebase Firestore

### Règles actuelles (`firestore.rules`)

- **Authentification requise** pour la plupart des opérations
- **Contrôle d'accès par rôle** : admin, collaborator, client
- **Chiffrement AES256** pour données sensibles

### Déployer les règles

```bash
firebase deploy --only firestore:rules
```

---

## 🚨 Bonnes pratiques

✅ **À FAIRE**
- Variables d'environnement pour tous les secrets
- `.env.local` dans `.gitignore`
- Audit des clés API tous les 3 mois
- Logs d'accès Firestore activés
- Authentification obligatoire

❌ **À NE PAS FAIRE**
- Commiter `.env.local`, `.env`, ou fichiers secrets
- Hardcoder les clés dans le code
- Partager les clés par email/Slack
- Utiliser même clé pour dev/prod

---

## 📞 Incidents de sécurité

Si vous trouvez une autre clé exposée :

1. **Immédiatement** : Désactiver la clé sur Google Cloud
2. **Générer** une nouvelle clé
3. **Mettre à jour** `.env.local`
4. **Vérifier** les logs d'accès pour détection d'abus
5. **Documenter** dans ce fichier

---

## 🔍 Vérification

Vérifier qu'aucune clé n'est exposée :

```bash
# Chercher les clés API dans le code
git log -p -S "AIzaSy" -- src/

# Chercher les patterns secrets
grep -r "FIREBASE_API_KEY=" src/
```

Doit retourner **zéro résultat** (sauf dans `.env.example`).

---

**Dernière vérification** : 2026-02-23  
**Responsable** : Dev Team  
**Statut** : 🟢 Sécurisé
