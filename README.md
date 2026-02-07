# NarrativeOS™ — powered by StoryGTM

> The operating system for product storytelling and go-to-market clarity.

## Overview

NarrativeOS™ is an enterprise-grade Product Marketing SaaS platform that transforms complex products into compelling narratives. Powered by StoryGTM execution engine.

## Core Modules

### NarrativeOS Core
- **Product Understanding Engine** - Value maps, JTBD analysis, feature-benefit translation
- **Positioning & Differentiation Engine** - Positioning statements, competitive matrices
- **Story Architecture Engine** - Product story frameworks and messaging hierarchies
- **Creative Hooks Generator** - 3-5 narrative hooks per product with emotional/logical anchors

### StoryGTM Modules
- **StoryGTM Launch** - GTM planning, launch sequencing, funnel messaging
- **StoryGTM Sales** - Battle cards, win/loss analysis, objection handling
- **StoryGTM Market** - ICP segmentation, persona narratives
- **StoryGTM Roadmap** - Technical roadmap → customer story translation

## Quick Start

```bash
# Open the application
open index.html

# Or use a local server
python3 -m http.server 8080
```

## Security

This platform is built with security-first principles:
- Input sanitization on all user inputs
- No sensitive data stored in client-side code
- Content Security Policy ready
- OWASP guidelines followed

See [SECURITY.md](./SECURITY.md) for full security documentation.

## Project Structure

```
narrativeos/
├── index.html          # Main application
├── css/
│   └── styles.css      # Design system
├── js/
│   ├── app.js          # Core application logic
│   ├── modules/        # Feature modules
│   └── security/       # Security utilities
├── prompts/            # AI prompt configurations
├── docs/               # Documentation
└── .github/            # GitHub workflows
```

## GitHub Workflow

```bash
# Regular development commits
git add .
git commit -m "feat: [description]"
git push origin main

# For releases
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## License

Proprietary - All Rights Reserved

---

**NarrativeOS™** | Turn complex products into stories that win markets.
