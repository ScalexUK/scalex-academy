# ScaleX Academy UK — Website

Standing context/build doc for this project. Keep it updated as decisions are made.

## Status: Step 1 complete; Step 2 (chatbot, detailed training content, payment info, real branding) complete

**Step 1** (design system, navigation, single-page homepage) is complete. **Step 2** was a multi-part follow-up (chatbot, automated schedule Q&A, payment information, more detailed training content) — the client asked to build one part at a time. All parts are now live: **chatbot**, **detailed training content** (see "Detailed training content" below), **real branding** (see "Design system" below — the site was recolored from the original Airbnb-inspired coral concept to navy/blue to match the client's real logo), and **payment information** (course fees + accepted payment methods — see "Payment information" below). No open items remain from the original Step 2 scope; see "Open items" for anything new that comes up.

## What this is

A single-page marketing site for **ScaleX Academy UK**, a UK-based live online training provider for e-commerce/online selling skills (TikTok, eBay, Amazon). Vanilla HTML/CSS/JS, no frameworks, no build step, served by a small zero-dependency Node server.

The entire site lives on `public/index.html` — navigation items are same-page anchors (`#tiktok`, `#ebay`, etc.), not separate pages. This was a deliberate structural choice (see "History" below) driven by the client's Step 1 spec, which described one continuous page top to bottom.

## Business facts (confirmed with user)

- **Training programmes:**
  - **TikTok Mastery Training** — starts 1st & 15th of every month, 2 weeks, Mon–Fri, 1 hour/day, Saturday Q&A. Morning 10:00–11:00 UK, Evening 20:00–21:00 UK.
  - **eBay Training** — same cadence (starts 1st & 15th, 2 weeks, Mon–Fri, 1 hour/day, Saturday Q&A). Morning 11:00–12:00 UK, Evening 21:00–22:00 UK.
  - **Amazon Training** — Coming Soon. No date/price/schedule invented; CTA is "Notify Me" (opens WhatsApp with a prefilled message).
- **Course fees:** TikTok Mastery Training and eBay Training are both **£120** for the full 2-week course — confirmed directly by the client. Shown as a "Course fee" line on each training-overview card and as a third timing chip on each poster section, and covered by the chatbot's `price` topic. Amazon Training pricing is still unconfirmed (Coming Soon — no price shown).
- **Paid consultation:** "Paid Account Creation Consultation", **£30** flat, one-off. **Confirmed separate from course price** — it is not credited or deducted if the visitor goes on to enrol in a course (client-confirmed; see "Payment information" below). CTA opens WhatsApp with a prefilled booking message; the chatbot can now also route this (see below).
- **WhatsApp:** +44 7356 031478 → `https://wa.me/447356031478`. Used site-wide (nav, hero, every training CTA, consultation, contact, footer, and now the chatbot's action buttons), each with a context-specific prefilled `?text=` message so ScaleX can tell which section/intent a lead came from just from the message. Verified all hrefs resolve to the correct number and encode correctly (see "Testing notes").
- **Facebook:** `https://www.facebook.com/profile.php?id=61592904440674`, displayed as "@ScaleX Academy UK".
- **Email:** `scalexlimiteduk@gmail.com` — confirmed directly by the client; corrected from `scalexacademyuk@gmail.com`, which a marketing flyer had shown but was wrong. Used in the Contact section, footer, and the chatbot's "human" reply.
- **Location:** "Suite RA01, 195-197 Wood Street, London, E17 3NU, United Kingdom" — client-confirmed as the correct registered address, replacing the earlier flyer-sourced "Oldham, Manchester, UK" (which was wrong). Shown in the footer and echoed in the enrolment form's header (see "Enrolment form" below).
- **No fabricated content:** no fake testimonials/reviews/student numbers/statistics, no invented Amazon pricing or dates, no guaranteed-income/employment/success claims (About section explicitly disclaims this).

## Detailed training content (from client-supplied marketing flyers)

The client shared two promotional poster images (TikTok Mastery Training poster, eBay Training poster) as source material, with the explicit instruction to add the detail but **strip out every specific date** shown on them (e.g. "Starting from 1st September 2026", "eBay starts on 1st Sept.") — the site states a recurring "1st & 15th of every month" cadence, not one-off fixed dates, and that's the only cadence claim that should ever appear.

What was pulled in from the flyers, in `index.html`:

- **TikTok** (`#tiktok` poster, `.curriculum-block`): an 8-item "What You'll Learn" list (shop setup, product research, store optimisation, content strategy, ads, fulfilment, scaling, and working as a VA and offering these services to clients), a prerequisite callout (must have a TikTok Seller account before joining — offer to help via WhatsApp), and a note that TikTok Shop operates in the USA/UK/Italy/Germany/Spain "and many more countries."
- **eBay** (`#ebay` section, the `.card` block after the poster): a full 2-week, day-by-day curriculum — Week 1 "Foundation & Setup" (Days 1–5: e-commerce fundamentals, why eBay, product hunting, product sourcing, account creation) and Week 2 "Operations & Growth" (Days 6–10: professional listing, eBay policies, returns/refunds, order processing, scaling), plus a "10 live classes / 5 classes per week / practical hands-on training" stat row.
- The flyers also mention "Work as a Virtual Assistant & Offer Services to Clients," which connects to a separate VA-services flyer from the original Step-1 research (`image 2.png` at the project root, TikTok/eBay store management as a done-for-you service). **Client decision: leave this out** — it's a different offering from the training courses and is not being built into the site. Don't add a VA-services section without new instruction.
- **No personal name is used anywhere on the site, by design.** Two different marketing flyers gave two different founder names/nicknames across sessions ("Kashif Chaudhary" and "Kashif Baba"). Client clarified: **neither is correct** — the business identity is "ScaleX Academy UK" only, no individual named. There was never a founder section on this (v2, Airbnb-style) build to remove, but treat this as settled: do not introduce a founder name or founder section in future work unless the client explicitly asks and supplies the name themselves.
- Not added: flag emoji for the country list (see bug #4 below) — spelled out in words instead.

## Payment information

Added as the final piece of Step 2, once the client supplied real figures — nothing here was invented:

- **Course fees:** £120 for TikTok Mastery Training, £120 for eBay Training (client-confirmed). Shown in three places per course: the training-overview card (`.training-meta`, a "Course fee" row), the poster section (`.poster-timing`, a third `.timing-chip`), and a dedicated summary in the new Payment Information block.
- **Payment Information block** (`index.html`, inside `<section id="consultation">`, right after the existing £30 consultation banner — no new nav item was added, this reuses the existing "Consultation" anchor): a `.payment-info` card showing both course fees side by side (`.payment-grid`/`.payment-fee`), a note that the £30 consultation is separate and not deducted from the course price, the two accepted payment methods, and a WhatsApp CTA ("Ask About Payment").
- **Accepted payment methods (client-confirmed):** bank transfer, and general WhatsApp-arranged payment. **Deliberately no real bank account number/sort code is published on the site** — the client chose to route those details privately through WhatsApp once someone is ready to enrol, rather than publishing real banking details on a public page. Don't add real account/sort-code details to the site without the client explicitly asking for that.
- **No live payment link/checkout** (Stripe Payment Link, PayPal, etc.) — client said not ready yet. If one is added later, wire it into the same `.payment-info` block and update the chatbot's `price` topic action.
- **Chatbot:** the `price` topic in `chat-widget.js` now states both course fees, the consultation-is-separate clarification, and the bank-transfer/WhatsApp payment method, with keywords expanded to catch `payment`, `pay`, `bank transfer`, `bank details` (in addition to `price`, `cost`, `fee`, `how much`, `pricing`). Its action button is now "Ask About Payment" instead of the previous generic "Ask About Pricing".

## Enrolment form (separate Claude Artifact, not part of this codebase)

Live at `https://claude.ai/code/artifact/c5b46992-a922-4f4b-b652-7e773d02c559`. This is a **self-contained Claude Artifact**, not a file in this repo — it's a single HTML document with its own inline JS that renders a full online enrolment form (course/batch picker, name/email/WhatsApp/country/city, session choice, a payment-declaration section, consent checkboxes) and uses the Artifact `db`-less `artifact.publish()` capability to save each completed submission as a new version of itself (falling back to a prefilled WhatsApp message if publishing fails). It was built in an earlier, separate session — this session found it already existing and wired it into the live site on request, after reviewing and fixing it:

- **Fixed:** the form's `ACADEMY_WHATSAPP` constant was still the literal placeholder `"__ACADEMY_WHATSAPP__"` (never filled in), which would have broken both the "couldn't submit — message us on WhatsApp instead" fallback and the post-submission WhatsApp confirmation button. Set to `447356031478` to match the rest of the site, then republished to the same artifact URL.
- **Confirmed with client, left as-is:** the form's address ("Suite RA01, 195-197 Wood Street, London, E17 3NU, United Kingdom") is correct — this session updated the main site's footer and this doc to match it (see "Business facts" above), since the site previously said the wrong "Oldham, Manchester, UK".
- **Confirmed with client, left as-is:** the form's three hardcoded batch start dates (16 Sep 2026, 1 Oct 2026, 16 Oct 2026, for both TikTok Seller Centre and eBay) are real confirmed batches — client-approved. This is a deliberate exception to the main site's "no specific dates, only 1st & 15th cadence" rule: the main `index.html` is marketing copy that shouldn't imply fixed one-off dates, but this form is an operational enrolment tool where real dates are exactly what's needed. Don't "fix" this by stripping the dates — it's intentional, and don't copy real dates from here back into `index.html` either, since that would violate the main site's own no-invented-dates rule for different reasons (marketing page vs. operational form).
- **Wired into `index.html`** in three places, replacing/supplementing WhatsApp CTAs per client instruction: the hero (`Enrol Now`, a new `btn-primary`, placed before the existing `Join Us on WhatsApp` button), the header (`Enrol Now`, `btn-primary btn-sm`, hidden below 460px to avoid crowding the WhatsApp icon + nav toggle), and both poster sections' `Join TikTok Training` / `Join eBay Training` buttons — those used to open a prefilled WhatsApp chat and now link directly to the enrolment form instead (restyled from `btn-whatsapp` to `btn-primary` and the WhatsApp icon removed, since per the design-system rule WhatsApp-green is reserved for actual WhatsApp destinations).
- **Not changed:** the chatbot's `tiktok`/`ebay` topic actions (also labeled "Join TikTok Training" / "Join eBay Training") still open WhatsApp rather than the enrolment form — only the two literal on-page poster buttons were in scope for this swap. The Payment Information section's "Ask About Payment" WhatsApp CTA was also left alone (client chose not to touch that one).
- **Maintenance note:** because this lives outside the repo as a separate Artifact, updating it requires the Artifact tool with `url` set to the same link (not a normal file edit) — a future session touching course fees, dates, or copy on the form needs to fetch/read that URL first, edit, and republish to the same URL to avoid creating a second, disconnected artifact.

## Design system — navy/blue, matching the real logo

Originally built to an Airbnb-inspired coral concept (see "History" below), then **recolored to match the client's real logo** once they supplied it (a navy circular badge with a blue-gradient "X", saved as `Scalex logo.jpeg` at the project root). Implemented in `public/css/style.css`:

- **Palette:** blue brand gradient (`--brand-600: #1e6fe0` → `--brand-500`/`--brand-400`, `--brand-100` tint) plus navy surface tokens (`--navy-950`/`--navy-900`/`--navy-800`/`--navy-700`) used for the header, footer, and hero background (`--gradient-navy`), on white/light-gray section backgrounds with charcoal text. The token names are brand-neutral (`--brand-*`, not `--coral-*`) specifically so a future palette change doesn't require renaming every reference — only the `:root` values need to move.
- **Cards:** generous rounding (`--radius-lg: 24px`), soft diffuse shadows, hover-lift.
- **Type:** Poppins (headings) + Inter (body) via Google Fonts.
- **WhatsApp green** (`#25D366`) is used specifically for WhatsApp CTAs (recognizable, not part of the core brand palette) — everything else, including the chatbot header, uses the blue brand gradient.
- **Logo:** the client's real logo file, not a coded approximation. `Scalex logo.jpeg` (project root) is a JPEG with a near-white background outside its circular badge; since JPEGs can't carry transparency and the badge's own text is too close in color to the background to chroma-key safely, a **spatial circular alpha mask** (distance-from-center, not color-based) was generated via a one-off PowerShell/.NET (`System.Drawing`) script and saved as `public/assets/logo.png`. That transparent PNG is what's actually referenced everywhere the logo appears (header, hero, footer, chatbot header) — there is no more inline-SVG logo mark in the codebase.

**Known CSS gotcha (hit twice — read before touching `.site-header`):** never put `backdrop-filter` (or `filter`/`transform`) on `.site-header` or any ancestor of `.main-nav`. It makes that ancestor the containing block for the mobile nav's `position: fixed` panel and silently collapses it to zero height, breaking the mobile menu with no visual error. `.site-header` uses a solid `rgba()` background for this reason — see the comment directly above it in `style.css`.

## File structure

```
server.js                 Zero-dependency Node http server: serves public/, handles POST /api/leads
leads.json                 Created automatically; not currently used (chatbot routes to WhatsApp, not this)
Scalex logo.jpeg           Client-supplied real logo (source asset — not served directly, see assets/logo.png)
public/
  index.html               The entire site — hero, training overview, TikTok poster, eBay poster,
                            Amazon coming-soon, consultation + payment information, about, contact, footer, chatbot widget
  assets/
    logo.png                 Real logo, alpha-masked to a transparent circle — used site-wide (header, hero, footer, chatbot)
  css/
    style.css               Design system tokens (navy/blue brand palette), reset, header/nav/footer, buttons, cards
    home.css                 Section styles: hero, training cards, posters, consultation, payment info, about, contact
    chat-widget.css          Chatbot widget styling (blue brand header, WhatsApp-green action buttons)
  js/
    main.js                  Mobile nav toggle, scroll-position-based active-nav-link highlighting,
                            reveal-on-scroll (IntersectionObserver), footer year
    chat-widget.js            Chatbot logic — see below
```

## The chatbot ("ScaleX Assistant")

A rule-based FAQ/router bot, not an LLM — no API key, no server-side call, fully client-side in `public/js/chat-widget.js`. This was a deliberate choice: "automated answers about training dates and schedules" reads as a scripted assistant, and the whole site's philosophy is WhatsApp-first for anything needing a real human (payment, enrollment, actual booking) — the bot's job is to answer FAQs fast and then hand off to WhatsApp, not to replace WhatsApp as the lead channel. It does **not** write to `leads.json` — that would fragment leads across two systems when the client already checks WhatsApp.

**How it works:**
- On open, greets and shows a quick-reply menu: TikTok Mastery, eBay Training, Amazon Training, £30 Consultation.
- Each topic has a `TOPICS` entry (keywords, a canned reply, and an optional `action` — a WhatsApp deep link with a prefilled, intent-specific message, e.g. "Hi, I'd like to join the TikTok Mastery Training.").
- Free-text input is matched by substring against each topic's `keywords` array, checked in a fixed priority order (`TOPIC_ORDER`) so a more specific topic (e.g. "consultation") wins over a more generic one (e.g. "price") when a message could match both.
- Extra topics beyond the main menu: `schedule` (general timing questions), `price` (cost questions not specifically about the consultation), `human` (wants a person), `facebook` (social).
- Unmatched input gets an honest fallback ("I'm not sure about that one...") plus the main menu again — no guessing/inventing an answer.
- Action buttons: WhatsApp ones are styled WhatsApp-green and call `window.open(waLink, '_blank', 'noopener')`; the Facebook one opens the Facebook profile URL directly. After any action, the bot shows a "did it open?" fallback line (buttons/popups can be blocked) and resets to the main menu.

**Known duplication to maintain:** `TOPICS` in `chat-widget.js` hand-duplicates the schedule facts that also live in `index.html`'s training cards/posters. There's no shared data source (static site, no build step) — if the schedule ever changes, update both places. If this becomes a maintenance problem, consider generating both from one JSON file at that point rather than now.

## History — why this replaced an earlier build

An earlier session built a different homepage (navy/blue palette, multi-page structure with separate `about.html`/`courses.html`/`contact.html`/`success-stories.html`, a floating concierge chat widget that captured name/email/cohort-date leads to `server.js`/`leads.json`). The client then issued a full Step-1 respec: new brand direction (Airbnb-inspired coral palette), new nav structure (anchor-based single page, different item names), real training schedules, WhatsApp/Facebook integration, and an explicit "no chatbot yet" instruction. That superseded the earlier build — the old standalone pages were deleted; the old widget files were kept on disk (disconnected) through Step 1, then rewritten from scratch for Step 2's chatbot (new colors, new conversation logic — the old lead-capture flow didn't fit the WhatsApp-first design the client had since settled on).

## Testing notes

Built and verified without Node available in the sandbox (a disposable PowerShell static file server stood in for `node server.js` during development — the real server should still be smoke-tested with real Node before going live).

Bugs found and fixed during QA, across both steps:

1. **Mobile nav collapsed to zero height** (Step 1) — `backdrop-filter` on `.site-header` was making it the containing block for the fixed-position mobile nav. Fixed by using a solid background instead (see design-system note above).
2. **Scrollspy (active nav link) was unreliable** (Step 1) — a percentage-based `IntersectionObserver` rootMargin (`-40% 0px -55% 0px`) intermittently failed to fire on instant/programmatic scrolls, leaving stale nav highlights. Replaced with a plain scroll-position calculation (`main.js`, `updateActiveLink()`) — synchronous, deterministic, easy to verify.
3. The eBay poster's visual panel had an inline `style="order:2"` meant to mirror the TikTok poster's layout, but inline styles beat the mobile media query's own `order` rule, breaking the intended mobile stacking. Removed the inline override; swapped DOM order instead (Step 1).
4. **Contact section had real horizontal page overflow** (Step 2, detailed-content pass) — adding a third contact card (Email) made `.contact-grid` 3-wide; at ~700–900px viewports the unbreakable email string `scalexlimiteduk@gmail.com` forced its `1fr` grid track wider than its share, blowing out the row (and the whole page) by ~20px. Fixed with `min-width: 0` on `.contact-card` (lets grid tracks shrink below content's intrinsic width — the standard CSS Grid fix for this) plus `overflow-wrap: anywhere` on `.handle` so long unbroken strings can wrap.
5. **Day badges ("Day 1"–"Day 10") were invisible** (Step 2, detailed-content pass) — a CSS specificity collision: `.day-row span { color: var(--charcoal-700) }` (meant only for each day's description text) also matched `.day-badge` (also a `<span>`, direct child of `.day-row`) and outranked `.day-badge`'s own `color: #fff` because it had higher specificity (`.day-row span` = 1 class + 1 element beats `.day-badge` alone = 1 class). Fixed by scoping the description-text rule to `.day-row > div span`/`.day-row > div strong`, which structurally excludes the badge (it's not nested in the inner `div`) — the correct fix is narrowing the selector's *scope*, not just winning the specificity fight.
6. Flag emoji (🇺🇸🇬🇧🇮🇹🇩🇪🇪🇸) for the "TikTok Shop available in..." line rendered as raw two-letter country codes ("US GB IT DE ES") instead of composed flags in this dev environment — a known cross-platform risk (older Windows and some Linux/Chromium builds lack the emoji-flag font data), and the fallback reads as broken text, not a graceful degrade. Removed the flags; the sentence already names every country in words, so nothing was lost.

For Step 2 (chatbot), all topic keyword-matching paths were exercised (TikTok, eBay, Amazon, consultation, price-vs-consultation priority, human, Facebook, and the unmatched fallback), plus mobile layout. WhatsApp/Facebook `window.open` calls are confirmed to construct the correct URLs, but this sandbox's browser automation blocks all popups (even genuine user-gesture ones) — actual "does WhatsApp/Facebook open" behavior should get one real manual click-test in a normal browser before shipping, though the pattern used (synchronous `window.open` inside a click handler) is the standard one browsers allow.

For the detailed-content pass, both new curriculum blocks were checked at mobile/tablet/desktop widths (no horizontal overflow after fix #4) and the day-badge fix (#5) was verified via computed-style checks, not just visual screenshots — this environment's screenshot tool scales unpredictably at non-default viewport sizes, so `getComputedStyle`/`getBoundingClientRect` checks were treated as ground truth over pixel-peeking throughout this build.

For the real-logo swap and payment-information pass: verified live via the local test server that `assets/logo.png` renders with a clean transparent circular edge (no white box) in the header, hero, footer, and chatbot header; that the £120 fee lines/chips render correctly on both training cards and both posters and wrap cleanly alongside the existing timing chips; that the new Payment Information block renders correctly (course fees, consultation-is-separate note, both payment methods, WhatsApp CTA); and that the chatbot's `price` topic — tested with free-text input ("how do I pay for the course?") — correctly returns the real £120 fees, the consultation clarification, and the bank-transfer/WhatsApp payment method with an "Ask About Payment" action button.

## Open items

Nothing outstanding from the original Step 2 scope — chatbot, detailed training content, real branding, and payment information are all live. Possible future asks the client hasn't made yet, don't build without instruction:

- A real payment link/checkout (Stripe Payment Link, PayPal, etc.) — client explicitly said not ready yet.
- Publishing real bank account/sort-code details on the site — client chose to keep these WhatsApp-only for now.
- Amazon Training pricing/dates — still Coming Soon, nothing confirmed.
- Real photos anywhere on the site — still none; only the real logo (`public/assets/logo.png`) and icon/illustration SVGs.

**Settled, not open:** VA-services (client said leave it out) and founder naming (client said use only "ScaleX Academy UK," no individual name) — see "Detailed training content" above. Don't revisit either without new instruction.

## Running it

```bash
node server.js
```
Then open `http://localhost:3000`.
