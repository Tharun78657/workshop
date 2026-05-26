// ============================================================
//  Aviz Academy — Workshop Landing Page Script
//  Clean, no AOS. Only: countdown, video, sticky bar, form
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. COUNTDOWN TIMER (next Sunday 10:00 AM) ─────── */
    function getNextSunday10AM() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday
        let daysUntilSunday = (7 - day) % 7;
        if (daysUntilSunday === 0) {
            // today is Sunday — check if before 10 AM
            const target = new Date(now);
            target.setHours(10, 0, 0, 0);
            if (now >= target) daysUntilSunday = 7; // already past, use next Sunday
        }
        const next = new Date(now);
        next.setDate(now.getDate() + daysUntilSunday);
        next.setHours(10, 0, 0, 0);
        return next;
    }

    const elDays  = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMins  = document.getElementById('mins');
    const elSecs  = document.getElementById('secs');

    const elStickyDays  = document.getElementById('sticky-days');
    const elStickyHours = document.getElementById('sticky-hours');
    const elStickyMins  = document.getElementById('sticky-mins');
    const elStickySecs  = document.getElementById('sticky-secs');

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateCountdown() {
        const now  = new Date();
        const end  = getNextSunday10AM();
        let   diff = Math.max(0, Math.floor((end - now) / 1000));

        const d = Math.floor(diff / 86400); diff -= d * 86400;
        const h = Math.floor(diff / 3600);  diff -= h * 3600;
        const m = Math.floor(diff / 60);    diff -= m * 60;
        const s = diff;

        if (elDays)  elDays.textContent  = pad(d);
        if (elHours) elHours.textContent = pad(h);
        if (elMins)  elMins.textContent  = pad(m);
        if (elSecs)  elSecs.textContent  = pad(s);

        if (elStickyDays)  elStickyDays.textContent  = pad(d);
        if (elStickyHours) elStickyHours.textContent = pad(h);
        if (elStickyMins)  elStickyMins.textContent  = pad(m);
        if (elStickySecs)  elStickySecs.textContent  = pad(s);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    /* ── 2. VIDEO PLAYER ───────────────────────────────── */
    const video   = document.getElementById('main-workshop-video');
    const overlay = document.getElementById('video-overlay');

    if (video && overlay) {
        overlay.addEventListener('click', () => {
            overlay.classList.add('hidden');
            video.controls = true;
            video.play().catch(() => {});
        });

        video.addEventListener('pause', () => {
            if (video.ended || video.paused) {
                overlay.classList.remove('hidden');
                video.controls = false;
            }
        });

        video.addEventListener('ended', () => {
            overlay.classList.remove('hidden');
            video.controls = false;
        });
    }


    /* ── 3. NAVBAR SCROLL SHADOW ───────────────────────── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.style.boxShadow = window.scrollY > 40
                ? '0 4px 36px rgba(255,123,0,0.12)'
                : 'none';
        }
    }, { passive: true });


    /* ── 4. MOBILE STICKY BAR — always visible ────────── */
    const stickyBar = document.getElementById('mobile-sticky-bar');
    if (stickyBar) {
        stickyBar.classList.add('visible');
    }


    /* ── 5. REGISTRATION FORM + CONFETTI ───────────────── */
    const form   = document.getElementById('reg-form');
    const canvas = document.getElementById('confetti-canvas');
    let   ctx, confettiParticles = [], animFrame;

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name  = document.getElementById('user-name')?.value.trim();
            const email = document.getElementById('user-email')?.value.trim();
            const phone = document.getElementById('user-phone')?.value.trim();

            if (!name || !email || !phone) return;

            // Show success state inside the ticket
            const zone = document.getElementById('registration-zone');
            if (zone) {
                zone.innerHTML = `
                    <div class="success-state" style="text-align: center;">
                        <div class="success-icon" style="font-size: 3rem; color: #22c55e; margin-bottom: 15px;">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h2>You're Registered! 🎉</h2>
                        <p class="success-desc" style="color: var(--muted); margin-bottom: 20px;">
                            Please complete your registration using the buttons below:
                        </p>
                        <div style="display: flex; flex-direction: column; gap: 15px; align-items: center;">
                            <a href="https://us06web.zoom.us/webinar/register/WN_lEKy8YM0Sq6DA8MrtRq8DQ" target="_blank" class="btn-hero-primary btn-blinking" style="width: 100%; justify-content: center;">
                                <i class="fa-solid fa-video"></i>
                                <span>Step 1: Register on Zoom</span>
                            </a>
                            <a href="https://chat.whatsapp.com/L9NUERJlbsR3c6IxXkZlSG?mode=ems_share_c" target="_blank" class="btn-whatsapp-large whatsapp-pulse" style="width: 100%; justify-content: center;">
                                <i class="fa-brands fa-whatsapp"></i>
                                <span>Step 2: Join WhatsApp</span>
                            </a>
                        </div>
                    </div>
                `;
            }

            const modal = document.getElementById('success-modal');
            if (modal) {
                modal.classList.remove('hidden');
            }

            // Launch confetti
            if (canvas) launchConfetti();
        });
    }

    function launchConfetti() {
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#ff7b00','#ff4500','#f472b6','#a855f7','#22c55e','#0ea5e9','#fbbf24','#fff'];
        confettiParticles = Array.from({ length: 160 }, () => ({
            x:     Math.random() * canvas.width,
            y:     Math.random() * canvas.height - canvas.height,
            w:     Math.random() * 10 + 5,
            h:     Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx:    (Math.random() - 0.5) * 3,
            vy:    Math.random() * 4 + 2,
            rot:   Math.random() * 360,
            rotV:  (Math.random() - 0.5) * 6,
        }));

        cancelAnimationFrame(animFrame);
        drawConfetti();

        setTimeout(() => {
            cancelAnimationFrame(animFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 4500);
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        confettiParticles.forEach(p => {
            p.x   += p.vx;
            p.y   += p.vy;
            p.rot += p.rotV;
            if (p.y < canvas.height + 20) alive = true;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        if (alive) animFrame = requestAnimationFrame(drawConfetti);
    }

    window.addEventListener('resize', () => {
        if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    });

    const closeModalBtn = document.getElementById('close-modal');
    const successModal = document.getElementById('success-modal');
    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.add('hidden');
        });
    }

});
