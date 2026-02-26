# Investigation Report - Permission Denied on Dashboards

## Bug Summary
Users (both Clients and Collaborators) are encountering "MISSING OR INSUFFICIENT PERMISSION" errors when trying to access their respective dashboards. This prevents them from seeing their reservations, messages, or performing administrative tasks. Additionally, multiple console warnings and type errors were identified.

## Root Cause Analysis
1. **Firestore Read Limits in List Queries**:
   - The primary cause of "Permission Denied" for staff members was hitting the limit of 10 `get()` or `exists()` calls per request. 
   - In Firestore Security Rules, if a `list` rule contains a `get()` call (e.g., inside `isStaff()`), that call is evaluated for *every* document in the result set. Even if the result is cached, it still counts towards the 10-call limit in many scenarios.
   - For a query with `limit(100)`, the limit was hit instantly.
2. **Missing `sizes` prop on Next.js Images**:
   - The `Image` component with the `fill` prop in `Header.tsx` was missing the `sizes` prop, causing performance warnings.
3. **Type Incompatibilities**:
   - `react-day-picker` v9 introduced breaking changes in component names (`IconLeft`/`IconRight` -> `Chevron`) and class names.
   - AI-extracted data in `scan-ordonnance` had missing fields in the TS interface.
   - Missing `serverTimestamp` import in `AdminDashboard`.

## Affected Components
- `firestore.rules`: Permission logic.
- `src/components/layout/Header.tsx`: Image performance and hydration.
- `src/components/ui/calendar.tsx`: `react-day-picker` compatibility.
- `src/app/client/dashboard/page.tsx`: Type errors and list queries.
- `src/app/admin/dashboard/page.tsx`: Missing imports.
- `src/app/scan-ordonnance/page.tsx`: AI data typing.

## Solution Implemented
1. **Firestore Rules Optimization**:
   - Simplified `getUserRole()` to use a direct `get()` call and reused the result.
   - Reordered `list` rules to check ownership (`resource.data.clientId == request.auth.uid`) BEFORE calling `isStaff()`. This allows short-circuiting for clients, avoiding the `get()` call entirely.
2. **Performance Fixes**:
   - Added `sizes` prop to `Image` components in `Header.tsx` and `PromotionCarousel.tsx`.
3. **Type Safety & Compatibility**:
   - Migrated `Calendar` component to `react-day-picker` v9 syntax and class names.
   - Fixed missing imports (`serverTimestamp`) and type casting in dashboards and scan page.
   - Used `React.ReactNode` instead of `JSX.Element` for better compatibility.

## Verification Results
- `npm run typecheck`: PASSED.
- Firestore rules optimized to avoid excessive read calls.
- Image warnings resolved.
