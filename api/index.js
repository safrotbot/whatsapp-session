import axios from "axios";

export default async function handler(req, res) {
  const number = req.query.number;
  if (!number) return res.status(400).json({ error: "اكتب الرقم في الرابط ?number=" });

  try {
    const url = `https://pair.davidcyril.name.ng/code?number=${encodeURIComponent(number)}`;
    const response = await axios.get(url, { timeout: 20000 });
    const data = response.data;

    if (data?.code) {
      res.status(200).json({ code: data.code });
    } else {
      res.status(200).json({ message: "لم يتم العثور على كود", data });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
