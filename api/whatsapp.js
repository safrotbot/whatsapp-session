import axios from "axios";

export default async function handler(req, res) {
  const { number } = req.query;

  if (!number) {
    return res.status(400).json({ message: "⚠️ الرقم مطلوب!" });
  }

  try {
    const response = await axios.get(`https://pair.davidcyril.name.ng/code?number=${encodeURIComponent(number)}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 20000
    });

    const data = response.data;

    if (data && data.code) {
      // لو فيه كود موجود
      return res.status(200).json({ code: data.code });
    } else {
      // لو مفيش كود
      return res.status(200).json({
        message: `⚠️ لم يتم العثور على كود للرقم ${number}.`,
        response: data
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
