# SEVA SUTRA
### Pensions and Social Benefits, Made Navigable

**SEVA SUTRA** is an accessibility-first digital service prototype designed to make pension and social benefit journeys easier to understand, navigate, and manage. It focuses on helping beneficiaries track application progress, understand verification requirements, manage documents, and investigate delayed payments—with safeguards for people who receive assistance from caregivers.

Built for **IMPACTX 2026 — Challenge 20**.

## Key Features

- **Benefit & Application Tracking** — View application progress and distinguish confirmed statuses from estimates or personal notes.
- **Verification & Renewal Reminders** — Track upcoming verification deadlines and documents approaching expiry.
- **Pension Payment Assistance** — Review possible reasons for delayed payments and understand recommended next steps.
- **Accessible User Experience** — Designed with readable typography, high contrast, clear navigation, and simplified task flows.
- **Caregiver Access Controls** — Demonstrate purpose-limited access, access expiry, activity history, and revocation.
- **Bank-Change Safeguards** — Simulate additional confirmation and a cooling-off period for sensitive account changes.
- **Scheme Discovery** — Explore benefit eligibility using clear outcomes, including cases that require further confirmation.
- **Assisted-Service Support** — Demonstrate pathways for users who need additional help completing a task.

## Tech Stack

- **Frontend:** React and Vite
- **Language:** TypeScript / JavaScript, depending on the project configuration
- **AI Integration:** Google Gemini API, if enabled in the application
- **Deployment:** Vercel or another compatible hosting platform

## Getting Started

### Prerequisites

- Node.js and npm
- A Gemini API key, if the application uses Gemini features

### Installation

1. Clone or download this repository.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add your Gemini API key if required:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

### Build for Production

Run the production build:

```bash
npm run build
```

To test the production build locally:

```bash
npm run preview
```

## Privacy, Safety & Responsible Design

SEVA SUTRA is a prototype intended to demonstrate user journeys and responsible service design.

- Demonstration data should not be treated as real beneficiary records.
- Simulated statuses and payment explanations are not official government determinations.
- Eligibility guidance does not guarantee approval or payment.
- Caregiver access and bank-change workflows demonstrate safeguards; they do not imply that real financial or government records have been changed.
- Never commit API keys, passwords, or other secrets to source control.

## Project Goals

SEVA SUTRA aims to make social benefit services more understandable, accessible, and safer for older adults and people who rely on trusted assistance.

**Design principle:** Make the next step clear, preserve beneficiary control, and communicate uncertainty honestly.

---

*Developed as a prototype for IMPACTX 2026 — Challenge 20: Pensions and Social Benefits, Made Navigable.*
