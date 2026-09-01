"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const LEADS_FILE = path.join(__dirname, "leads.json");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, "[]", "utf8");
}

// Serializes writes so concurrent submissions can't clobber each other.
let writeQueue = Promise.resolve();

function appendLead(lead) {
  writeQueue = writeQueue.then(function () {
    return new Promise(function (resolve, reject) {
      fs.readFile(LEADS_FILE, "utf8", function (err, raw) {
        if (err) return reject(err);
        let leads;
        try {
          leads = JSON.parse(raw || "[]");
        } catch (parseErr) {
          leads = [];
        }
        leads.push(lead);
        fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8", function (writeErr) {
          if (writeErr) return reject(writeErr);
          resolve();
        });
      });
    });
  });
  return writeQueue;
}

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function serveStatic(req, res) {
  let reqPath = decodeURIComponent(req.url.split("?")[0]);
  if (reqPath === "/") reqPath = "/index.html";

  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Prevent path traversal outside the public directory.
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Not found");
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
}

function handleCreateLead(req, res) {
  let body = "";
  req.on("data", function (chunk) {
    body += chunk;
    if (body.length > 1e6) req.destroy(); // guard against oversized payloads
  });
  req.on("end", function () {
    let payload;
    try {
      payload = JSON.parse(body);
    } catch (e) {
      return sendJson(res, 400, { error: "Invalid JSON" });
    }

    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const email = typeof payload.email === "string" ? payload.email.trim() : "";
    const cohortDate = typeof payload.cohortDate === "string" ? payload.cohortDate.trim() : "";

    if (!name || !email || !cohortDate) {
      return sendJson(res, 400, { error: "name, email, and cohortDate are all required" });
    }
    if (!EMAIL_RE.test(email)) {
      return sendJson(res, 400, { error: "Invalid email address" });
    }

    const lead = {
      name: name,
      email: email,
      cohortDate: cohortDate,
      submittedAt: new Date().toISOString()
    };

    appendLead(lead)
      .then(function () {
        sendJson(res, 201, { ok: true, lead: lead });
      })
      .catch(function (err) {
        console.error("Failed to save lead:", err);
        sendJson(res, 500, { error: "Failed to save lead" });
      });
  });
}

const server = http.createServer(function (req, res) {
  if (req.method === "POST" && req.url === "/api/leads") {
    return handleCreateLead(req, res);
  }
  if (req.method === "GET") {
    return serveStatic(req, res);
  }
  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, function () {
  console.log("Scalex Academy Concierge server running at http://localhost:" + PORT);
});
