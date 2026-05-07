# 🎨 Motivation Doodle — VSCode Extension

> **A VSCode extension that pops up a fun doodle and a motivational quote while you code — because every developer deserves a smile mid-debugging.**

<br/>

![Version](https://img.shields.io/badge/version-0.0.1-7c6af7?style=flat-square)
![VSCode](https://img.shields.io/badge/VSCode-%5E1.85.0-0078d7?style=flat-square&logo=visualstudiocode)
![License](https://img.shields.io/badge/license-MIT-f7c06a?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20macOS-888?style=flat-square)

---

## 📸 Preview

> The extension opens a side panel with a random doodle (GIF/PNG) and a motivational quote every 30 minutes — or whenever you manually trigger it.

```
┌─────────────────────────────────┐
│         Keep Going! 🎨          │
│                                 │
│       [ doodle image here ]     │
│                                 │
│  "Code is poetry written for    │
│        machines."               │
│                                 │
│  Take a breath. You've got this │
└─────────────────────────────────┘
```

---

## 📚 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Installation](#-installation)
  - [Install from VSIX (Local)](#install-from-vsix-local)
  - [Install from Marketplace](#install-from-marketplace)
- [Commands](#-commands)
- [Configuration](#-configuration)
- [Code Walkthrough](#-code-walkthrough)
  - [extension.js](#extensionjs)
  - [package.json](#packagejson)
- [Adding Your Own Doodles and Quotes](#-adding-your-own-doodles-and-quotes)
- [Building and Packaging](#-building-and-packaging)
- [Publishing to Marketplace](#-publishing-to-marketplace)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🖼️ **Random Doodles** — Picks a random image (PNG or GIF) from your doodles folder every time
- 💬 **Random Quotes** — Displays a random motivational developer quote with each popup
- ⏱️ **Auto Popup Timer** — Automatically shows the panel every 30 minutes while you code
- 🔁 **Panel Reuse** — Reuses the same panel instead of opening a new tab every time
- 🛑 **Stop Command** — Lets you pause motivations without disabling the extension
- 🧹 **Clean Cleanup** — Properly disposes timers and panels on shutdown, no memory leaks
- 🖥️ **Cross-platform** — Works on Linux, Windows, and macOS

---

## 📁 Project Structure

```
motivation-doodle/
│
├── doodles/                    # your doodle images go here
│   ├── cat.png
│   ├── stay-strong.gif
│   ├── hii-excited.gif
│   └── you-got-this.gif
│
├── .vscode/
│   ├── launch.json             # F5 debug config — auto-generated
│   └── extensions.json         # recommended extensions
│
├── extension.js                # ← ALL your logic lives here
├── package.json                # ← extension manifest, commands, metadata
├── .vscodeignore               # files excluded from the packaged .vsix
├── .gitignore
├── README.md
└── CHANGELOG.md
```

---

## 🔍 How It Works

```
VSCode Starts
     │
     ▼
activationEvent: "onStartupFinished"
     │
     ▼
activate(context) is called
     │
     ├──► setInterval fires every 30 min
     │         │
     │         ▼
     │    showMotivation(context)
     │         │
     │         ├── Panel already open? → reveal + refresh content
     │         └── No panel? → create panel, set HTML, attach cleanup
     │
     ├──► 'motivate' command registered  (manual trigger)
     │
     └──► 'stop' command registered
               │
               ▼
          clearInterval + dispose panel + reset state
```

The Webview panel is essentially a sandboxed browser tab inside VSCode. It renders plain HTML/CSS. Images are served through VSCode's `vscode-resource://` URI scheme (not `file://`) for security — this is handled automatically by `panel.webview.asWebviewUri()`.

---

## 🚀 Installation

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18 or v20 LTS | [nodejs.org](https://nodejs.org) |
| VSCode | v1.85.0+ | [code.visualstudio.com](https://code.visualstudio.com) |
| Git | Any | [git-scm.com](https://git-scm.com) |

Verify your setup:
```bash
node --version    # v18.x or v20.x
npm --version     # 9.x or 10.x
git --version     # any version
```

---

### Install from VSIX (Local)

This is the quickest way to install and share the extension without publishing to the Marketplace.

**Step 1 — Clone the repo**
```bash
git clone https://github.com/karmveer/motivation-doodle.git
cd motivation-doodle
```

**Step 2 — Install dependencies**
```bash
npm install
```

**Step 3 — Package it**
```bash
npm install -g @vscode/vsce
vsce package
# produces: motivation-doodle-0.0.1.vsix
```

**Step 4 — Install in VSCode**

Option A — via terminal:
```bash
code --install-extension motivation-doodle-0.0.1.vsix
```

Option B — via VSCode UI:
1. Open the Extensions sidebar (`Ctrl+Shift+X`)
2. Click the `···` three-dot menu (top right of sidebar)
3. Click **Install from VSIX...**
4. Select the `.vsix` file

**Step 5 — Reload VSCode**

Press `Ctrl+Shift+P` → type `Reload Window` → hit Enter.

---

### Install from Marketplace

> Coming soon — will be published at `marketplace.visualstudio.com`

Once published, search **"Motivation Doodle"** in the VSCode Extensions tab and click Install.

---

## ⌨️ Commands

Open the Command Palette with `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS) and type:

| Command | What it does |
|---------|-------------|
| `Show Motivation` | Manually triggers the doodle popup |
| `Stop Motivation` | Stops the auto timer and closes the panel |

---

## ⚙️ Configuration

Currently the timer interval and quotes are hardcoded in `extension.js`. To change them:

**Change the popup interval:**
```javascript
// extension.js — line 10
const INTERVAL = 30 * 60 * 1000;   // 30 minutes (default)
const INTERVAL = 5 * 60 * 1000;    // 5 minutes
const INTERVAL = 5 * 1000;          // 5 seconds (for testing)
```

**Add more quotes:**
```javascript
const quotes = [
  "Your new quote here.",
  "Another one here.",
  // ... add as many as you want
];
```

> **Future plan:** expose interval and quotes as VSCode settings so users can configure them from `settings.json` without touching the code.

---

## 🧠 Code Walkthrough

### extension.js

This is the heart of the extension. Here is every section explained:

#### 1. Imports

```javascript
const vscode = require('vscode');   // VSCode extension API
const path   = require('path');     // Node.js built-in for safe file paths
```

`vscode` gives you access to everything — commands, panels, file system, events.
`path` ensures file paths work correctly on both Linux (`/`) and Windows (`\`).

#### 2. State variables

```javascript
let currentPanel = null;   // tracks the open Webview panel
let timer        = null;   // tracks the setInterval timer ID
```

These live at module scope so they persist across function calls. `null` means "nothing active yet."

#### 3. Building the Webview URI

```javascript
const doodlePath = vscode.Uri.file(
  path.join(context.extensionPath, 'doodles', randomDoodle)
);
const doodleUri = panel.webview.asWebviewUri(doodlePath);
```

Webviews run in a security sandbox — they cannot load images via `file://` URLs directly.
`asWebviewUri()` converts the disk path to a `vscode-resource://` URI that the sandbox allows.
Without this, all images show as broken regardless of whether the file exists.

#### 4. Panel reuse logic

```javascript
function showMotivation(context) {
  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.Two);
    currentPanel.webview.html = getWebviewContent(context, currentPanel);
    return;   // ← exits early, skips panel creation
  }
  // ... create new panel
}
```

Without this check, every timer tick would open a new tab. After an hour you'd have 120 open tabs.
The `return` after the `if` block is an **early return** — a common pattern to avoid deeply nested `else` blocks.

#### 5. onDidDispose

```javascript
currentPanel.onDidDispose(() => { currentPanel = null });
```

Fires when the user closes the tab. Resets `currentPanel` to `null` so the `if` check works correctly next time. If you skip this, `currentPanel` keeps pointing to a dead panel and the extension thinks a panel is open when it isn't.

#### 6. Stop command

```javascript
vscode.commands.registerCommand('motivation-doodle.stop', () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
    if (currentPanel) {
      currentPanel.dispose();
      currentPanel = null;
    }
    vscode.window.showInformationMessage("Motivation Stopped.");
  }
});
```

`clearInterval(timer)` — cancels the repeating timer.
`currentPanel.dispose()` — programmatically closes the tab (triggers `onDidDispose` automatically).
`showInformationMessage` — shows a small toast notification at the bottom right.

#### 7. Cleanup via subscriptions

```javascript
context.subscriptions.push({ dispose: () => { if (timer) clearInterval(timer) } });
```

VSCode calls `.dispose()` on everything in `context.subscriptions` when the extension shuts down.
Since `setInterval` has no built-in `.dispose()`, you wrap it in an object that does.
The `if (timer)` guard prevents errors if the user already stopped the timer manually.

---

### package.json

The manifest file. VSCode reads this before loading any JavaScript.

```json
{
  "name": "motivation-doodle",
  "displayName": "Motivation Doodle",
  "publisher": "karmveer",
  "version": "0.0.1",
  "engines": { "vscode": "^1.85.0" },
  "activationEvents": ["onStartupFinished"],
  "main": "./extension.js",
  "contributes": {
    "commands": [
      {
        "command": "motivation-doodle.motivate",
        "title": "Show Motivation"
      },
      {
        "command": "motivation-doodle.stop",
        "title": "Stop Motivation"
      }
    ]
  }
}
```

| Field | Purpose |
|-------|---------|
| `name` | Internal ID — lowercase, no spaces |
| `displayName` | Human-readable name shown in Marketplace |
| `publisher` | Your publisher ID from marketplace.visualstudio.com |
| `activationEvents` | When VSCode calls your `activate()` function |
| `main` | Entry point — which file has your `activate()` export |
| `contributes.commands` | Declares commands to the Command Palette |

The `command` string in `contributes.commands` must **exactly match** the first argument of `vscode.commands.registerCommand()` in `extension.js`. One typo means the command silently does nothing.

---

## 🖼️ Adding Your Own Doodles and Quotes

### Adding doodles

1. Drop any `.png`, `.jpg`, or `.gif` file into the `doodles/` folder
2. Add the filename to the array in `extension.js`:

```javascript
const doodles = [
  "cat.png",
  "stay-strong.gif",
  "your-new-doodle.gif",   // ← add here
];
```

3. Save, press `F5` to reload, done.

### Adding quotes

```javascript
const quotes = [
  "Code is poetry written for machines.",
  "Your new quote here.",   // ← add here
];
```

No restart needed if you're in development mode — just save and relaunch with F5.

---

## 📦 Building and Packaging

### Development mode (for testing)

Press **F5** inside VSCode. This opens an **Extension Development Host** — a second VSCode window with your extension loaded live. Any changes you save are reflected after pressing the Restart button in the debug toolbar.

```
F5 → Extension Development Host opens
Ctrl+Shift+P → "Show Motivation" → panel appears
```

### Packaging as .vsix

```bash
# Install packaging tool (one time)
npm install -g @vscode/vsce

# Package
vsce package

# Output: motivation-doodle-0.0.1.vsix
```

Make sure `package.json` has these fields before packaging:

```json
{
  "publisher": "karmveer",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/karmveer/motivation-doodle"
  }
}
```

---

## 🌐 Publishing to Marketplace

**Step 1 — Create a Microsoft account**

Go to [marketplace.visualstudio.com](https://marketplace.visualstudio.com) and sign in.

**Step 2 — Create a Publisher**

Go to [marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage) → **Create Publisher** → choose a publisher name. This must match the `"publisher"` field in `package.json` exactly.

**Step 3 — Create a Personal Access Token**

1. Go to [dev.azure.com](https://dev.azure.com)
2. Top right → your profile → **Personal Access Tokens**
3. Click **New Token**
4. Set:
   - Organization: **All accessible organizations**
   - Scopes: **Marketplace → Manage**
   - Expiration: 90 days
5. Copy the token immediately — you won't see it again

**Step 4 — Login with vsce**

```bash
vsce login karmveer
# paste your token when prompted
```

**Step 5 — Publish**

```bash
vsce publish
```

Your extension will appear on the Marketplace within 5–10 minutes. Users can then search for it by name in the VSCode Extensions tab and install it with one click.

**To update after publishing:**
```bash
vsce publish patch   # bumps 0.0.1 → 0.0.2
vsce publish minor   # bumps 0.0.1 → 0.1.0
vsce publish major   # bumps 0.0.1 → 1.0.0
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime for the extension |
| VSCode Extension API | Commands, Webview, events |
| HTML / CSS | Webview UI — the popup panel |
| SVG / GIF / PNG | Doodle images |
| `path` (Node built-in) | Cross-platform file path handling |
| `@vscode/vsce` | Packaging and publishing tool |

---

## 🤝 Contributing

Pull requests are welcome! Here's how to set up for development:

```bash
# Clone
git clone https://github.com/karmveer/motivation-doodle.git
cd motivation-doodle

# Install dependencies
npm install

# Open in VSCode
code .

# Press F5 to launch Extension Development Host
```

**Ideas for contributions:**
- [ ] Add VSCode settings to configure interval and quotes from `settings.json`
- [ ] Add more built-in doodle themes
- [ ] Add a "Next" button inside the Webview to cycle quotes without closing
- [ ] Add sound (optional, opt-in)
- [ ] Dark/light theme awareness

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

## 👤 Author

**Karmveer**
- GitHub: [@karmveer](https://github.com/karmveer)
- Made with ☕ and way too many motivational quotes

---

> *Built as part of a live coding session teaching VSCode extension development.*
> *Part of a 3-project series: Motivation Doodle → Comment Highlighter → File Auto-Header*
