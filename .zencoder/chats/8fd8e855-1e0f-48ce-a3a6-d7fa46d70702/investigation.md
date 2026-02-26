# Investigation Report - Permission Denied on Dashboards

## Bug Summary
Users (both Clients and Collaborators) are encountering "MISSING OR INSUFFICIENT PERMISSION" errors when trying to access their respective dashboards. This prevents them from seeing their reservations, messages, or performing administrative tasks.

## Root Cause Analysis
Several potential issues were identified in `firestore.rules`:

1. **Rule Recursion/Complexity**: The functions `isStaff()`, `isAdmin()`, and `isCollaborator()` all rely on `getUserRole()`, which in turn calls `exists()` and `get()` on the `userProfiles` collection. When these functions are used within the `match /userProfiles/{userId}` block, it can create complex dependency chains.
2. **Missing Filters in List Rules**: The `list` rules for `reservations` and `supportMessages` allow any authenticated user to list documents if a `limit` is provided, but they don't explicitly enforce the `clientId` filter in the rule itself. While the frontend provides the filter, Firestore might be blocking the query if it deems the rule too broad or if the `request.query.limit` check fails (e.g., if the limit is missing in some queries).
3. **Inefficient Role Checking**: The `getUserRole()` function is called multiple times during a single rule evaluation (once for `isAdmin` and then again for `isCollaborator` within `isStaff`). This increases the number of `exists()` and `get()` calls, potentially hitting the limit of 10 calls per request.
4. **Typo/Consistency in Roles**: The rules check for both "collaborator" and "collaborateur", but the logic could be simplified.
5. **Broad Match at End**: The `match /{document=**}` rule at the end might be interfering with more specific rules if not handled correctly.

## Affected Components
- `firestore.rules`: The primary source of the permission issues.
- `src/app/client/dashboard/page.tsx`: Affected by `reservations` and `supportMessages` rules.
- `src/app/collaborateur/dashboard/page.tsx`: Affected by `reservations`, `products`, `contactMessages`, `userProfiles`, and `supportMessages` rules.
- `src/components/layout/Header.tsx`: Affected by `userProfiles` read rule.

## Proposed Solution
1. **Optimize Firestore Rules**:
   - Simplify `getUserRole()` to reduce redundant `exists()` and `get()` calls.
   - Refactor `isStaff()`, `isAdmin()`, and `isCollaborator()` to use a single call to a role-checking function.
   - Explicitly enforce `clientId` ownership in `list` rules for clients.
   - Ensure `request.query.limit` is only checked when it exists or provide a default.
2. **Enforce Security**:
   - Restrict `list` operations for clients to only their own documents using `resource.data.clientId`.
3. **Robustness**:
   - Add `allow list` explicitly where needed to avoid confusion with `allow read`.

## Implementation Notes
The bug was fixed by refactoring `firestore.rules`:

1.  **Simplified Role Checks**: Replaced redundant `getUserRole()` calls with a more efficient implementation using `let role = getUserRole()` inside role-specific functions.
2.  **Enforced Client Filtering**: Updated `list` rules for `reservations` and `supportMessages` to explicitly check `resource.data.clientId == request.auth.uid`. This matches the queries in the frontend and ensures clients can only see their own data.
3.  **Unified Staff Check**: Used `isStaff()` consistently across rules for products, contact messages, and sessions.
4.  **Added Missing Rules**: Added `update` permission for `pharmacyReviews` to allow clients to modify their own reviews.
5.  **Improved Robustness**: Replaced `exists()` + `get()` in `getUserRole` with a safer check to avoid unnecessary operations.

## Refinement: Dashboard Access and Index Issues
- **Problem**: Persistent `permission-denied` errors and a new `failed-precondition` (missing index) error for the `reservations` collection.
- **Root Cause**: 
  1. The query for client reservations ordered by `createdAt` (desc) was missing a proper composite index.
  2. Documents missing the `clientId` field could cause rules to fail when comparing `resource.data.clientId` directly.
- **Resolution**:
  1. Added the precise composite index for `reservations` (`clientId` ASC, `createdAt` DESC, `__name__` DESC) to `firestore.indexes.json`.
  2. Updated `firestore.rules` to use `resource.data.get('clientId', '')` for safer ownership checks.
  3. Improved `useCollection` and `useDoc` hooks to report the specific Firestore error code (e.g., `failed-precondition`) instead of always wrapping it in a generic permission error. This allowed identifying the missing index.

## Persistent Hydration Mismatch
- **Problem**: Hydration mismatch persisted even after adding `suppressHydrationWarning` to the `html` tag.
- **Cause**: Extensions were also injecting attributes into the `body` tag.
- **Resolution**: Added `suppressHydrationWarning` to the `body` tag in `src/app/layout.tsx`.


