# Repo Conventions

## Canonical Files

- Bootstrap and global contracts: `src/main.ts`
- Root module wiring: `src/app.module.ts`
- Shared error format: `src/shared/exceptions/http-exception.filter.ts`
- Shared success format: `src/shared/interceptors/response-wrapper.interceptor.ts`
- Shared pagination DTO: `src/shared/validation/pagination.query.ts`
- Shared Prisma entrypoint: `src/shared/prisma/prisma.service.ts`
- Auth permission model: `src/modules/auth/permissions.ts`
- Auth role mapping: `src/modules/auth/role-permissions.map.ts`
- Example feature module: `src/modules/users`

## Concrete Patterns To Reuse

### Module Wiring

- Expose Nest providers from `<feature>.module.ts`.
- Bind repository interfaces through a token such as `USER_REPOSITORY`.

### Service Layer

- Services orchestrate use-cases and use injected repository abstractions.
- Hashing, permission lookup, and orchestration belong here unless they are true domain invariants.

### Domain Layer

- Entities should hide mutable state behind methods such as `rename` or `changeEmail`.
- Repository interfaces live here so application code depends on abstractions.

### Infrastructure Layer

- Prisma-backed repositories translate Prisma records into domain objects.
- Keep record mapping local to repository implementations.

### Interface Layer

- Controllers map HTTP requests to service calls.
- DTOs define and validate request payloads.
- Controller responses should shape only endpoint-specific payload data; the global response wrapper adds top-level success metadata.

## HTTP Behavior

- Successful endpoint returns become `{"success": true, "data": ..., "timestamp": ...}` at runtime.
- Errors become `{"statusCode": ..., "error": ..., "message": ..., "code": ..., "path": ..., "timestamp": ...}`.
- Validation failures use code `VALIDATION_ERROR`.

## Auth Behavior

- JWT payload includes `sub`, `email`, `roles`, `permissions`.
- Request user shape is `userId`, `email`, `roles`, `permissions`.
- Permissions are the preferred access-control primitive for feature endpoints.

## Practical Editing Rules

- Preserve the current folder naming and import style unless there is a strong reason to refactor.
- Prefer extending existing shared utilities over duplicating helper logic inside modules.
- When adding pagination, align with `PaginationQuery` and pagination metadata helpers.
