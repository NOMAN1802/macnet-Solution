# Macnet Solutions website

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · Prisma 6 on MongoDB · Auth.js (credentials) · motion · react-three-fiber.

All catalogue, project, testimonial, team and post content is **mock data** (`isMock: true`) until the CMS is filled with real content.

## Run locally

Requirements: Node 20+, pnpm, Docker Desktop.

```bash
cp .env.example .env        # then set AUTH_SECRET, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
pnpm install
pnpm db:up                  # MongoDB single-node replica set on localhost:27018
pnpm db:push                # create collections and indexes
pnpm db:seed                # mock products, projects, offices + admin user
pnpm dev                    # http://localhost:3000
```

Admin: http://localhost:3000/admin (sign in with SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD).

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js dev, production build, production server |
| `pnpm lint` / `pnpm typecheck` | ESLint, route typegen + `tsc --noEmit` |
| `pnpm db:up` | Start local MongoDB (Docker) |
| `pnpm db:push` / `pnpm db:seed` / `pnpm db:studio` | Schema push, mock seed, Prisma Studio |
| `pnpm placeholders` | Regenerate the SVG placeholder images |

## Notes

- **Prisma 6, not 7**: Prisma 7 does not support MongoDB yet.
- **Deploying to Vercel**: set `DATABASE_URL` to a MongoDB Atlas URL (the build reads the catalogue to pre-render product pages), plus `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `LEAD_ALERT_EMAIL`.
- **Lead email alerts** are not wired yet (no mail provider chosen). Leads are saved and shown in /admin.
- **Logo**: a text wordmark is used until the logo is placed in `public/brand/`.
- Catalogue pages are cached with the `catalog` / `content` cache tags; admin edits should call `revalidateTag` on these.
