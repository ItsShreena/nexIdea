# Security Spec - NexIdea Venture Assessor

## 1. Data Invariants
- `users`: Every user document must only be read or written to by its authenticated owner.
- `startup_analyses`: Users can only read, list, and delete their own startup analysis documents. Deletions require matching owners. Reports are immutable; update is blocked.

## 2. The "Dirty Dozen" Payloads (Identity & Integrity Attack Vectors)
1. **Unauthenticated Read**: Requesting `/startup_analyses/analysis123` with no credentials. (Denied)
2. **Identity Theft (Other's Profile)**: Retreiving `/users/userABC` when authenticated as `userXYZ`. (Denied)
3. **Cross-User Leak**: Listing `/startup_analyses` without matching `userId`. (Denied)
4. **Report Deletion Hijack**: Deleting `/startup_analyses/analysisXYZ` belonging to another user. (Denied)
5. **Report Self-Impersonation**: Creating a report with `userId` set to another user's UID. (Denied)
6. **Immutable Update Bypass**: Attempting to edit/update an existing report. (Denied)
7. **Resource Poisoning (Junk Name)**: Providing a 1MB string for `name`. (Denied)
8. **Shadow Fields Injection**: Creating a report with unexpected keys (e.g. `isVerifiedAdmin: true`). (Denied)
9. **Invalid ID Character Ingress**: Target document ID containing dangerous URL or directory escape characters. (Denied)
10. **Ghost User Account Injection**: Attempting to create user document with other profile attributes. (Denied)
11. **Malicious Content Ingress**: Creating a report with an excessively large `ideaDescription` over-running text bounds (size > 2000). (Denied)
12. **Anonymous Forfeiture**: Accessing standard private user routes without verified credentials. (Denied)

## 3. Test Rules Configuration
The security boundaries will be validated using standard rules rulesets before deployment.
