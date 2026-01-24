# PRINCIPLE APP

## 📦 Staging The PRINCIPLE [![version](https://img.shields.io/badge/version-0.1.11-blue)](https://github.com/myreceiptt/principle-app?tab=readme-ov-file#the-principle-of-prof-nota)

Link #1: [www.principle.id](https://www.principle.id/) [![status](https://img.shields.io/badge/deploy-live-red)](https://www.principle.id/)  
Link #2: [principle.endhonesa.com](https://principle.endhonesa.com/) [![status](https://img.shields.io/badge/deploy-live-brightgreen)](https://principle.endhonesa.com/)

---

---

## Maintenance by Prof. NOTA Evergreen Standard

This repo is intended to stay evergreen while remaining production-safe.

### Current Baseline (Jan 2026)

- Runtime: Node **24.x** (Vercel-compatible; see `.nvmrc` and `package.json#engines`)
- Package manager: pnpm **10.28.x** (lockfile: `pnpm-lock.yaml`)
- Types: `@types/node` **24.10.7** (pinned to match Node 24; 25.x intentionally deferred)
- Key packages: Next.js **16.1.4**, React **19.2.3**
- Deploy target: **Vercel auto-deploy from `main`**

### Monthly Evergreen Cycle (safe)

- `pnpm install`
- `pnpm up -L`
- If `@types/node` gets bumped, repin to **24.10.7**.
- `pnpm audit --audit-level moderate`
- `pnpm lint`
- `pnpm build`

### Quarterly Evergreen Cycle (major review)

- Review majors one at a time (framework/tooling), with a dedicated PR.
- Prefer `pnpm up --latest <pkg>` per-package rather than a blanket major bump.

---

---

## 🚀 Quick Start

```bash
pnpm install && pnpm dev
```

> If you find this useful, consider starring ⭐ the repository! Please!
>
> — Prof. NOTA

---

## 📜 Licensing & Usage

This project is protected under a [**Custom Limited License**](./LICENSE) [![License](https://img.shields.io/badge/license-Prof.NOTA%20Proprietary-orange.svg)](./LICENSE) by [Prof. NOTA & Prof. NOTA Inc.](https://nota.endhonesa.com/). See [PRICING.md](./PRICING.md) for usage tiers and [LICENSE](./LICENSE) for terms. Free usage is only allowed for cultural, and educational, for women- or child-focused projects approved by Prof. NOTA.

License available in multiple languages:

- 🏛️ [English (UK)](./licenses/LICENSE_en-GB.md)
- 🇮🇩 [Bahasa Indonesia](./licenses/LICENSE_ID.md)
- 🇺🇿 [Oʻzbekcha](./licenses/LICENSE_uz-Latn.md)
- 🇭🇰 [Cantonese – Hong Kong](./licenses/LICENSE_yue-Hant-HK.md)
- 🇲🇾 [Bahasa Malaysia](./licenses/LICENSE_ms-MY.md)
- 🇦🇪 [العربية – الإمارات](./licenses/LICENSE_ar-AE.md)

📩 Want to collaborate, deploy under your own brand, or inquire about licensing and permissions?  
Reach out to us at: [nota@endhonesa.com](mailto:nota@endhonesa.com)

---

## 📖 Manifestos

If you have already obtained the license, please read and understand the manifesto from [Prof. NOTA & Prof. NOTA Inc.](https://nota.endhonesa.com/) before starting to use it. Each deployment must respect the ideological foundation of Prof. NOTA Inc.

Manifestos are available in:

- 🏛️ [English (UK)](./manifestos/manifesto_en-GB.md)
- 🇮🇩 [Bahasa Indonesia](./manifestos/manifesto_id.md)
- 🇺🇿 [Oʻzbekcha](./manifestos/manifesto_uz-Latn.md)
- 🇭🇰 [Cantonese – Hong Kong](./manifestos/manifesto_yue-Hant-HK.md)
- 🇲🇾 [Bahasa Malaysia](./manifestos/manifesto_ms-MY.md)
- 🇦🇪 [العربية – الإمارات](./manifestos/manifesto_ar-AE.md)

---

## The PRINCIPLE of Prof. NOTA

### Play • Learn • Work

**We choose to remain as children.** Because from there comes the courage to try, the joy of falling and rising again, and the boundless imagination to see the world.

Children are often reckless, careless, clumsy, and bold. Brave not because they already know, but because they do not know yet — and they step forward to find out.

#### Play

Play is how we open the door. Everything new begins with curiosity. In play, there is no right or wrong — only experiments that lead to discoveries.

Sometimes play means being reckless, sometimes careless, even foolish. But through these moments, we experience what can never be learned from books. If we have not yet felt the pain, we have not yet learned the lesson.

#### Learn

Learning is the breath of every step. We never stop learning. Every mistake is a teacher, every failure is fuel. To know because we have experienced, to understand because we once fell — this is the kind of wisdom that grows from the ground up.

Learning makes play meaningful, and makes work no longer a burden.

#### Work

Work is the longer game. Not just routine, but the continuation of play and learning. We work to bring imagination into form, to turn what is only possible into something real.

And in work, too, we carry that same recklessness and bravery of children — not blind courage, but courage that transforms ignorance into wisdom.

---

## The PRINCIPLE of This PRINCIPLE APP

- **Play without fear, even recklessly.**
- **Learn without end, even from mistakes.**
- **Work without losing the soul of a child.**

> This repository is not only a digital product, but a space to prove that **the best work is done through learning, the best learning is done through play, and sometimes wisdom only arrives after we stumble, fall, and rise again.**

---

## 🛠️ Getting Started

### 📦 Install dependencies

```bash
pnpm install
```

### 🔍 Check outdated dependencies

```bash
pnpm outdated
```

### ⬆️ Upgrade dependencies interactively

```bash
pnpm up --interactive -i --latest
```

### 🧹 Cleaning and re-install dependencies

```bash
rm -rf node_modules pnpm-lock.yaml && pnpm install
```

### ▶️ Run development server

```bash
pnpm dev
```

### 🧪 Lint and check all the code quality

```bash
pnpm lint
```

### 🏗️ Build for production

```bash
pnpm build
```

### 🔍 Preview the production

```bash
pnpm start
```

---

## 📦 Resources

- [Prof. NOTA Inc.](https://nota.endhonesa.com/)
- [Prof. NOTA Console](https://prompt.endhonesa.com/)
- [Prof. NOTA Tutor](https://baca.endhonesa.com/)
- [Prof. NOTA Artefacts](https://docs.endhonesa.com/)

---

## 🤝 Contributing

Your contribution is not only welcome — it's part of the protocol.

If you believe in the mission of Prof. NOTA and want to help improve it, follow these simple steps:

1. Fork this repository
2. Create a new branch (`feature/your-feature-name`)
3. Commit your changes mindfully
4. Open a pull request to the `preview` branch

Before submitting your PR, make sure to run:

```bash
pnpm run lint
```

To keep our code clean and consistent.

If you have questions, feel free to open an issue or reach out via the Prof. NOTA community Discord.

> ✊ You’re not just contributing code — you’re shaping how the people eat, learn, and resist.
>
> — Prof. NOTA

---

### 🫂 Join Prof. NOTA Discord

For feedback, questions, or cultural-technical collaboration, join Prof. NOTA discord at [https://discord.gg/5KrsT6MbFm](https://discord.gg/5KrsT6MbFm).

---
