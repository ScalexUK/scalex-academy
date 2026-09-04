# ScaleX Academy UK — Website

A single-page marketing site (vanilla HTML/CSS/JS, no frameworks, no build step) for ScaleX Academy UK's live online training in TikTok, eBay and Amazon selling, with a rule-based chatbot ("ScaleX Assistant") for FAQs. Served by a small zero-dependency Node server (`server.js` — built-in `http`/`fs` only).

Step 1 (design system, navigation, homepage) and Step 2 (chatbot, detailed TikTok/eBay curriculum content, real branding, payment information) are both complete — see `CLAUDE.md` for the full picture.

## Project structure

```
server.js                 Node server: serves public/ and handles POST /api/leads (currently unused — see CLAUDE.md)
public/
  index.html               The entire site: hero, training overview, TikTok/eBay posters,
                            Amazon coming-soon, £30 consultation + payment info, about, contact, footer, chatbot
  assets/
    logo.png                 Real logo, alpha-masked to a transparent circle
  css/
    style.css               Design system (navy/blue palette, type, header/nav/footer, buttons, cards)
    home.css                 Section styles
    chat-widget.css          Chatbot widget styling
  js/
    main.js                  Mobile nav, scroll-based active-nav-link highlighting, reveal-on-scroll, footer year
    chat-widget.js            Chatbot logic (rule-based topic matching, see CLAUDE.md)
```

## Running it

Requires Node.js (no npm packages needed — zero dependencies).

```bash
node server.js
```

Then open [http://localhost:3000](http://localhost:3000).

Set a custom port with the `PORT` environment variable if 3000 is taken:

```bash
PORT=4000 node server.js
```

## The chatbot

Click the blue bubble bottom-right. It's a scripted FAQ assistant, not an LLM — it answers questions about TikTok/eBay/Amazon training, schedules, course fees/payment, and the £30 consultation by matching keywords, then hands off to WhatsApp (or Facebook) for anything needing a real person. It does not collect leads into `leads.json` — WhatsApp is the single lead channel by design. See `CLAUDE.md` for how topics are defined and how to add more.

## Key links (verify before going live)

- WhatsApp: `https://wa.me/447356031478` (used throughout, including chatbot actions, with context-specific prefilled messages)
- Facebook: `https://www.facebook.com/profile.php?id=61592904440674`
- Email: `scalexlimiteduk@gmail.com`
- Enrolment form (separate Claude Artifact, not in this repo): `https://claude.ai/code/artifact/c5b46992-a922-4f4b-b652-7e773d02c559` — see `CLAUDE.md` for what it is and how to update it

## Notes / things to revisit

- Navigation is anchor-based (`#tiktok`, `#ebay`, `#amazon`, `#consultation`, `#about`, `#contact`) since the whole site is one page — this was a deliberate choice, not a placeholder.
- No fabricated testimonials, statistics, or invented Amazon pricing/dates — Amazon section is an honest "Coming Soon" with a "Notify Me" WhatsApp CTA.
- No real bank account/sort-code details are published on the site by design — bank transfer is offered as a payment method, but the actual details are shared privately over WhatsApp once someone is ready to enrol.
- The chatbot's schedule and pricing facts are hand-duplicated from the page content (no shared data source) — if training times or fees ever change, update both `index.html` and the `TOPICS` object in `js/chat-widget.js`.
- `window.open` calls for WhatsApp/Facebook were verified to construct correct URLs, but weren't visually confirmed to open a real browser tab (the dev sandbox blocks all popups) — worth one manual click-test before going live.

See `CLAUDE.md` for full project context, the design-system rationale, and bugs found/fixed during this build.
