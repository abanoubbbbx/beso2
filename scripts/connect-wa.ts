import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import http from "http";

let client: Client | null = null;

async function connectToWhatsApp() {
  client = new Client({
    authStrategy: new LocalAuth({ dataPath: "./.wwebjs-auth" }),
    puppeteer: {
      headless: true,
      executablePath:
        process.env.CHROME_PATH ||
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    },
  });

  client.on("qr", (qr) => {
    console.log("\n📱 امسح الكود ده من WhatsApp:\n");
    qrcode.generate(qr, { small: true });
    console.log("\nافتح WhatsApp → Settings → Linked Devices → Link a Device\n");
  });

  client.on("ready", () => {
    console.log("\n✅ WhatsApp متصل بنجاح!\n");
  });

  client.on("auth_failure", (msg) => {
    console.error("❌ فشل المصادقة:", msg);
  });

  client.on("disconnected", (reason) => {
    console.log("⚠️ اتقطع:", reason);
    client = null;
  });

  await client.initialize();
}

/* ── HTTP server ── */
const PORT = 3010;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Secret");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/send") {
    const secret = req.headers["x-secret"];
    if (secret !== (process.env.BAILEYS_SECRET || "beso-wa-secret")) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { to, message } = JSON.parse(body);

        if (!client) {
          res.writeHead(503);
          res.end(JSON.stringify({ error: "WhatsApp not connected" }));
          return;
        }

        let clean = to.replace(/[^0-9]/g, "");
        if (clean.startsWith("0")) clean = "20" + clean.slice(1);

        // whatsapp-web.js بيستخدم @c.us
        const jid = `${clean}@c.us`;
        await client.sendMessage(jid, message);

        console.log("✅ رسالة اتبعتت لـ", clean);
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        console.error("❌ فشل الإرسال:", err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: String(err) }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\n🚀 WhatsApp service on http://localhost:${PORT}\n`);
});

connectToWhatsApp().catch(console.error);

process.on("SIGINT", () => {
  console.log("\n👋 Bye");
  process.exit(0);
});