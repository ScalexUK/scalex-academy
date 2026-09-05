(function () {
  "use strict";

  var launcher = document.getElementById("chat-launcher");
  var widget = document.getElementById("chat-widget");
  var closeBtn = document.getElementById("chat-close");
  var messagesEl = document.getElementById("chat-messages");
  var quickRepliesEl = document.getElementById("chat-quick-replies");
  var form = document.getElementById("chat-form");
  var input = document.getElementById("chat-input");

  if (!launcher || !widget) return;

  var WHATSAPP_NUMBER = "447356031478";
  var FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61592904440674";
  var ENROL_URL = "enrol.html";

  function waLink(text) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  }

  // Kept in sync by hand with the facts in index.html / enrol.html — there is
  // no shared data source since this is a static, no-build-step site.
  //
  // Ground rule for every reply below: only state things the client has
  // actually confirmed. Where something isn't confirmed (certificates,
  // refunds, missed classes, Amazon dates), the bot says so honestly and
  // hands off to a human rather than inventing an answer.
  var TOPICS = {
    tiktok: {
      keywords: ["tiktok", "tik tok", "tik-tok"],
      menuLabel: "TikTok Mastery",
      reply:
        "TikTok Mastery Training starts on the 1st & 15th of every month. It runs for 2 weeks, Monday to Friday, 1 hour a day, plus a live Saturday Q&A.\n\nMorning session: 10:00–11:00 UK time\nEvening session: 20:00–21:00 UK time\nCourse fee: £120 (UK) / €145 (Europe) / $165 (USA)\n\nOne thing to know: you'll need your own TikTok Seller account set up before the course starts — we can help you with that if you need it.",
      action: { label: "Enrol in TikTok Training", type: "link", url: ENROL_URL }
    },
    ebay: {
      keywords: ["ebay", "e-bay"],
      menuLabel: "eBay Training",
      reply:
        "eBay Training starts on the 1st & 15th of every month. It runs for 2 weeks, Monday to Friday, 1 hour a day, plus a live Saturday Q&A.\n\nMorning session: 11:00–12:00 UK time\nEvening session: 21:00–22:00 UK time\nCourse fee: £120 (UK) / €145 (Europe) / $165 (USA)\n\nIt's 10 live classes covering everything from e-commerce basics and product hunting to listing, eBay policies, order processing and scaling.",
      action: { label: "Enrol in eBay Training", type: "link", url: ENROL_URL }
    },
    amazon: {
      keywords: ["amazon"],
      menuLabel: "Amazon Training",
      reply:
        "Amazon Training is coming soon! We haven't confirmed dates, duration or pricing yet — but I can let the team know you're interested so they can update you.",
      action: { label: "Notify Me", type: "whatsapp", text: "Hi, please notify me when Amazon Training launches." }
    },
    consultation: {
      keywords: ["consult", "consultation", "£30", "account creation", "set up account", "setup account", "create account", "open account"],
      menuLabel: "£30 Consultation",
      reply:
        "Our Paid Account Creation Consultation is a one-off £30 session. We'll guide you directly through setting up your online selling account.\n\nIt's separate from the training courses — the £30 isn't deducted from a course fee if you go on to enrol.",
      action: { label: "Book £30 Consultation", type: "whatsapp", text: "Hi, I'd like to book the £30 Account Creation Consultation." }
    },
    enrol: {
      // Deliberately no bare "join" — it swallowed questions like "is there a
      // joining fee" (price) and "can I join from Pakistan" (location).
      keywords: ["enrol", "enroll", "sign up", "signup", "register", "apply", "how do i start", "get started", "how to join", "want to join", "like to join", "book a place", "reserve"],
      menuLabel: "How to Enrol",
      reply:
        "Enrolling takes about two minutes. Fill in the enrolment form — pick your course, batch start date and whether you want the morning or evening session — and it sends your details straight to us on WhatsApp.\n\nWe'll then confirm your place and send the bank transfer details privately.",
      action: { label: "Open Enrolment Form", type: "link", url: ENROL_URL }
    },
    schedule: {
      keywords: ["schedule", "time", "timing", "timings", "when", "hours", "saturday", "q&a", "qa", "start date", "dates", "how long", "duration", "weeks"],
      menuLabel: "Class Times",
      reply:
        "Both TikTok and eBay training run for 2 weeks, Monday to Friday, 1 hour a day, with a live Saturday Q&A. Sunday is off. New cohorts start on the 1st and 15th of every month.\n\nTikTok: 10:00–11:00 or 20:00–21:00 UK time\neBay: 11:00–12:00 or 21:00–22:00 UK time\n\nThe enrolment form shows the exact upcoming batch start dates you can pick from."
    },
    price: {
      keywords: ["price", "cost", "fee", "fees", "how much", "pricing", "payment", "pay", "bank transfer", "bank details", "installment", "instalment"],
      menuLabel: "Fees & Payment",
      reply:
        "TikTok Mastery Training and eBay Training are both £120 (UK) / €145 (Europe) / $165 (USA) for the full 2-week course — pay in whichever currency matches where you're based. The £30 Account Creation Consultation is a separate one-off fee and isn't deducted from that price.\n\nPayment is by bank transfer, arranged directly over WhatsApp — we'll share our account details privately once you're ready to enrol.",
      action: { label: "Ask About Payment", type: "whatsapp", text: "Hi, I'd like to know more about payment for a training course." }
    },
    curriculum: {
      keywords: ["curriculum", "syllabus", "what will i learn", "what do i learn", "what's covered", "whats covered", "cover", "topics", "modules", "content"],
      reply:
        "TikTok Mastery covers shop setup, product research, store optimisation, content strategy, TikTok ads, order fulfilment, scaling, and working as a virtual assistant offering these services to clients.\n\neBay Training is 10 live classes: Week 1 covers e-commerce fundamentals, why eBay, product hunting, sourcing and account creation. Week 2 covers professional listings, eBay policies, returns and refunds, order processing and scaling.",
      action: { label: "See Full Curriculum", type: "link", url: "index.html#tiktok" }
    },
    requirements: {
      keywords: ["do i need", "requirement", "prerequisite", "equipment", "laptop", "computer", "experience", "beginner", "qualification", "eligible"],
      reply:
        "For the eBay course you don't need anything beyond a device with an internet connection — it starts from e-commerce fundamentals on Day 1.\n\nFor TikTok Mastery you'll need your own TikTok Seller account set up before training starts. If you'd like help getting that sorted, just ask us.",
      action: { label: "Ask About Requirements", type: "whatsapp", text: "Hi, I have a question about what I need before joining a training course." }
    },
    format: {
      keywords: ["recorded", "recording", "replay", "is it live", "live class", "live or", "pre-recorded", "prerecorded", "zoom", "online or"],
      reply:
        "All classes are live and taught by real instructors in real time — they're not pre-recorded videos. You join online, one hour a day, Monday to Friday, plus the live Saturday Q&A.\n\nIf you want to ask about recordings or catching up on a missed class, our team can help.",
      action: { label: "Ask the Team", type: "whatsapp", text: "Hi, I have a question about how the live classes work." }
    },
    location: {
      keywords: ["where are you", "address", "location", "based", "office", "country", "abroad", "outside uk", "outside the uk", "international", "join from", "overseas", "timezone", "time zone"],
      reply:
        "We're a UK-based academy — our address is Suite RA01, 195-197 Wood Street, London, E17 3NU.\n\nAll training is delivered online, so you can join from anywhere. Classes run on UK time, with a morning and an evening option so you can pick whichever fits your timezone better.",
      action: { label: "Ask About Joining", type: "whatsapp", text: "Hi, I'd like to ask about joining your training from my country." }
    },
    certificate: {
      keywords: ["certificate", "certification", "diploma", "accredited", "accreditation"],
      reply:
        "I don't have confirmed details on certificates, so I don't want to guess. Our team can give you a proper answer on that.",
      action: { label: "Ask the Team", type: "whatsapp", text: "Hi, do you provide a certificate on completing the training?" }
    },
    refund: {
      keywords: ["refund", "cancel", "money back", "reschedule", "miss a class", "missed class", "can't attend", "cant attend"],
      reply:
        "That's something our team handles case by case, and I don't have a confirmed policy to quote you — so I'd rather put you in touch with them directly than guess.",
      action: { label: "Chat on WhatsApp", type: "whatsapp", text: "Hi, I'd like to ask about your policy on refunds / missed classes." }
    },
    human: {
      keywords: ["human", "agent", "person", "talk to someone", "call", "speak to", "contact", "email"],
      reply: "Of course — you can chat with our team directly on WhatsApp, or email scalexlimiteduk@gmail.com.",
      action: { label: "Chat on WhatsApp", type: "whatsapp", text: "Hi, I'd like to speak with someone at ScaleX Academy UK." }
    },
    facebook: {
      keywords: ["facebook", "social", "instagram"],
      reply: "You can follow us on Facebook for updates and announcements.",
      action: { label: "Follow on Facebook", type: "facebook" }
    }
  };

  // Checked in this order, so the more specific topic wins when a message
  // could match several (e.g. "how much is the consultation" hits
  // `consultation`, not `price`).
  // `location` sits before `enrol` and `schedule` so "can I join from
  // Pakistan" and "what timezone" answer the actual question instead of
  // matching the looser "join"/"time" keywords further down.
  var TOPIC_ORDER = [
    "tiktok", "ebay", "amazon", "consultation",
    "certificate", "refund", "curriculum", "requirements", "format",
    "location", "enrol", "schedule", "price", "human", "facebook"
  ];

  var started = false;

  function addMessage(text, sender) {
    var el = document.createElement("div");
    el.className = "msg " + sender;
    el.textContent = text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function whatsappIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C11.6 9.3 11.1 8 10.9 7.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.2L2 22l4.9-1.5c1.4.8 3 1.2 4.6 1.2h.5c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2h-.5c-1.5 0-2.9-.4-4.2-1.1l-.3-.2-3.1 1 1-3-.2-.3C4 15.3 3.5 13.7 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.7-8.5 8.7z"/></svg>'
    );
  }

  function botSay(text, delay) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        addMessage(text, "bot");
        resolve();
      }, delay || 350);
    });
  }

  /**
   * Renders one row of quick-reply buttons. Each item is one of:
   *  - { type: "menu", label, topicKey }   → sends label as a user message, looks up that topic
   *  - { type: "menu-reset", label }        → returns to the main topic menu
   *  - { type: "whatsapp", label, text }    → opens a prefilled WhatsApp chat in a new tab
   *  - { type: "facebook", label }          → opens the Facebook page in a new tab
   *  - { type: "link", label, url }         → navigates this tab to a page on the site
   */
  function setQuickReplies(items) {
    quickRepliesEl.innerHTML = "";
    (items || []).forEach(function (item) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quick-reply" +
        (item.type === "whatsapp" ? " is-link" : "") +
        (item.type === "facebook" ? " is-facebook" : "") +
        (item.type === "link" ? " is-primary" : "");

      if (item.type === "whatsapp") {
        btn.innerHTML = whatsappIconSvg() + "<span>" + item.label + "</span>";
      } else {
        btn.textContent = item.label;
      }

      btn.addEventListener("click", function () {
        handleQuickReplyClick(item);
      });

      quickRepliesEl.appendChild(btn);
    });
  }

  function handleQuickReplyClick(item) {
    if (item.type === "menu") {
      handleUserText(item.label, item.topicKey);
      return;
    }

    if (item.type === "menu-reset") {
      addMessage(item.label, "user");
      botSay("What else would you like to know?").then(function () {
        showMainMenu(200);
      });
      return;
    }

    addMessage(item.label, "user");
    if (item.type === "link") {
      // Same-site page, so navigate directly rather than opening a tab
      // (and rather than window.open, which pop-up blockers can swallow).
      window.location.href = item.url;
      return;
    }
    if (item.type === "whatsapp") {
      window.open(waLink(item.text), "_blank", "noopener");
      botSay("Opening WhatsApp for you — if it didn't open, message us directly at +44 7356 031478.");
    } else if (item.type === "facebook") {
      window.open(FACEBOOK_URL, "_blank", "noopener");
      botSay("Opening our Facebook page in a new tab.");
    }
    showMainMenu(600);
  }

  function mainMenuItems() {
    return TOPIC_ORDER.filter(function (key) {
      return TOPICS[key].menuLabel;
    }).map(function (key) {
      return { type: "menu", label: TOPICS[key].menuLabel, topicKey: key };
    });
  }

  function showMainMenu(delay) {
    setTimeout(function () {
      setQuickReplies(mainMenuItems());
    }, delay || 0);
  }

  function findTopic(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < TOPIC_ORDER.length; i++) {
      var key = TOPIC_ORDER[i];
      var topic = TOPICS[key];
      for (var j = 0; j < topic.keywords.length; j++) {
        if (lower.indexOf(topic.keywords[j]) !== -1) return key;
      }
    }
    return null;
  }

  function handleUserText(displayText, forcedKey) {
    addMessage(displayText, "user");
    setQuickReplies([]);

    var key = forcedKey || findTopic(displayText);
    var topic = key ? TOPICS[key] : null;

    if (!topic) {
      botSay(
        "I'm not sure about that one — I'd rather not guess. I can help with course details, class times, fees and payment, what you'll learn, how to enrol, or the £30 consultation. Or I can put you through to our team on WhatsApp."
      ).then(function () {
        showMainMenu(300);
      });
      return;
    }

    botSay(topic.reply).then(function () {
      var replies = [];
      if (topic.action) replies.push(topic.action);
      replies.push({ type: "menu-reset", label: "Back to Menu" });
      setTimeout(function () {
        setQuickReplies(replies);
      }, 300);
    });
  }

  function startConversation() {
    if (started) return;
    started = true;
    botSay("Hi! 👋 I'm the ScaleX Academy UK assistant.", 200)
      .then(function () {
        return botSay(
          "Ask me anything about our training — class times, fees, what you'll learn, what you need to get started, or how to enrol. What would you like to know?",
          600
        );
      })
      .then(function () {
        showMainMenu(200);
      });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    input.value = "";
    if (!text) return;
    handleUserText(text, null);
  });

  launcher.addEventListener("click", function () {
    widget.classList.remove("hidden");
    launcher.classList.add("hidden");
    startConversation();
    input.focus();
  });

  closeBtn.addEventListener("click", function () {
    widget.classList.add("hidden");
    launcher.classList.remove("hidden");
  });
})();
