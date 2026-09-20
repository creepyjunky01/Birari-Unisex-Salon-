# Database

This app's real, executable database configuration lives under `/prisma`
(`prisma/schema.prisma` is the source of truth, `prisma/migrations/` holds
the versioned SQL migration, `prisma/seed.js` seeds default data).

This `/database` folder mirrors that schema and migration in plain SQL for
quick reference or for teams that want to inspect the structure without
installing Prisma:

- `schema/schema.sql` — full table definitions (mirrors the initial migration)
- `migrations/000001_init.sql` — the same statements as a versioned migration

If you ever change `prisma/schema.prisma`, regenerate a migration with:

```bash
npx prisma migrate dev --name <description>
```

and copy the newly generated file here to keep both in sync (optional —
Prisma's own migration history under `/prisma/migrations` is what the app
actually uses at runtime).
