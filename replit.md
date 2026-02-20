# SubNets - Mobile Social App for TV Show Fan Theories

## Overview
A React + Vite + Tailwind CSS v4 frontend application for sharing and discussing TV show fan theories. The backend runs on Supabase Edge Functions (Deno/Hono) with Supabase Auth and KV storage.

## Project Architecture
- **Frontend**: React 18, Vite 6, Tailwind CSS v4, TypeScript
- **UI Libraries**: Radix UI, MUI, Lucide icons, Sonner toasts, Motion animations
- **Routing**: React Router v7
- **Backend**: Supabase Edge Functions (external, not hosted here)
- **Auth**: Supabase Auth via edge function API
- **Data Storage**: Supabase KV store

## Project Structure
```
src/
  main.tsx              - Entry point
  styles/               - Global CSS, Tailwind, fonts, theme
  app/
    App.tsx             - Root component with router + toaster
    routes.tsx          - Route definitions
    Layout.tsx          - App layout wrapper
    screens/            - Page components (Home, Auth, Thread, etc.)
    components/         - Reusable components (PostCard, BadgeCard, etc.)
    components/ui/      - Base UI components (shadcn-style)
    contexts/           - AuthContext for auth state
    data/               - Mock data
    utils/              - API helpers
  utils/supabase/       - Supabase project config (projectId, anonKey)
supabase/functions/server/ - Supabase edge function code (reference only)
```

## Configuration
- **Dev server**: Vite on port 5000, host 0.0.0.0, all hosts allowed
- **Deployment**: Static build (`npm run build` -> `dist/`)
- **Path alias**: `@` -> `./src`

## Recent Changes
- 2026-02-20: Initial Replit setup - configured Vite for port 5000, moved utils into src/, added toast re-export from sonner
