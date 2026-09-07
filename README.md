<div align="center">

# Fuego Fridays Starter

**Build the front-end for an AI teammate. In 45 minutes.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-new--york-000000?logo=shadcnui&logoColor=white)

</div>

A front-end-only React starter for building humorphic AI-teammate interactions.
There is no backend and no real model. The interaction is the deliverable.

Try out a demo of this project by [clicking here](https://vacobb.github.io/fuego-fridays-starter/).

## Contents

- [The challenge](#the-challenge)
- [Quick start](#quick-start)
- [What's inside](#whats-inside)
- [Working with Kiro](#working-with-kiro)
- [Rules](#rules)
- [Reference](#reference)
- [Requirements](#requirements)
- [Tech stack](#tech-stack)

## The challenge

Pick one humorphic pattern. Build it into an experience that's relevant to you,
personally or at work.

Browse the patterns at
[humorphism.com/foundations](https://humorphism.com/foundations). The pattern is
the constraint. The domain is yours.

## Quick start

Setup (Node, Git, Kiro, and a GitHub account) is walked through live in the
workshop, so you can go straight to building.

1. **Fork** this repo to your GitHub account.
2. **Clone it in Kiro.** Choose Clone Repository, sign in with GitHub, and pick
   your fork. Kiro opens the project with the terminal ready.
3. **Ask Kiro to run it.** In the chat, say
   *"install dependencies and start the dev server."* Kiro runs `npm install`
   and `npm run dev` for you. This is your first prompt.
4. **Open the preview** at http://localhost:3000. If 3000 is busy, Vite picks
   the next open port and prints the URL.

Prefer to type it yourself?

```bash
npm install
npm run dev
```

## What's inside

Everything you need is already here. You don't have to know what any of it is;
Kiro can explain it.

- **Prebuilt UI:** stock shadcn/ui primitives (button, card, dialog, input,
  avatar, badge, scroll-area, tooltip, separator, popover) in `src/components/ui`.
- **Chat kit:** shadcn's `message`, `message-scroller`, `bubble`, `attachment`,
  and `marker` for any chat or agent surface.
- **Mock data:** tasks, messages, documents, and a calendar in `src/data`. Pick
  the domain that fits your work.
- Add more shadcn components anytime with `npx shadcn@latest add <name>`.

```
src/
  components/ui/   shadcn/ui primitives + chat kit
  data/            mock data (tasks, messages, documents, calendar)
  lib/             cn() class-name helper
  index.css        Tailwind v4 + humorphism theme tokens
  App.tsx          the landing screen to replace with your build
  main.tsx         entry point
```

## Working with Kiro

Kiro already knows this workshop. The context in
`.kiro/steering/workshop.md` (plus a thin `AGENTS.md` for other tools) loads
automatically, so Kiro understands humorphism, what's in this project, and the
rules.

Open Kiro's chat (`Cmd L` on Mac, `Ctrl L` on Windows) and try:

- "What is humorphism? Show me a few patterns I could build."
- "What's already in this project that I can build with?"
- "Build the 'Just Need Your Input' pattern for [your work]."

Show it, don't describe it. Kiro's chat accepts images. Paste or drag in a
screenshot and say "build this." It works just as well for changes: screenshot
what Kiro builds on your localhost, point out what's off, and tell it what to fix.

## Rules

- No backend. Mock or simulate AI with `setTimeout`, hardcoded sequences, or the
  mock data.
- The UX is the deliverable. Focus on the interaction pattern, not on making a
  real model work.
- Prefer the shadcn/ui primitives where they fit, especially the chat kit,
  before building custom components.
- Push your build to your fork when you're done.

## Reference

- [humorphism.com](https://humorphism.com): the design philosophy.
- [humorphism.com/foundations](https://humorphism.com/foundations): every
  interaction pattern, with examples.
- [shadcn/ui](https://ui.shadcn.com/docs/components): every component, plus how
  to add more with `npx shadcn@latest add <name>`.
- [shadcn/ui chat kit](https://ui.shadcn.com/docs/components/message): the
  message, bubble, and scroller docs for chat and agent surfaces.

## Requirements

- **Node.js 20+** and npm (check with `node --version` and `npm --version`).
- **Git**.
- A coding agent is recommended but not required to run the app. This repo is
  set up for [Kiro](https://kiro.dev), with `AGENTS.md` and `CLAUDE.md` for
  other tools.

## Tech stack

Built with React 19, TypeScript, Vite, Tailwind CSS v4, and shadcn/ui (new-york
style). `package.json` is the source of truth for exact versions.

**Runtime dependencies**

| Package | Version | Purpose |
| --- | --- | --- |
| react | ^19.0.0 | UI runtime |
| react-dom | ^19.0.0 | React DOM renderer |
| radix-ui | ^1.6.2 | headless primitives behind shadcn/ui |
| @shadcn/react | ^0.2.0 | shadcn chat kit (message, bubble, scroller) |
| lucide-react | ^0.469.0 | icon set |
| class-variance-authority | ^0.7.1 | component variants |
| clsx | ^2.1.1 | conditional class names |
| tailwind-merge | ^2.6.0 | merge and dedupe Tailwind classes |
| framer-motion | ^11.15.0 | animation (available if you want motion) |

**Dev dependencies**

| Package | Version | Purpose |
| --- | --- | --- |
| vite | ^5.4.11 | dev server and build |
| @vitejs/plugin-react | ^4.3.4 | React plugin for Vite |
| typescript | ^5.7.2 | types and `tsc` typecheck |
| tailwindcss | ^4.0.0 | styling |
| @tailwindcss/vite | ^4.0.0 | Tailwind v4 Vite plugin |
| tw-animate-css | ^1.2.0 | animation utilities |
| @types/node | ^22.10.2 | Node type definitions |
| @types/react | ^19.0.2 | React type definitions |
| @types/react-dom | ^19.0.2 | React DOM type definitions |
