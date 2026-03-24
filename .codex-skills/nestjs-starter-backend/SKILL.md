---
name: nestjs-starter-backend
description: Use this skill when working in the nestjs-starter repository on backend features, refactors, bug fixes, DTOs, auth, Prisma, or module design. It captures the repo's required module layering, response and error contracts, auth and permission patterns, and delivery expectations.
---

# NestJS Starter Backend

## Overview

Use this skill for any code change inside the `nestjs-starter` repo that touches `src/`, `prisma/`, environment setup, or project structure.

Apply [`$backend-core-rules`](/Users/axrorbek/.codex/skills/backend-core-rules/SKILL.md) first, then use this skill to adapt those generic backend rules to this repository's exact conventions.

## Quick Start

1. Inspect the target module and preserve the existing layering: `application`, `domain`, `infrastructure`, `interfaces`.
2. Keep controllers thin and move business logic into services or domain objects.
3. Use repository interfaces plus DI tokens instead of coupling services to Prisma classes directly.
4. Preserve the global API contracts:
   `success/data/timestamp` response wrapper and unified error payloads.
5. When adding or changing endpoints, update guards, permissions, DTO validation, and Swagger together.
6. Before finishing, run the relevant verification command if dependencies are available.

## Repository Rules

### 1. Module Structure

- New backend features should follow the same shape as `auth` and `users`.
- Prefer one folder per module under `src/modules/<feature>`.
- Inside a module, use:
  `application/` for use-case services,
  `domain/` for entities and repository interfaces,
  `infrastructure/` for Prisma-backed adapters,
  `interfaces/` for controllers, DTOs, and Nest-facing entrypoints.
- Shared cross-cutting concerns belong under `src/shared`, not inside a feature module.

Reference: `references/repo-conventions.md`

### 2. Dependency Direction

- Controllers depend on services.
- Services depend on domain abstractions via tokens.
- Infrastructure implements domain interfaces.
- Do not inject Prisma repositories directly into controllers.
- Do not put persistence logic inside controllers or DTOs.
- Prefer path aliases with `@/` for cross-folder imports instead of deep relative imports.
- Keep same-folder imports relative only when that is the clearest option; otherwise use `@/` consistently.

### 3. HTTP Contract

- The app uses a global prefix of `/api`.
- Successful responses are wrapped by the global interceptor into:
  `success`, `data`, `timestamp`.
- Errors are normalized by the global exception filter into:
  `statusCode`, `error`, `message`, `code`, `path`, `timestamp`.
- If you introduce a custom HTTP exception, include a stable machine-readable `code`.

### 4. DTO and Validation Rules

- DTOs should use `class-validator` decorators, not only Swagger decorators.
- Because global validation uses `transform`, `whitelist`, and `forbidNonWhitelisted`, every request-facing DTO should be explicit about allowed fields and constraints.
- Reuse shared pagination query DTOs when the endpoint is paginated.
- If a DTO accepts arrays, enums, UUIDs, email, or passwords, validate them directly in the DTO.

### 5. Auth and Authorization

- Use `JwtAuthGuard` for authenticated endpoints.
- Add `PermissionsGuard` when access depends on permissions.
- Use the existing `Permissions(...)` decorator and values from `PERMISSIONS`.
- Keep permission resolution inside the auth layer; do not duplicate permission maps inside feature modules.
- When returning the authenticated user from request context, use the shape already established by the JWT strategy.
- Login, register, token, and credential flows belong to `auth`, not to business modules such as `users`.
- Feature modules like `users` should focus on entity management and protected CRUD behavior, while `auth` owns identity entrypoints.

### 6. Prisma and Persistence

- Prisma is the default persistence layer for this repo.
- Keep Prisma access in `infrastructure/` repositories or shared Prisma services.
- Repository interfaces should return domain entities or simple application-friendly results, not raw Prisma records leaking across layers.
- Update `prisma/schema.prisma` only when the feature truly changes persistence requirements.

### 7. Swagger and Discoverability

- Public endpoints should keep Swagger decorators aligned with the actual behavior.
- When an endpoint can fail with auth, permission, validation, or not-found conditions, document the important responses.
- Swagger examples should match the repo's wrapped success shape mentally and the shared error structure explicitly.
- Reusable API documentation should live inside the owning module, for example `src/modules/users/interfaces/users-api-docs.decorator.ts`, not in `shared`.
- If the same Swagger response block appears in more than one endpoint, extract it into a named decorator or helper instead of copying the schema repeatedly.

### 8. Logging

- Prefer the existing `@Loggable()` decorator plus interceptor instead of ad-hoc request logging in controllers.
- Keep logs structured and metadata-oriented.

## Delivery Workflow

1. Read the target module and find the nearest existing pattern.
2. Make the smallest change that fits the current architecture.
3. If you add an endpoint, update:
   controller, DTOs, service, repository abstraction, repository implementation, guards/permissions, and Swagger as needed.
4. If you add a paginated endpoint, wire it through the shared pagination contract.
5. If you add a new error case, keep it compatible with the shared exception filter.
6. Verify with available commands.

## Verification

- Preferred checks:
  `npm run build`
- If build tooling is unavailable, state that clearly and mention what could not be verified.
- If you notice an existing unrelated issue in the touched area, do not silently revert it. Work around it or call it out.

## Known Project Watchouts

- The current repo has signs that some DTOs are missing validation decorators; preserve or improve validation coverage rather than weakening it.
- Existing code may compile-fail in places unrelated to your change. Confirm whether the issue is pre-existing before treating it as a regression.
- `package.json` is minimal, so do not assume lint or test scripts exist unless you confirm them first.

## Resources

- For concrete repository conventions and examples, read `references/repo-conventions.md`.
