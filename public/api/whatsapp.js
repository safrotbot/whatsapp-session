import axios from "axios";

export default async function handler(req, res) {
  const { number } = req.query;

  if (!number) {
    return res.status(400).json({ error: "لم يتم إدخال رقم" });
  }

  try {
    // استدعاء API الخارجي اللي بيجيب كود الجلسة
    const apiRes = await axios.get(`https://pair.davidcyril.name.ng/code?number=${encodeURIComponent(number)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      },
      timeout: 20000
    });

    const data = apiRes.data;

    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({
        success: false,
        number,
        message: "لم يتم العثور على كود جلسة للرقم هذا."
      });
    }

    // ترجع البيانات مباشرة للموقع
    res.status(200).json({
      success: true,
      number,
      code: data.code || null,
      message: "تم استلام الكود بنجاح 🔥"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      number,
      message: "❌ حدث خطأ في السيرفر",
      error: err.message
    });
  }
        }
