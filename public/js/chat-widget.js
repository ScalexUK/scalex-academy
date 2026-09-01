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

  function waLink(text) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  }

  // Kept in sync by hand with the schedule facts in index.html — there is
  // no shared data source since this is a static, no-build-step site.
  var TOPICS = {
    tiktok: {
      keywords: ["tiktok", "tik tok", "tik-tok"],
      menuLabel: "TikTok Mastery",
      reply:
        "TikTok Mastery Training starts on the 1st & 15th of every month. It runs for 2 weeks, Monday to Friday, 1 hour a day, plus a live Saturday Q&A.\n\nMorning session: 10:00–11:00 UK time\nEvening session: 20:00–21:00 UK time\nCourse fee: £120",
      action: { label: "Join TikTok Training", type: "whatsapp", text: "Hi, I'd like to join the TikTok Mastery Training." }
    },
    ebay: {
      keywords: ["ebay", "e-bay"],
      menuLabel: "eBay Training",
      reply:
        "eBay Training starts on the 1st & 15th of every month. It runs for 2 weeks, Monday to Friday, 1 hour a day, plus a live Saturday Q&A.\n\nMorning session: 11:00–12:00 UK time\nEvening session: 21:00–22:00 UK time\nCourse fee: £120",
      action: { label: "Join eBay Training", type: "whatsapp", text: "Hi, I'd like to join the eBay Training." }
    },
    amazon: {
      keywords: ["amazon"],
      menuLabel: "Amazon Training",
      reply:
        "Amazon Training is coming soon! We haven't confirmed dates, duration or pricing yet — but I can let the team know you're interested so they can update you.",
      action: { label: "Notify Me", type: "whatsapp", text: "Hi, please notify me when Amazon Training launches." }
    },
    consultation: {
      keywords: ["consult", "consultation", "30", "£30", "account creation", "set up account", "setup account", "create account"],
      menuLabel: "£30 Consultation",
      reply:
        "Our Paid Account Creation Consultation is a one-off £30 session. We'll guide you directly through setting up your online selling account.",
      action: { label: "Book £30 Consultation", type: "whatsapp", text: "Hi, I'd like to book the £30 Account Creation Consultation." }
    },
    schedule: {
      keywords: ["schedule", "timing", "timings", "when", "hours", "saturday", "q&a", "qa", "start date", "dates"],
      reply:
        "Both TikTok and eBay training run for 2 weeks, Monday to Friday, 1 hour a day, with a live Saturday Q&A. New cohorts start on the 1st and 15th of every month.\n\nWant the exact times for a specific course? Ask me about TikTok or eBay."
    },
    price: {
      keywords: ["price", "cost", "fee", "fees", "how much", "pricing", "payment", "pay", "bank transfer", "bank details"],
      reply:
        "TikTok Mastery Training and eBay Training are both £120 for the full 2-week course. The £30 Account Creation Consultation is a separate one-off fee and isn't deducted from that price.\n\nPayment is by bank transfer, arranged directly over WhatsApp — we'll share our account details privately once you're ready to enrol.",
      action: { label: "Ask About Payment", type: "whatsapp", text: "Hi, I'd like to know more about payment for a training course." }
    },
    human: {
      keywords: ["human", "agent", "person", "talk to someone", "call", "speak to"],
      reply: "Of course — you can chat with our team directly on WhatsApp, or email scalexlimiteduk@gmail.com.",
      action: { label: "Chat on WhatsApp", type: "whatsapp", text: "Hi, I'd like to speak with someone at ScaleX Academy UK." }
    },
    facebook: {
      keywords: ["facebook", "social", "instagram"],
      reply: "You can follow us on Facebook for updates and announcements.",
      action: { label: "Follow on Facebook", type: "facebook" }
    }
  };

  var TOPIC_ORDER = ["tiktok", "ebay", "amazon", "consultation", "schedule", "price", "human", "facebook"];

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
   */
  function setQuickReplies(items) {
    quickRepliesEl.innerHTML = "";
    (items || []).forEach(function (item) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quick-reply" + (item.type === "whatsapp" ? " is-link" : "") + (item.type === "facebook" ? " is-facebook" : "");

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
        "I'm not sure about that one — but I can tell you about our TikTok, eBay or Amazon training, the £30 consultation, or connect you with our team on WhatsApp."
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
          "I can answer questions about our TikTok, eBay and Amazon training, schedules, or the £30 consultation. What would you like to know?",
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
