# Deploy

Dua project Vercel dari satu repo. Yang membedakan cuma **Root Directory**.

## PENTING sebelum merge Phase 0 ke `main`

Situs profesional sekarang di-deploy dari root repo. Setelah Phase 0, kodenya
pindah ke `apps/main/` — jadi **deploy bakal gagal begitu ini masuk `main`,
sampai Root Directory di Vercel diganti.** Ganti setting-nya dulu, atau siap-siap
satu deploy merah.

## Project 1 — situs profesional (yang udah ada)

Di Vercel dashboard → project yang sekarang → Settings → General:

| Setting | Nilai |
|---|---|
| Root Directory | `apps/main` |
| Framework Preset | Vite |
| Build Command | (biarin default) |
| Install Command | (biarin default) |

**Jangan bikin project baru.** Domain yang sekarang harus tetep, karena link ke
situs ini udah kesebar (`INF-A5`).

## Project 2 — lab (nanti, setelah ada isinya lagi)

Lab-nya di-reset ke scaffold 23 Ags 2026 — belum ada yang layak di-deploy.
Setting-nya nanti kalau udah waktunya:

New Project → repo yang sama:

| Setting | Nilai |
|---|---|
| Root Directory | `apps/lab` |
| Framework Preset | Vite |

Domainnya subdomain dari domain utama.

## Catatan npm workspaces

Vercel ngedeteksi npm workspaces sendiri dan install dari root repo, jadi
`@zaidan/data` keresolve dari dua project tanpa setting tambahan. Nggak perlu
`vercel.json` — sengaja nggak dibikin, biar nggak ada dua tempat yang ngatur hal
yang sama.
