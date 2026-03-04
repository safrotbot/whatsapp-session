import { default as makeWASocket, useSingleFileAuthState } from "@whiskeysockets/baileys";
import P from "pino";
import QRCode from "qrcode";

// استعمل auth مؤقت
const tempAuth = './temp-session.json';

export default async function handler(req, res) {
  const { number } = req.query;
  if (!number) return res.status(400).json({ success: false, message: "اكتب رقم صحيح" });

  try {
    const { state, saveCreds } = await useSingleFileAuthState(tempAuth);

    const sock = makeWASocket({
      printQRInTerminal: false,
      auth: state,
      logger: P({ level: "silent" })
    });

    sock.ev.on('creds.update', saveCreds);

    let qrCode = null;

    sock.ev.on('connection.update', update => {
      const { qr } = update;
      if (qr) qrCode = qr;
    });

    // ندي 5 ثواني عشان يظهر QR
    await new Promise(r => setTimeout(r, 5000));

    if (!qrCode) return res.json({ success: false, message: "❌ فشل إنشاء الجلسة" });

    // تحويل QR لصورة base64
    const qrImage = await QRCode.toDataURL(qrCode);

    return res.json({ success: true, qr: qrImage });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "حدث خطأ داخلي" });
  }
}
