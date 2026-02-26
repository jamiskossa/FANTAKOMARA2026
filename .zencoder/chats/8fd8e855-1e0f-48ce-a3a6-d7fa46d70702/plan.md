# Fix bug

## Workflow Steps

### [x] Step: Investigation and Planning

Analyze the bug report and design a solution.

1. [x] Review the bug description, error messages, and logs
2. [x] Clarify reproduction steps with the user if unclear
3. [x] Check existing tests for clues about expected behavior
4. [x] Locate relevant code sections and identify root cause
5. [x] Propose a fix based on the investigation
6. [x] Consider edge cases and potential side effects

Save findings to `c:\Users\kanko\Documents\FANTAKOMARA2026-main\.zencoder\chats\8fd8e855-1e0f-48ce-a3a6-d7fa46d70702/investigation.md` with:

- Bug summary
- Root cause analysis
- Affected components
- Proposed solution

### [x] Step: Implementation

1. [x] Add/adjust regression test(s) that fail before the fix and pass after
2. [x] Implement the fix
3. [x] Run relevant tests
4. [x] Update `c:\Users\kanko\Documents\FANTAKOMARA2026-main\.zencoder\chats\8fd8e855-1e0f-48ce-a3a6-d7fa46d70702/investigation.md` with implementation notes and test results

### [x] Step: Optimize Firestore Rules and UI Performance

1. [x] Reorder conditions in `list` rules: place `resource.data.clientId == request.auth.uid` BEFORE `isStaff()`
2. [x] Simplify `getUserRole()` and role checking logic in `firestore.rules`
3. [x] Fix `next/image` warnings by adding `sizes` prop
4. [x] Resolve `react-day-picker` v9 type errors and component changes
5. [x] Fix missing imports and type mismatches across dashboards
6. [x] Verify with `npm run typecheck`

### [x] Step: Fix Firebase Initialization Warning/Error

1. [x] Identify why `initializeApp()` is failing and being caught with a warning in production (missing automatic options)
2. [x] Modify `src/firebase/index.ts` to remove noisy warnings and handle fallback correctly
3. [x] Fix `useCollection` and `useDoc` hooks to preserve original Firestore error codes (helps debug missing indexes)
4. [x] Add missing composite indexes to `firestore.indexes.json`
5. [x] Make `firestore.rules` more robust with `exists()` checks in role resolution
6. [x] Verify that Firebase is correctly initialized in all environments

### [x] Step: Refine Firestore Indexes and Rules for Dashboard Access

1. [x] Add precise composite index for `reservations` with `clientId` (Asc), `createdAt` (Desc), and `__name__` (Desc)
2. [x] Update `firestore.rules` to use `resource.data.get('clientId', '')` for safe ownership checks
3. [x] Verify that "failed-precondition" (missing index) errors are resolved (by allowing the hook to show the REAL error)
4. [x] Ensure that "permission-denied" errors are not caused by missing fields in documents
