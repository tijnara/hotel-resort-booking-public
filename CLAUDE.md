# Hotel Resort Booking Website Guidelines

## Architecture & Code Structure
* **Modular Pattern:** Place all domain logic under `src/modules/<domain_name>/` (e.g., `src/modules/bookings`, `src/modules/rooms`).
* **Exports:** Use named exports, not default exports.
* **Database & Server Actions:** Put database queries in `src/modules/<domain>/services/` and Server Actions in `src/modules/<domain>/actions/`.

## Quality & Safety Standards
* **Type Safety:** Always run `npx tsc --noEmit` after changing TypeScript files.
* **Formatting:** Run `npm run lint` before committing any changes.
* **Secrets:** Never write hardcoded API keys or Supabase Service Role keys in source files. Use process.env variables.
