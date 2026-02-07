# NarrativeOS™ — Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     NarrativeOS™ Platform                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Web Interface                          │   │
│  │  • Premium dark-mode UI                                   │   │
│  │  • Responsive design                                      │   │
│  │  • Module-based navigation                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │                                                            │  │
│  │  ┌─────────────────┐  ┌─────────────────────────────────┐ │  │
│  │  │ NarrativeOS Core│  │       StoryGTM Modules          │ │  │
│  │  ├─────────────────┤  ├─────────────────────────────────┤ │  │
│  │  │ • Product       │  │ • Launch Planning               │ │  │
│  │  │   Understanding │  │ • Battle Cards                  │ │  │
│  │  │ • Positioning   │  │ • Win/Loss Analysis             │ │  │
│  │  │ • Story         │  │ • Market Segments               │ │  │
│  │  │   Architecture  │  │ • Roadmap Stories               │ │  │
│  │  │ • Creative      │  │                                 │ │  │
│  │  │   Hooks         │  │                                 │ │  │
│  │  └─────────────────┘  └─────────────────────────────────┘ │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │                    Security Layer                          │  │
│  │  • Input sanitization    • Rate limiting                  │  │
│  │  • XSS prevention        • Audit logging                  │  │
│  │  • Prompt injection      • Secure storage                 │  │
│  │    detection                                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
narrativeos/
├── index.html              # Main application entry
├── README.md               # Project documentation
├── SECURITY.md             # Security policies
├── .gitignore              # Git ignore rules
│
├── css/
│   └── styles.css          # Design system & styles
│
├── js/
│   ├── app.js              # Main application logic
│   └── security.js         # Security utilities
│
├── prompts/                # AI Prompt Hierarchy
│   ├── narrativeos.system.md     # Identity & mission
│   ├── narrativeos.trustlayer.md # Guardrails & security
│   ├── storygtm.execution.md     # Tools & capabilities
│   └── narrativeos.memory.md     # Memory policies
│
├── docs/
│   └── architecture.md     # This file
│
└── .github/
    └── workflows/
        ├── ci.yml          # CI/CD pipeline
        └── security-scan.yml # Security automation
```

## Module Descriptions

### NarrativeOS Core

| Module | Purpose |
|--------|---------|
| Product Understanding | Convert product details into value maps and JTBD analysis |
| Positioning Engine | Generate positioning statements and differentiation |
| Story Architecture | Build product story frameworks |
| Creative Hooks | Generate magnetic narrative hooks |

### StoryGTM Modules

| Module | Purpose |
|--------|---------|
| Launch Planning | GTM strategy and launch sequencing |
| Battle Cards | Competitive intelligence and sales enablement |
| Win/Loss Analysis | Deal pattern analysis and insights |
| Market Segments | ICP definition and persona creation |
| Roadmap Stories | Technical → customer narrative translation |

## Security Architecture

### Client-Side Security
- **Input Sanitization**: All user inputs sanitized before processing
- **Output Encoding**: XSS prevention via HTML entity encoding
- **Rate Limiting**: Request throttling to prevent abuse
- **Audit Logging**: All operations logged for compliance

### Prompt Security
- **Injection Detection**: Pattern matching for common injection attempts
- **Boundary Enforcement**: Clear separation of user/system content
- **No Leakage**: System prompts never exposed

### Data Security
- **No PII Storage**: Sensitive data not persisted client-side
- **Secure Storage**: Prefixed localStorage with privacy controls
- **CSP Ready**: Content Security Policy headers configured

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with design tokens
- **Security**: Custom security module
- **CI/CD**: GitHub Actions
- **Future**: Can be upgraded to React/Next.js when needed
