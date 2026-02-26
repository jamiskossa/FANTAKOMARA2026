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
