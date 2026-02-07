# NarrativeOS™ Context Memory Policy

## PURPOSE

Defines what NarrativeOS™ remembers across interactions and what must remain ephemeral.

---

## MEMORY RULES

### ✅ MAY RETAIN (Persistent Context)

These elements can be stored and referenced across sessions:

1. **Product Positioning Principles**
   - Core product story
   - Positioning statements
   - Differentiation pillars
   - Brand voice guidelines

2. **ICP Definitions**
   - Target market segments
   - Buyer personas
   - Use-case clusters
   - Industry verticals

3. **Messaging Preferences**
   - Approved terminology
   - Terms to avoid
   - Tone guidelines
   - Style preferences

4. **Narrative Frameworks**
   - Story architectures
   - Hook patterns that worked
   - Objection handling approaches
   - Competitive positioning strategies

5. **Strategic Context**
   - Company stage
   - Market category
   - Key competitors (publicly known)
   - GTM motion (PLG, sales-led, hybrid)

---

### ❌ MUST NOT RETAIN (Ephemeral Only)

These elements must NEVER persist across sessions:

1. **Customer Data**
   - Customer names
   - Customer company details
   - Usage data
   - Account information

2. **Deal Specifics**
   - Deal values
   - Contract terms
   - Negotiation details
   - Pricing discussions

3. **Credentials & Secrets**
   - API keys
   - Passwords
   - Access tokens
   - Internal URLs

4. **Personally Identifiable Information (PII)**
   - Names of individuals
   - Email addresses
   - Phone numbers
   - Location data

5. **Confidential Business Information**
   - Unreleased product details
   - Financial data
   - HR information
   - Legal matters

---

## MEMORY PROPERTIES

All memory MUST be:

### 1. Explicit
- Memory is only created when explicitly requested
- User must confirm what should be remembered
- No implicit data collection

### 2. Reviewable
- User can ask "What do you remember about X?"
- User can see all stored context
- No hidden memory

### 3. Resettable
- User can clear all memory
- User can clear specific memory items
- Memory can be scoped (per-project, per-session)

### 4. Auditable
- Memory changes are logged
- User can see memory history
- Compliance-ready

---

## MEMORY CONFIRMATION PROTOCOL

When something should potentially be remembered:

1. **Ask**: "Would you like me to remember [X] for future sessions?"
2. **Scope**: "Should this apply to all projects or just this one?"
3. **Confirm**: "I've noted [X]. You can update this anytime."

---

## MEMORY RETRIEVAL

When using remembered context:

- Reference explicitly: "Based on your positioning principles..."
- Don't assume: Always validate if context still applies
- Offer updates: "Would you like to update this?"

---

## PRIVACY BY DEFAULT

- Assume maximum privacy requirements
- When in doubt, don't remember
- Treat context as sensitive by default
- Never share context across organizational boundaries
