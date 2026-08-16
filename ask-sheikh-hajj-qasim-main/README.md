# Ask Sheikh Hajj Qasim

Create a full-stack, production-ready web application called "Ask Sheikh Hajj Qasim" using HTML, CSS (Tailwind CSS), and JavaScript/TypeScript for both frontend and backend (Node.js/Express API routes or Vercel Serverless Functions). The app must be fully optimized for seamless deployment on Vercel and version control via GitHub.

### 1. Overview & Core Features

- App Name: Ask Sheikh Hajj Qasim

- Purpose: A comprehensive Islamic Q&A, Quran reading, and audio platform.

- Primary Features:

  1. Islamic Q&A Hub: Interactive Q&A feature covering Fasting (Sawm), Prayers (Salah), Hadith, Quranic exegesis (Tafsir), and general Islamic guidance. Answers must be generated with vivid, detailed, and authentic explanations.

  2. Quran Reader & Audio Player: Full Quran interface allowing users to read verses in Arabic, view translations, and stream recitations.

  3. Authentication System: User Signup, Login, and Profile Management (using Supabase Auth or LocalStorage mock authentication for rapid deployment).

  4. Environment Variable Configuration: Pre-configured to consume the Ummah API using the provided key (`UMMAH_API_KEY=umh_3a95822e063859d9ed2f177bb5832b9f4c3c3b0e`).

### 2. User Interface & Design System

- Theme: Elegant Islamic aesthetic. Clean white/light-gray background with deep emerald green primary accents (`#0F5132`), gold highlight borders (`#D4AF37`), and crisp dark typography.

- Layout: Modern responsive design with a top navigation bar (Logo, Quran, Q&A, Audio, Login/Signup), hero section, main workspace, and footer.

- Mobile First: Fully responsive navigation drawer and touch-friendly media controls.

### 3. Functional Modules

#### Module A: Q&A Engine ("Ask Sheikh")

- Input Form: Textarea for users to submit questions with a category dropdown: [Fasting, Prayer, Hadith, Quran, General Islamic Guidance].

- Output Interface: Display answers with:

  - Concise Summary

  - Vivid, detailed step-by-step breakdown

  - Cited Quranic verses and authentic Hadith references where applicable

  - Copy answer button and share feature

#### Module B: Quran Reading & Audio Section

- Surah List: Filterable grid/list of all 114 Surahs with Arabic and English names.

- Reader View: Verses in clear Arabic script with English translation toggle.

- Audio Player: Built-in fixed bottom audio bar with Play, Pause, Reciter Selection, Track Progress Bar, and Volume Control.

#### Module C: User Authentication & Access Control

- Modals or dedicated pages for User Registration and Login.

- User Dashboard displaying saved questions, bookmarked Surahs/verses, and history.

### 4. Technical Architecture & Vercel/GitHub Deployment

- File Structure:

  ├── index.html

  ├── styles/

  ├── scripts/

  ├── api/ (Serverless routes for handling Ummah API requests securely)

  ├── vercel.json

  └── README.md

- API Integration: Store `UMMAH_API_KEY=umh_3a95822e063859d9ed2f177bb5832b9f4c3c3b0e` in `.env` and fetch data via backend/serverless endpoints to prevent exposing credentials on the client side.

- Vercel Configuration: Include a valid `vercel.json` file for routing API requests and serving static assets without CORS issues.

Generate a complete, fully functional, and visually stunning web app with all necessary file structures and code.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bb4b0b89-7637-4a34-976e-59392b1fd691).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
