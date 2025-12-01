# Frontend (SkillSync)

Quick scaffolded frontend using Vite + React + TypeScript + Ant Design.

Getting started

1. Install dependencies (use `pnpm` if available):

```bash
cd frontend
pnpm install
# or
npm install
```

2. Run dev server:

```bash
pnpm dev
# or
npm run dev
```

3. The app assumes the backend is at `http://localhost:3000` by default. To change, set `VITE_API_URL` before running:

```bash
export VITE_API_URL="http://localhost:3000"
pnpm dev
```

Notes

- The UI uses Ant Design for consistent components.
- `src/pages/Roadmaps.tsx` calls `GET /api/roadmaps` and displays results.
- Add more pages that map to your backend APIs under `src/pages` and reuse the `src/services/api.ts` client.
