// pages/api/whatsapp.js
import axios from "axios";

export default async function handler(req, res) {
  const { number } = req.query;

  if (!number) {
    return res.status(400).json({ success: false, message: "❌ لم يتم إدخال رقم" });
  }

  try {
    // هنا نرسل طلب للبوت/API الخارجي اللي بيولّد كود الجلسة
    const url = `https://pair.davidcyril.name.ng/code?number=${encodeURIComponent(number)}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
      timeout: 20000,
    });

    const data = response.data;

    if (!data || Object.keys(data).length === 0) {
      return res.status(200).json({
        success: false,
        number,
        message: "⚠️ لم يتم العثور على كود جلسة بعد، حاول لاحقاً"
      });
    }

    // لو الكود موجود
    if (data.code) {
      return res.status(200).json({
        success: true,
        number,
        code: data.code,
        message: "✅ تم الحصول على كود الجلسة بنجاح"
      });
    }

    // لو البيانات موجودة بس بدون حقل code
    return res.status(200).json({
      success: false,
      number,
      message: "✅ تم استلام الرقم لكن الكود غير متوفر حالياً",
      details: data
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      number,
      message: "❌ حدث خطأ في الاتصال بالخادم"
    });
  }
}
