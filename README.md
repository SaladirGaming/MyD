# Personal AI Diary Webapp

## Description

This application is a modern, secure, and intelligent personal diary. Users can create, manage, and reflect on their daily entries. Each entry benefits from AI-powered sentiment analysis, providing insights into emotional trends. The application leverages a robust tech stack including React for the frontend and Supabase for backend services, including authentication, database storage, and serverless Edge Functions for AI integration.

## Features

*   **Secure User Authentication:** Utilizes Supabase Auth for robust and secure user sign-up and login.
*   **CRUD Operations for Diary Entries:** Full capabilities to Create, Read, Update, and Delete diary entries.
*   **AI-Powered Sentiment Analysis:** Each diary entry is analyzed for sentiment (Positive, Negative, Neutral) using the OpenAI API via a Supabase Edge Function.
*   **Modern, Responsive UI:** A clean, intuitive, and responsive user interface built with React and styled with modern CSS practices.

## Tech Stack

*   **Frontend:** React (v19), Vite
*   **Backend & PaaS:** Supabase
    *   Authentication: Supabase Auth
    *   Database: Supabase PostgreSQL
    *   Serverless Functions: Supabase Edge Functions (Deno runtime)
*   **AI:** OpenAI API (gpt-3.5-turbo)
*   **Styling:** Plain CSS with CSS Variables. Global styles in `src/index.css` and inline styles for component-specific adjustments.
*   **Testing:** Vitest, React Testing Library, jsdom

## Prerequisites

*   Node.js (>=18.x recommended)
*   npm (comes with Node.js) or yarn
*   A Supabase Account (free tier available)
*   An OpenAI API Key
*   Supabase CLI (for Edge Function deployment and local development/testing)

## Project Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd <project-directory>
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the project root and add your Supabase project URL and Anon key:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
    Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase credentials. These can be found in your Supabase project dashboard under Project Settings > API.

## Running Locally

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Open in your browser:**
    Navigate to `http://localhost:5173` (or the port specified by Vite in your terminal).

## Supabase Configuration

Before running the application effectively, you need to configure your Supabase backend.

1.  **Database Schema:**
    The schema for the `diary_entries` table, including Row Level Security (RLS) policies, is defined in the `supabase_diary_entries_schema.sql` file in the project root.
    *   Go to your Supabase project dashboard.
    *   Navigate to the "SQL Editor".
    *   Click "New query".
    *   Copy the content of `supabase_diary_entries_schema.sql` and paste it into the editor.
    *   Click "RUN".

2.  **Edge Function for AI Analysis (`analyze-entry`):**
    The sentiment analysis is performed by a Supabase Edge Function.
    *   **Deploy the function:**
        Ensure you have the Supabase CLI installed and are logged into your Supabase account (`supabase login`).
        Navigate to the project root in your terminal and run:
        ```bash
        supabase functions deploy analyze-entry --no-verify-jwt
        ```
        *(Note: `--no-verify-jwt` is used for simplicity here. For production, consider Supabase's JWT verification.)*

    *   **Set OpenAI API Key:**
        The Edge Function requires your OpenAI API key. Set this as a secret in your Supabase project:
        ```bash
        supabase secrets set OPENAI_API_KEY=your_openai_api_key
        ```
        Replace `your_openai_api_key` with your actual OpenAI API key.
        Alternatively, you can set this in the Supabase project dashboard: Go to Project Settings > Edge Functions, select the `analyze-entry` function, and add the `OPENAI_API_KEY` environment variable. You may need to redeploy the function after setting secrets.

## Building for Production

1.  **Create a production build:**
    ```bash
    npm run build
    ```
    This command bundles the application for production. The output files will be located in the `dist` folder.

2.  **Preview the production build (optional):**
    ```bash
    npm run preview
    ```
    This command serves the `dist` folder locally.

## Running Tests

The project uses Vitest for running unit and integration tests.

1.  **Run all tests in the console:**
    ```bash
    npm run test
    ```

2.  **Run tests with the Vitest UI (optional):**
    ```bash
    npm run test:ui
    ```
    This will open a browser window where you can interactively view test results.

---

This README provides a comprehensive guide to setting up, running, and understanding the Personal AI Diary Webapp.
Enjoy your journaling!
