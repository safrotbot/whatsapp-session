import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import pino from "pino";
import {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  makeWASocket
} from "@whiskeysockets/baileys";
import { protoType, serialize } from "./lib/simple.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // عشان يقرأ index.html

if (!global.subbots) global.subbots = [];

app.get("/pair", async (req, res) => {
  const number = req.query.number;
  if (!number) return res.json({ success: false, message: "❌ اكتب رقم صحيح" });

  const folder = path.join("Sessions/SubBot", number);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  try {
    const { state, saveCreds } = await useMultiFileAuthState(folder);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger: pino({ level: "silent" }),
      auth: state,
      markOnlineOnConnect: true,
      syncFullHistory: false,
      browser: Browsers.macOS("Safari"),
      printQRInTerminal: false
    });

    sock.ev.on("creds.update", saveCreds);
    protoType(); serialize();

    let sentQR = false;

    sock.ev.on("connection.update", async (update) => {
      if (update.qr && !sentQR) {
        sentQR = true;
        return res.json({ success: true, qr: update.qr });
      }
      if (update.connection === "open") {
        return res.json({ success: true, message: "✅ البوت متصل بالفعل" });
      }
    });

  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "❌ حدث خطأ داخلي" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ API server running on port ${PORT}`));
