# "Why InTrust Exists" — Scroll Story Script

> Source: [src/components/issues.tsx](../src/components/issues.tsx)
> This is the section that plays **after the product-demo scroll** in the hero.
> Format: a sticky, scroll-driven carousel. Each beat = one visual + a short caption.

---

## CURRENT SCRIPT (what's live now)

### Intro (full-screen, fades out as you scroll in)
- **Eyebrow:** Why InTrust exists
- **Headline:** Buying insurance should leave you **informed**—not exhausted.
- **Subtext:** Scroll to see why the usual buying journey creates more activity than understanding.

### Beat 1 — Enquiry
- **Visual:** A single "compare insurance" quote card ("Find plans for your family")
- **Eyebrow:** One enquiry
- **Title:** One enquiry can become **10 calls**.
- **Body:** You asked for a quote. What arrives next is often more conversation, not more understanding.

### Beat 2 — Noise
- **Visual:** Quote card surrounded by incoming-call / message alert cards + "7 new follow-ups" pill
- **Eyebrow:** The follow-up
- **Title:** One form. Several very enthusiastic advisors.
- **Body:** Calls, messages and follow-ups multiply around the same question you started with.

### Beat 3 — Answers
- **Visual:** Three advisor cards giving conflicting answers around a central "?"
- **Eyebrow:** The explanation
- **Title:** Ten conversations. Three different answers.
- **Body:** The benefits are easy to repeat. The conditions still send you back to the policy wording.

### Beat 4 — Payment
- **Visual:** "Payment successful ₹18,430" card over a faded policy document
- **Eyebrow:** The decision
- **Title:** Eventually, you pay.
- **Body:** The buying journey feels finished—even when the understanding isn't.

### Beat 5 — Policy
- **Visual:** Full policy-wording document with a "Room rent restriction" clause + "Still unclear" callout
- **Eyebrow:** The part that remains
- **Title:** You bought the policy. **But did you understand it?**
- **Body:** Room-rent limits, waiting periods and restoration rules are still waiting inside the document.
- **Footer chip:** Buying insurance should leave you informed—not exhausted.

---

## NOTES / PROBLEMS (why we're rewriting)
- Too text-heavy: every beat carries an eyebrow + title + body. That's 3 lines × 5 beats + intro.
- The intro headline and the beat-5 footer chip repeat the same line ("informed—not exhausted").
- Story is there but buried under copy — reads like paragraphs, not a story arc.

---

## DIRECTION (locked from feedback)

1. **The real problem** (not spam, not too many calls): advisors sell the *benefits* and
   never explain the *conditions*. The customer buys on the pitch, and only discovers the
   clauses **at the hospital, at claim time** — when it's too late.
2. **No payment beat.** The story jumps from "you bought it" straight to the hospital.
3. A **new section follows**: a vertical scroll down the policy document itself, with
   callouts pinned to real clauses — **Covey** (the agent; "InTrust" is internal only,
   never in product copy) reads every clause and explains it *before* you buy.

---

## MECHANICS (locked)

- **Section 1 = horizontal scroll.** Scroll drives the beats sideways, one card at a time.
  The last beat lands on the **policy document**.
- **Section 2 = continuous vertical scroll** (Vercel-style). The document from Section 1's
  last beat *stays on screen* and the scroll direction flips downward — no section break,
  one continuous motion. You are now scrolling *through the document itself*.
- In Section 2, a **Covey cursor** moves through the pages as you scroll — pointing,
  highlighting, and drawing borders around clause after clause. The point is visual:
  *it reads every page* and tells you what's wrong. Copy stays minimal; the cursor
  activity IS the message.

---

## SECTION 1 — horizontal scroll (4 beats)

Dead simple. Say it like you'd say it to a friend.

### Intro
- **Eyebrow:** Why Covey exists
- **Headline:** Here's how insurance is sold today.

### Beat 1
- **Visual:** advisor pitch card — only benefits: "₹5L cover ✓ · Cashless ✓ · Full family ✓"
- **Line:** The advisor tells you what's covered.

### Beat 2
- **Visual:** same pitch card, policy document appears behind it — clauses (room rent,
  waiting period, co-pay) visible in the document, absent from the pitch.
- **Line:** Not what isn't.

### Beat 3
- **Visual:** hospital claim card — "Claim ₹2,80,000 · **Approved ₹1,90,000** · Room rent
  limit exceeded — Clause 4.2"
- **Line:** You find out at the hospital.

### Beat 4 — lands on the document
- **Visual:** the policy document, front and center, open at page 1. This exact document
  carries into Section 2.
- **Line:** It was all in the policy. Nobody read it to you.

> No beat 5, no closing chip. Beat 4's line does the job and hands off.

---

## SECTION 2 — continuous vertical document scroll

Same document, scroll flips vertical. Covey's cursor gets to work.

### Intro (one line as the vertical scroll begins)
- **Eyebrow:** Meet Covey
- **Headline:** Covey reads it. All of it.

### Covey cursor moments (in scroll order down the document)

Each moment = cursor moves to a clause → highlights/borders it → a short label pops.
Labels are blunt — what it means for you, not what the clause says.

| # | Page | Clause it lands on | Cursor label |
|---|---|---|---|
| 1 | p. 4 | Room rent — 1% of sum insured/day | Your room is capped at ₹5,000/day. Go over it, and every bill shrinks. |
| 2 | p. 9 | Waiting period — 36 months pre-existing | Existing illnesses: not covered for 3 years. |
| 3 | p. 14 | Disease sub-limits table | Cataract, knees, cardiac — each capped separately. |
| 4 | p. 21 | Co-payment 10% | You pay 10% of every claim. Always. |
| 5 | p. 33 | Restoration benefit | This one's good — your cover refills if you use it up. |

Between moments, the cursor visibly *skims* the pages in between (fast scroll-through,
brief highlights flickering) — selling "every page," not just five stops.

### Outro (scroll ends, document recedes)
- **Headline:** Know what you're buying. Before you buy it.
- **CTA:** Ask Covey about any policy →

---

## COPY RULES going forward
- One line per beat. If it needs a second line, the visual isn't doing its job.
- "Covey" in all user-facing copy. "InTrust" never appears.
- Bold exactly one phrase per line — the thing the eye should catch.

<!-- add Draft B, C as we iterate -->
