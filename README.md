# WhatsApp Personal Selfbot (Cleaned & Validated)

A robust WhatsApp personal automation client with **321 canonical commands** and **478 total aliases**, completely overhauled to fix broken operations, remove duplicate command clones, and add real utility tools.

---

## 🚀 Features

- **Safe Math Evaluation:** Full arithmetic parsing (`.calc (12+4)*5/2`, powers, square roots, trigs) without unsafe `eval`.
- **Real-Time Utilities:** Live weather report (`.weather`), Wikipedia summaries (`.wiki`), GitHub user inspector (`.github`), and real crypto tracker (`.crypto`).
- **Comprehensive Group Tools:** Admin lock, unlock, promote, demote, tagall/announcements (`.tagall`), and group rules management (`.grouprules`).
- **Chat & Media Automation:** Sticker generator (`.sticker`), media downloader (`.downloadmedia`), recent chats viewer (`.listchats`), snipe deleted messages (`.snipe`).
- **70+ Text Transformers:** Bold, italic, codeblocks, morse code, vaporwave, bubble text, reverse, and mocking text that work 100%.
- **Zero Duplicate Bloat:** All duplicate copies removed and organized into clean canonical commands with intuitive aliases.

---

## 🛠️ Setup Instructions

### 1. Requirements
- Node.js 18 or newer.

### 2. Configure Environment
Copy `.env.example` to `.env`:
```env
PREFIX=.
PHONE_NUMBER=923001234567
PAIRING_CODE=true
OWNER_ONLY=true
TIMEZONE=Asia/Karachi
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Verify & Test Commands
Run the automated test suite to ensure all commands pass:
```bash
npm run count
node scripts/smoke-test.js
```

### 5. Launch
```bash
npm start
```
Follow the terminal output: on your phone, open WhatsApp -> **Linked Devices** -> **Link a Device** -> **Link with phone number instead**, and enter the pairing code displayed in the console.

---

> [!CAUTION]
> **Safety Notice:** Always test unofficial WhatsApp clients on a secondary/burner SIM card. WhatsApp's automated systems actively detect unauthorized client connections and can temporarily or permanently ban accounts.
