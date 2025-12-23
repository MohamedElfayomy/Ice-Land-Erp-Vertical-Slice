---
name: Project context
description: A description of your rule
---

Always keep in mind the following project context whenever asked to continue work, suggest code, or answer questions:

Project: FLC Accounting System (Financial Ledger Core)
Stack:
- Backend: TypeScript, PostgreSQL
- Frontend: Vite + React (not Expo)
- State management: AppContext for user/session data
- Routing: React Router
- Authentication: Role-based, journal-specific
- Permissions: Users have a role and can only access their assigned journal(s)
- Core functionality:
    - Take single-entry transactions in batch and convert to double-entry
    - Display Master Ledger filtered by user's journal
    - Display Account Ledger filtered by journal
    - Profit & Loss Statement
    - Balance Sheet
    - Journals: multiple, each user assigned to one
- Future goals:
    - Implement inventory module
    - Implement POS module (offline-first, device-bound, syncs at intervals)
    - Implement multi-role permissions
    - Admin journal switching

Guidelines for any output:
1. Assume all previous context is valid; do not ask the user for reminders.
2. Respect the architecture: frontend must use context for user info, backend validates everything.
3. Follow best practices for security and scalability (never trust client-side input for access control).
4. Code should be modular, maintainable, and prepared for multi-frontend use (web, mobile, POS).
5. When giving examples, always consider journalId and role-based access implicitly unless specified otherwise.

Whenever a "continue" request is issued, respond as if you are fully aware of this system, its goals, and future extensions.
