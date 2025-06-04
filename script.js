// العناصر في واجهة المستخدم
const usernameInput = document.getElementById('username');
const showButton = document.getElementById('showButton');
const previewContainer = document.getElementById('previewContainer');
const imageCanvas = document.getElementById('imageCanvas');
const ctx = imageCanvas.getContext('2d');
const loadingElement = document.getElementById('loading');

// متغيرات للتحكم في عملية التنزيل
let downloadTriggered = false;
let imageLoaded = false;
let loadedImage = null;

// إضافة معالج الحدث للزر "عرض"
showButton.addEventListener('click', generateImage);

// إضافة معالج الحدث للإدخال لتمكين ضغط Enter للعرض
usernameInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        generateImage();
    }
});

// دالة لتوليد الصورة المخصصة
function generateImage() {
    const username = usernameInput.value.trim();

    if (!username) {
        alert('الرجاء إدخال اسمك أولاً');
        return;
    }

    // إعادة تعيين حالة التنزيل
    downloadTriggered = false;

    // إظهار حالة التحميل
    loadingElement.style.display = 'block';
    previewContainer.style.display = 'none';

    // إذا كانت الصورة محملة بالفعل، استخدم النسخة المخزنة
    if (imageLoaded && loadedImage) {
        drawImageWithText(loadedImage);
        return;
    }

    // تحميل الصورة
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        // تخزين الصورة المحملة
        loadedImage = img;
        imageLoaded = true;

        // رسم الصورة مع النص
        drawImageWithText(img);
    };

    img.onerror = function () {
        loadingElement.style.display = 'none';
        alert('فشل تحميل الصورة. يرجى التحقق من ملف الصورة.');
    };

    // استخدم الصورة المحلية
    // ملاحظة: لاستخدام صورة من ImgBB، استخدم الرابط المباشر للصورة وليس رابط الصفحة
    // مثال: https://i.ibb.co/XXXXX/filename.jpg
    img.src = 'https://i.ibb.co/MxcTg6bf/bgeid.jpg';
}

// رسم الصورة مع النص
function drawImageWithText(img) {
    // تعيين أبعاد الكانفاس لتتناسب مع الصورة
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;

    // رسم الصورة الأصلية
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // تكوين نمط النص
    const username = usernameInput.value.trim();
    const fontSize = Math.floor(img.width * 0.045); // تم تصغير حجم الخط من 0.06 إلى 0.045
    const fontColor = '#1c4e6e'; // لون أزرق داكن يتناسب مع هوية الجمعية

    // استخدام خط تدوال العربي
    ctx.font = `bold ${fontSize}px 'Tajawal', Arial, Tahoma, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // تحديد موضع النص في المنطقة البيضاء الموجودة في الأسفل
    const textX = (img.width / 2) + (img.width * 0.2); // تم تحريك النص لليمين
    const textY = img.height * 0.80; // موضع النص في المنطقة البيضاء

    // التأكد من أن النص لا يتجاوز حدود المنطقة البيضاء
    const maxWidth = img.width * 0.90;

    // رسم النص
    ctx.fillStyle = fontColor;
    ctx.fillText(username, textX, textY, maxWidth);

    // إخفاء حالة التحميل وإظهار المعاينة
    loadingElement.style.display = 'none';
    previewContainer.style.display = 'block';

    // تنزيل الصورة تلقائيًا (مرة واحدة فقط)
    if (!downloadTriggered) {
        downloadTriggered = true;
        setTimeout(downloadImage, 500);
    }
}

// دالة لتنزيل الصورة
function downloadImage() {
    try {
        const dataURL = imageCanvas.toDataURL('image/jpeg', 0.9);
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = `عيد_الأضحى_${usernameInput.value.trim()}.jpg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    } catch (error) {
        console.error('حدث خطأ أثناء تنزيل الصورة:', error);
        alert('حدث خطأ أثناء تنزيل الصورة. يرجى المحاولة مرة أخرى.');
    }
}