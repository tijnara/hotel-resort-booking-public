---
name: verify-changes
description: Trigger this skill when finishing feature implementation, refactoring, or bug fixes to verify code validity.
---

# Change Verification Procedure

Run the following validation steps sequentially to verify your work:

1. **Type Checking:** Run `npx tsc --noEmit` and confirm zero TypeScript errors.
2. **Linting Check:** Run `npm run lint` to confirm formatting compliance.
3. **Diff Inspection:** Run `git diff` to review all modified files:
   - Check that no console logs or hardcoded secrets were added.
   - Confirm no existing types or parameters were deleted unintentionally.
4. **Final Summary:** Output a clean pass/fail summary based on the results above.
