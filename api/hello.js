<!DOCTYPE html>
<html lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>API Tester</title>
</head>
<body>
<h1>اختبر الـ API</h1>
<button id="testBtn">جرب الـ API</button>
<p id="result"></p>

<script>
const btn = document.getElementById('testBtn');
const result = document.getElementById('result');

btn.addEventListener('click', async () => {
    result.textContent = 'جارٍ الاتصال... 🔄';
    try {
        const res = await fetch('/api/hello');
        const data = await res.json();
        result.textContent = JSON.stringify(data);
    } catch (err) {
        result.textContent = 'حدث خطأ ❌: ' + err.message;
    }
});
</script>
</body>
</html>
