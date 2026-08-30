# Deploy

Tiga project Vercel dari satu repo (satu profesional, dua lab). Yang
membedakan cuma **Root Directory**.

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

## Project 2 — 3D Lab (`apps/lab-3d`) — **ditahan**

**Belum jalan.** Rencana lama nyebut satu direktori `apps/lab` — itu udah
kesplit jadi dua lab terpisah (`apps/lab-3d`, `apps/lab-term`), dan
`apps/lab-3d` sendiri masih di branch lain yang belum di-merge ke `main`
(PR [#6](https://github.com/Ibnusabil43/zaidan-profile/pull/6), ditahan atas
permintaan user 29 Ags 2026 — lihat `docs/lab-term-roadmap.md` tabel
blocker). Settingnya nanti:

| Setting | Nilai |
|---|---|
| Root Directory | `apps/lab-3d` |
| Framework Preset | Vite |

## Project 3 — Terminal Lab (`apps/lab-term`)

New Project → repo yang sama:

| Setting | Nilai |
|---|---|
| Root Directory | `apps/lab-term` |
| Framework Preset | Vite |
| Build Command | (biarin default) |
| Install Command | (biarin default) |

Domainnya subdomain dari domain utama (FR-14 / `LAB-F4`). **Sesudah domain
asli ada, empat URL absolut di `apps/lab-term/index.html`** (`canonical`,
`og:url`, `og:image` x2 kena hitung juga di `og:image:*`, `twitter:image`) —
sekarang isinya placeholder `zaidan-terminal-lab.vercel.app` — **harus
diganti ke domain sungguhan**, sama persis jebakan yang udah kejadian di
situs profesional (lihat `docs/ROADMAP.md` checkpoint Phase 1).

## Catatan npm workspaces

Vercel ngedeteksi npm workspaces sendiri dan install dari root repo, jadi
`@zaidan/data` keresolve dari dua project tanpa setting tambahan. Nggak perlu
`vercel.json` — sengaja nggak dibikin, biar nggak ada dua tempat yang ngatur hal
yang sama.
