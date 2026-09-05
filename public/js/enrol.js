(function () {
  "use strict";

  var WHATSAPP_NUMBER = "447356031478";

  // Course data. Batch dates here are real, client-confirmed batches — unlike
  // index.html (marketing copy, which only ever states the recurring "1st &
  // 15th" cadence), this is the operational enrolment tool where concrete
  // dates are exactly what's needed. See CLAUDE.md.
  var COURSES = {
    tiktok: {
      name: "TikTok Seller Centre",
      feeGbp: 120,
      durationWeeks: 2,
      sessions: [
        { id: "Morning", label: "Morning", time: "10:00–11:00 UK time" },
        { id: "Evening", label: "Evening", time: "20:00–21:00 UK time" }
      ],
      batches: [
        { date: "2026-09-16", number: 6 },
        { date: "2026-10-01", number: 7 },
        { date: "2026-10-16", number: 8 }
      ]
    },
    ebay: {
      name: "eBay Training",
      feeGbp: 120,
      durationWeeks: 2,
      sessions: [
        { id: "Morning", label: "Morning", time: "11:00–12:00 UK time" },
        { id: "Evening", label: "Evening", time: "21:00–22:00 UK time" }
      ],
      batches: [
        { date: "2026-09-16", number: 2 },
        { date: "2026-10-01", number: 3 },
        { date: "2026-10-16", number: 4 }
      ]
    }
  };

  var form = document.getElementById("enrol-form");
  if (!form) return;

  function byId(id) { return document.getElementById(id); }
  function val(id) { var el = byId(id); return el ? el.value.trim() : ""; }

  function fmtDate(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  function makeRef() {
    return "ENR-" + Math.random().toString(36).slice(2, 6).toUpperCase() +
      Date.now().toString(36).slice(-3).toUpperCase();
  }

  function currentCourse() {
    var picked = form.querySelector('input[name="course"]:checked');
    return COURSES[picked ? picked.value : "tiktok"];
  }

  /**
   * Radio "cards" hide the real input and show state via a .checked class,
   * so the visual state has to be synced by hand on every change.
   */
  function syncChecked(groupEl) {
    groupEl.querySelectorAll(".opt").forEach(function (opt) {
      var input = opt.querySelector("input");
      opt.classList.toggle("checked", !!(input && input.checked));
    });
  }

  function renderBatches() {
    var course = currentCourse();
    var group = byId("batch-group");
    group.innerHTML = course.batches.map(function (b, i) {
      return '<label class="opt' + (i === 0 ? " checked" : "") + '">' +
        '<input type="radio" name="batch" value="' + b.date + '"' + (i === 0 ? " checked" : "") + '>' +
        '<span class="opt-title">' + fmtDate(b.date) + "</span>" +
        '<span class="opt-sub">Batch ' + b.number + "</span>" +
        "</label>";
    }).join("");
  }

  function renderSessions() {
    var course = currentCourse();
    var group = byId("session-group");
    var previous = form.querySelector('input[name="session"]:checked');
    var keep = previous ? previous.value : null;
    group.innerHTML = course.sessions.map(function (s) {
      var checked = s.id === keep;
      return '<label class="opt' + (checked ? " checked" : "") + '">' +
        '<input type="radio" name="session" value="' + s.id + '"' + (checked ? " checked" : "") + ">" +
        '<span class="opt-title">' + s.label + "</span>" +
        '<span class="opt-sub">' + s.time + "</span>" +
        "</label>";
    }).join("");
  }

  function updateSummary() {
    var course = currentCourse();
    var batch = form.querySelector('input[name="batch"]:checked');
    var session = form.querySelector('input[name="session"]:checked');

    byId("sum-course").textContent = course.name;
    byId("sum-batch").textContent = batch ? fmtDate(batch.value) : "Not selected";
    byId("sum-fee").textContent = "£" + course.feeGbp;
    byId("fee-amount").textContent = "£" + course.feeGbp;

    if (session) {
      var match = course.sessions.filter(function (s) { return s.id === session.value; })[0];
      byId("sum-session").textContent = match ? match.label + " (" + match.time + ")" : session.value;
    } else {
      byId("sum-session").textContent = "Not selected";
    }
  }

  function setError(fieldId, on) {
    var el = byId(fieldId);
    if (el) el.classList.toggle("has-error", !!on);
  }

  function collect() {
    var ok = true;
    var course = currentCourse();
    var data = {
      course: course,
      batch: form.querySelector('input[name="batch"]:checked'),
      session: form.querySelector('input[name="session"]:checked')
    };

    setError("f_batch", !data.batch);
    if (!data.batch) ok = false;

    setError("f_session", !data.session);
    if (!data.session) ok = false;

    data.fullName = val("full_name");
    setError("f_name", !data.fullName);
    if (!data.fullName) ok = false;

    data.email = val("email").replace(/\s+/g, "");
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    setError("f_email", !emailOk);
    if (!emailOk) ok = false;

    var code = val("wa_code");
    if (code === "other") code = val("wa_code_custom");
    var digits = val("wa_number").replace(/\D/g, "");
    var waOk = /^\+?\d{1,4}$/.test(code) && digits.length >= 7;
    setError("f_whatsapp", !waOk);
    if (!waOk) ok = false;
    data.whatsapp = code + " " + digits;

    data.country = val("country");
    setError("f_country", !data.country);
    if (!data.country) ok = false;

    data.city = val("city");
    setError("f_city", !data.city);
    if (!data.city) ok = false;

    data.altPhone = val("alt_phone");
    data.notes = val("notes");

    var paid = form.querySelector('input[name="paid"]:checked');
    data.paidStatus = paid ? paid.value : "No";
    if (data.paidStatus !== "No") {
      data.paidAmount = val("paid_amount");
      data.paidDate = val("paid_date");
      data.paidMethod = val("paid_method");
      data.paidRef = val("paid_ref");
    }

    var c1 = byId("consent_correct").checked;
    var c2 = byId("consent_use").checked;
    byId("f_consent1").classList.toggle("has-error", !c1);
    byId("f_consent2").classList.toggle("has-error", !c2);
    if (!c1 || !c2) ok = false;

    return ok ? data : null;
  }

  function sessionTime(data) {
    var match = data.course.sessions.filter(function (s) { return s.id === data.session.value; })[0];
    return match ? match.time : "";
  }

  function buildMessage(data, ref) {
    var lines = [
      "NEW ENROLMENT — ScaleX Academy UK",
      "Reference: " + ref,
      "",
      "COURSE",
      "Course: " + data.course.name,
      "Batch start: " + fmtDate(data.batch.value),
      "Session: " + data.session.value + " (" + sessionTime(data) + ")",
      "Duration: " + data.course.durationWeeks + " weeks",
      "Course fee: £" + data.course.feeGbp,
      "",
      "STUDENT",
      "Name: " + data.fullName,
      "Email: " + data.email,
      "WhatsApp: " + data.whatsapp
    ];
    if (data.altPhone) lines.push("Alt phone: " + data.altPhone);
    lines.push("Country: " + data.country);
    lines.push("City: " + data.city);

    lines.push("", "PAYMENT");
    if (data.paidStatus === "No") {
      lines.push("Already paid: Not yet — please send bank transfer details");
    } else {
      lines.push("Already paid: " + data.paidStatus);
      if (data.paidAmount) lines.push("Amount paid: £" + data.paidAmount);
      if (data.paidDate) lines.push("Payment date: " + fmtDate(data.paidDate));
      if (data.paidMethod) lines.push("Method: " + data.paidMethod);
      if (data.paidRef) lines.push("Reference: " + data.paidRef);
    }

    if (data.notes) lines.push("", "NOTES", data.notes);

    return lines.join("\n");
  }

  function renderRecap(data, ref) {
    var rows = [
      ["Reference", ref],
      ["Course", data.course.name],
      ["Batch start", fmtDate(data.batch.value)],
      ["Session", data.session.value + " (" + sessionTime(data) + ")"],
      ["Name", data.fullName],
      ["Email", data.email],
      ["WhatsApp", data.whatsapp],
      ["Course fee", "£" + data.course.feeGbp]
    ];
    byId("recap").innerHTML = rows.map(function (r) {
      return "<tr><td>" + r[0] + "</td><td>" + escapeHtml(r[1]) + "</td></tr>";
    }).join("");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- Wiring ----------

  form.addEventListener("change", function (e) {
    var name = e.target.name;
    if (name === "course") {
      syncChecked(byId("course-group"));
      renderBatches();
      renderSessions();
    } else if (name === "batch") {
      syncChecked(byId("batch-group"));
    } else if (name === "session") {
      syncChecked(byId("session-group"));
    } else if (name === "paid") {
      syncChecked(byId("paid-group"));
      byId("paid-details").classList.toggle("hidden", e.target.value === "No");
    }

    if (e.target.id === "wa_code") {
      byId("wa_code_custom").classList.toggle("hidden", e.target.value !== "other");
    }

    updateSummary();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var errBox = byId("form-error");
    errBox.classList.add("hidden");

    var data = collect();
    if (!data) {
      errBox.textContent = "Please check the highlighted fields above and tick both boxes.";
      errBox.classList.remove("hidden");
      var firstBad = form.querySelector(".has-error");
      if (firstBad) firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    var ref = makeRef();
    var link = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(buildMessage(data, ref));

    // Opened synchronously inside the submit handler so browsers treat it as
    // user-initiated and don't block it as a popup.
    window.open(link, "_blank", "noopener");

    byId("ref-code").textContent = ref;
    renderRecap(data, ref);
    byId("wa-again").setAttribute("href", link);

    byId("copy-btn").onclick = function () {
      var text = buildMessage(data, ref);
      var done = function () {
        byId("copy-btn").textContent = "Copied!";
        setTimeout(function () { byId("copy-btn").textContent = "Copy details instead"; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        done();
      }
    };

    form.classList.add("hidden");
    byId("summary-card").classList.add("hidden");
    byId("success-card").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  renderBatches();
  renderSessions();
  updateSummary();
})();
