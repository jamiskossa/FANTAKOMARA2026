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

### [ ] Step: Optimize Firestore Rules for List Queries (Owner First)

1. [ ] Reorder conditions in `list` rules: place `resource.data.clientId == request.auth.uid` BEFORE `isStaff()`
2. [ ] Apply the same reordering to `get` rules for consistency and performance
3. [ ] Verify if the "Missing or insufficient permissions" error for `supportMessages` is resolved
4. [ ] Update investigation.md with findings on Firestore read limits in list rules
