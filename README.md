# Wikipedia Interface Language Change — Automation Test

Playwright + TypeScript end-to-end test that verifies an authenticated Wikipedia user can change their interface language to Ukrainian via the Preferences page.

---

## Test Case

| Field | Details |
|---|---|
| **Test Case ID** | TC-WIKI-001 |
| **Title** | Change interface language to Ukrainian for an authorised user |
| **Description** | Verify that a logged-in Wikipedia user can navigate to Preferences → User profile → Internationalisation, select Ukrainian ("uk") as the interface language, save the setting, and have the UI rendered in Ukrainian afterwards. |
| **Preconditions** | 1. A valid Wikipedia account exists. 2. `WIKI_USERNAME` and `WIKI_PASSWORD` are set in the `.env` file. 3. The account's current language preference is **not** Ukrainian (so the change is observable). |

### Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://en.wikipedia.org/wiki/Special:UserLogin` | Login page loads |
| 2 | Enter valid username and password, click **Log in** | User is authenticated; personal tools menu is visible |
| 3 | Navigate to `https://en.wikipedia.org/wiki/Special:Preferences` | Preferences page loads |
| 4 | Confirm the **User profile** tab is active (default tab) | User profile settings are displayed |
| 5 | Scroll to the **Internationalisation** section | Language dropdown (`#wpUserLanguage`) is visible |
| 6 | Select **Ukrainian — uk** from the language dropdown | Dropdown value changes to `uk` |
| 7 | Click **Save** | Page reloads; a success banner is shown |
| 8 | Inspect the page title and UI text | Page title reads "Налаштування" (Ukrainian for "Preferences") |
| 9 | Re-open `Special:Preferences` and inspect the language dropdown | Dropdown still shows `uk` — the setting persisted |

### Expected Results

- A green success confirmation is displayed immediately after saving.
- The Preferences page title changes to "Налаштування".
- The language dropdown retains the value `uk` after a full page reload.

---

## Setup

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- (Optional) Docker & Docker Compose for containerised runs

### Install dependencies

```bash
npm install
npx playwright install chromium
```

### Configure credentials

Copy the example env file and fill in your Wikipedia credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
WIKI_USERNAME=your_wikipedia_username
WIKI_PASSWORD=your_wikipedia_password
```

> **Never commit `.env`** — it is listed in `.gitignore`.

---

## Running Tests

### Run locally

```bash
npm test
```

This runs `playwright test` using the Chromium browser in headless mode.

### Run in Docker

```bash
docker-compose up --build
```

Docker Compose builds the image, installs all dependencies and browsers inside the container, runs the test suite, and exits. The HTML report is written to `./playwright-report` on your host machine via the volume mount defined in `docker-compose.yml`.

---

## Test Report

After a local run the HTML report is generated at:

```
playwright-report/index.html
```

Open it in any browser:

```bash
open playwright-report/index.html        # macOS
xdg-open playwright-report/index.html   # Linux
start playwright-report/index.html      # Windows
```

After a Docker run the same `playwright-report/` folder is copied to your local machine automatically via the volume mount in `docker-compose.yml`:

```yaml
volumes:
  - ./playwright-report:/app/playwright-report
```

So the report is available at the same path — `playwright-report/index.html` — without any extra steps.
