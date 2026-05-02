document.addEventListener('DOMContentLoaded', function () {
    // --- 1. LOADING BAR ÇÖZÜMÜ ---
    const lb = document.getElementById('loading-bar');
    if (lb) {
        lb.style.width = '100%';
        setTimeout(() => { lb.style.display = 'none'; }, 400);
    }
    // HTML'deki formu JavaScript'e tanıtıyoruz


    const doktorData = {
        "goz": ["Dr. Ahmet Yılmaz", "Dr. Ali Gürlek"],
        "kardiyo": ["Dr. Ayşe Demir", "Dr. Serpil Yıldız"],
        "noroloji": ["Dr. Adile Ulucan", "Dr. Hüseyin Aktepe"],
        "dahiliye": ["Dr. Gürbüz Haşimoğlu", "Dr. Nebahat Mavili"]
    };

    const getEl = (id) => document.getElementById(id);
    const polySelect = getEl('polySelect');
    const docSelect = getEl('docSelect');
    const appDateInput = getEl('appDate');
    const timeSelect = getEl('timeSelect');
    const appForm = getEl('appointmentForm');

    // --- 2. TARİH VE DOKTOR MANTIĞI ---
    if (appDateInput) {
        const today = new Date().toISOString().split('T')[0];
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        appDateInput.setAttribute('min', today);
        appDateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
        appDateInput.value = today;
    }

    function updateTimes() {
        if (!appDateInput?.value || !docSelect?.value || !timeSelect) return;

        const saved = JSON.parse(localStorage.getItem('hospitalAppointments') || "[]");

        Array.from(timeSelect.options).forEach(opt => {
            if (opt.value === "") return;

            // Önce saatin yanındaki eski "(DOLU)" yazılarını temizle
            const originalTime = opt.value;

            const isTaken = saved.some(a =>
                a.date === appDateInput.value &&
                a.doctor === docSelect.value &&
                a.time === originalTime
            );

            if (isTaken) {
                opt.disabled = true;
                opt.textContent = originalTime + " (DOLU)"; // Sadece bir kez ekler
            } else {
                opt.disabled = false;
                opt.textContent = originalTime; // Dolu değilse orijinal haline döner
            }
        });
    }

    polySelect?.addEventListener('change', function () {
        const val = this.value;
        if (!docSelect) return;
        docSelect.disabled = !val;
        docSelect.innerHTML = '<option value="">-- Doktor Seçin --</option>';
        if (val && doktorData[val]) {
            doktorData[val].forEach(dr => {
                const opt = new Option(dr, dr);
                docSelect.add(opt);
            });
        }
        updateTimes();
    });

    appDateInput?.addEventListener('change', updateTimes);
    docSelect?.addEventListener('change', updateTimes);

    // --- 3. RANDEVU KAYDETME ---
    appForm?.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = { doctor: docSelect.value, date: appDateInput.value, time: timeSelect.value, tc: getEl('tc')?.value || "Girilmedi" };
        const saved = JSON.parse(localStorage.getItem('hospitalAppointments') || "[]");
        saved.push(data);
        localStorage.setItem('hospitalAppointments', JSON.stringify(saved));
        appForm.style.display = 'none';
        const success = getEl('appointmentSuccess');
        if (success) success.style.display = 'block';
        const summary = getEl('summaryText');
        if (summary) summary.innerHTML = `<strong>Doktor:</strong> ${data.doctor}<br><strong>Tarih:</strong> ${data.date}<br><strong>Saat:</strong> ${data.time}`;
    });

    // --- 4. POLİKLİNİK FİLTRE (URL PARAM) ---
    const secilenBolum = new URLSearchParams(window.location.search).get('bolum');
    if (secilenBolum) {
        document.querySelectorAll('.doctor-card').forEach(k => {
            k.style.display = k.classList.contains(secilenBolum) ? 'block' : 'none';
        });
    }

    // --- 5. SAĞ TIK VE POPUP ---
    document.addEventListener('contextmenu', e => { e.preventDefault(); getEl('custom-popup')?.classList.remove('popup-hidden'); });
    window.closePopup = () => getEl('custom-popup')?.classList.add('popup-hidden');
});
// --- FOOTER GERİ BİLDİRİM FORMU İŞLEME ---
const fbForm = document.getElementById('footerFeedbackForm');
if (fbForm) {
    fbForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Sayfanın yenilenmesini engelle

        const btn = fbForm.querySelector('.btn-footer');
        const email = document.getElementById('fbEmail')?.value;

        // Kullanıcıya geri bildirim ver
        if (btn) {
            btn.textContent = "Gönderildi ✅";
            btn.style.backgroundColor = "#27ae60";
            btn.disabled = true;
        }

        // İstersen bir alert ile de onay verebilirsin
        setTimeout(() => {
            alert("Teşekkürler! Mesajınız başarıyla iletildi. En kısa sürede " + email + " adresine dönüş yapacağız.");
            fbForm.reset(); // Formu temizle
            btn.textContent = "Gönder";
            btn.style.backgroundColor = "#3498db";
            btn.disabled = false;
        }, 500);
    });
}