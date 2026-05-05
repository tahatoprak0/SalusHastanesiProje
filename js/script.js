document.addEventListener('DOMContentLoaded', function () {

    const lb = document.getElementById('loading-bar');
    if (lb) {
        lb.style.width = '100%';
        setTimeout(() => { lb.style.display = 'none'; }, 400);
    }


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

            const originalTime = opt.value;

            const isTaken = saved.some(a =>
                a.date === appDateInput.value &&
                a.doctor === docSelect.value &&
                a.time === originalTime
            );

            if (isTaken) {
                opt.disabled = true;
                opt.textContent = originalTime + " (DOLU)";
            } else {
                opt.disabled = false;
                opt.textContent = originalTime;
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

    const secilenBolum = new URLSearchParams(window.location.search).get('bolum');
    if (secilenBolum) {
        document.querySelectorAll('.doctor-card').forEach(k => {
            k.style.display = k.classList.contains(secilenBolum) ? 'block' : 'none';
        });
    }

    document.addEventListener('contextmenu', e => { e.preventDefault(); getEl('custom-popup')?.classList.remove('popup-hidden'); });
    window.closePopup = () => getEl('custom-popup')?.classList.add('popup-hidden');

    const doctorModal = document.getElementById('doctor-modal');
    const modalOverlay = document.querySelector('#doctor-modal .modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDept = document.getElementById('modal-dept');
    const modalBio = document.getElementById('modal-bio');
    const modalImage = document.querySelector('#doctor-modal .modal-image img');

    const doctorDetails = {
        'dr. ahmet yılmaz': {
            bio: 'Göz Hastalıkları uzmanı. 15 yıllık deneyimiyle katarakt ve retina cerrahisi alanında hastalarına hizmet vermektedir.',
            education: ['İstanbul Tıp Fakültesi, 2006', 'Göz Hastalıkları Uzmanlık Eğitimi, 2012'],
            previous: ['Şişli Göz Hastanesi (2012-2017)', 'Bakırköy Göz Merkezi (2017-2021)']
        },
        'dr. ali gürlek': {
            bio: 'Göz Hastalıkları uzmanı. Kontakt lens ve refraktif cerrahi konularında uzmandır.',
            education: ['Ankara Üniversitesi Tıp Fakültesi, 2008', 'Refraktif Cerrahi Eğitimi, 2014'],
            previous: ['Ankara Göz Kliniği (2014-2018)', 'Özel Göz Hastanesi (2018-2024)']
        },
        'dr. ayşe demir': {
            bio: 'Kardiyoloji uzmanı. Koroner hastalıkların tanı ve tedavisinde tecrübelidir.',
            education: ['Ege Üniversitesi Tıp Fakültesi, 2005', 'Kardiyoloji Uzmanlık, 2011'],
            previous: ['Ege Kalp Merkezi (2011-2016)', 'İzmir Kardiyoloji Enstitüsü (2016-2022)']
        },
        'dr. serpil yıldız': {
            bio: 'Kardiyoloji uzmanı. Kalp yetmezliği ve ileri görüntüleme alanlarında çalışmaktadır.',
            education: ['Hacettepe Üniversitesi Tıp Fakültesi, 2007', 'Gelişmiş Görüntüleme Sertifikası, 2015'],
            previous: ['Ankara Kalp Hastanesi (2012-2019)', 'Özel Kalp Merkezi (2019-2023)']
        },
        'dr. adile ulucan': {
            bio: 'Nöroloji uzmanı. Baş ağrısı ve nörodejeneratif hastalıklar üzerine uzmanlaşmıştır.',
            education: ['Marmara Üniversitesi Tıp Fakültesi, 2004', 'Nöroloji Uzmanlık, 2010'],
            previous: ['Marmara Nöroloji (2010-2015)', 'İstanbul Nöro Merkezi (2015-2022)']
        },
        'dr. huseyin aktepe': {
            bio: 'Nöroloji uzmanı. Epilepsi ve nörolojik rehabilitasyon tedavilerinde deneyimlidir.',
            education: ['Dokuz Eylül Üniversitesi Tıp Fakültesi, 2006', 'Epilepsi ve Rehabilitasyon Sertifikası, 2013'],
            previous: ['İzmir Nöroloji Hastanesi (2013-2018)', 'Özel Rehabilitasyon Merkezi (2018-2024)']
        },
        'dr. gürbüz haşimoğlu': {
            bio: 'Dahiliye uzmanı. İç hastalıkları, kronik hastalık yönetimi ve metabolik bozukluklar konusunda uzmandır.',
            education: ['GATA Tıp Fakültesi, 2003', 'Dahiliye Uzmanlık, 2009'],
            previous: ['Merkez Hastanesi Dahiliye (2009-2015)', 'Şehir Hastanesi (2015-2022)']
        },
        'dr. nebahat mavili': {
            bio: 'Dahiliye uzmanı. Diyabet ve hormon dengesizlikleri üzerine hastalarına bütüncül bakım sunmaktadır.',
            education: ['Ankara Üniversitesi Tıp Fakültesi, 2009', 'Endokrinoloji İleri Eğitim, 2016'],
            previous: ['Ankara Endokrin Merkezi (2016-2020)', 'Özel İç Hastalıkları Kliniği (2020-2024)']
        }
    };

    const normalize = s => s
        .toLowerCase()
        .replace(/\./g, '')
        .normalize('NFD').replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const normalizedDoctorDetails = {};
    Object.keys(doctorDetails).forEach(k => { normalizedDoctorDetails[normalize(k)] = doctorDetails[k]; });

    document.querySelectorAll('.doctor-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const name = card.querySelector('h3')?.textContent || '';
            const dept = card.querySelector('.dr-dept')?.textContent || '';
            const img = card.querySelector('.dr-image img')?.getAttribute('src') || '';
            modalTitle.textContent = name;
            modalDept.textContent = dept;
            const key = name.trim();
            const normKey = normalize(key);
            const details = normalizedDoctorDetails[normKey];
            if (details) {
                modalBio.innerHTML = `
                    <p>${details.bio}</p>
                    <div class="modal-section"><strong>Eğitim</strong>
                        <ul>${details.education.map(e => `<li>${e}</li>`).join('')}</ul>
                    </div>
                    <div class="modal-section"><strong>Çalıştığı Hastaneler</strong>
                        <ul>${details.previous.map(p => `<li>${p}</li>`).join('')}</ul>
                    </div>
                `;
            } else {
                modalBio.innerHTML = `<p>Uzmanlık: ${dept}. Detaylı özgeçmiş yakında eklenecek.</p>`;
            }
            if (modalImage) {
                modalImage.setAttribute('src', img);
                modalImage.setAttribute('alt', name);
            }
            doctorModal?.classList.remove('modal-hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeDoctorModal = () => {
        doctorModal?.classList.add('modal-hidden');
        document.body.style.overflow = '';
    };

    modalClose?.addEventListener('click', closeDoctorModal);
    modalOverlay?.addEventListener('click', closeDoctorModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDoctorModal(); });
});

const fbForm = document.getElementById('footerFeedbackForm');
if (fbForm) {
    fbForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const btn = fbForm.querySelector('.btn-footer');
        const email = document.getElementById('fbEmail')?.value;

        if (btn) {
            btn.textContent = "Gönderildi ✅";
            btn.style.backgroundColor = "#27ae60";
            btn.disabled = true;
        }

        setTimeout(() => {
            alert("Teşekkürler! Mesajınız başarıyla iletildi. En kısa sürede " + email + " adresine dönüş yapacağız.");
            fbForm.reset();
            btn.textContent = "Gönder";
            btn.style.backgroundColor = "#547A95";
            btn.disabled = false;
        }, 500);
    });
}