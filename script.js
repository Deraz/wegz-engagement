/* ==========================================================
   Youssef & Ganna — Engagement invitation
   Edit everything in the INVITE object below.
   ========================================================== */

const INVITE = {
  coupleEn: "Youssef & Ganna",
  coupleAr: "يوسف و جنة",
  start: "2026-09-24T19:00:00",   // 24 September 2026, 7:00 PM
  end: "2026-09-24T23:00:00",     // ends 11:00 PM
  venue: "Loreal Hall - Al Galaa Club",
  venueAr: "قاعة لوريال - نادي الجلاء",
  address: "",                    // optional area/city, e.g. "New Cairo" (hidden when empty)
  mapsUrl: "https://maps.app.goo.gl/s44aGuM3sf1ryt758",

  // V2: Google Apps Script web-app URL (ends in /exec) that appends wishes
  // to a Google Sheet — see apps-script/Code.gs for the 3-minute setup.
  // Leave "" and the form just logs to the console.
  wishesUrl: "https://script.google.com/macros/s/AKfycbx-yPIVaJyXrlGbcSzlg6k-VbQdBtaR2WUkJ917wE0NmGGb_XsO1jX2hjNb_I2Vg7CC/exec",
};

const start = new Date(INVITE.start);
const end = new Date(INVITE.end);
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* ---------- Preloader: open the envelope, then reveal the page ---------- */
(function () {
  const preloader = document.getElementById("preloader");
  const flap = document.getElementById("env-flap");
  const seal = document.getElementById("env-seal");
  const letter = document.getElementById("env-letter");

  setTimeout(() => {
    flap.classList.add("open");
    seal.classList.add("open");
    letter.classList.add("open");
  }, 900);
  setTimeout(() => preloader.classList.add("hide"), 3000);
  setTimeout(() => preloader.remove(), 3600);
})();

/* ---------- Floating hearts ---------- */
(function () {
  const sky = document.getElementById("sky");
  const HEART =
    '<svg class="heart" viewBox="0 0 32 30"><path d="M16 27S3 18.5 3 10.5C3 6 6.5 3 10 3c2.5 0 4.5 1.5 6 4 1.5-2.5 3.5-4 6-4 3.5 0 7 3 7 7.5C29 18.5 16 27 16 27z"/></svg>';
  for (let i = 0; i < 12; i++) {
    const wrap = document.createElement("div");
    wrap.innerHTML = HEART;
    const el = wrap.firstChild;
    const size = 14 + (i % 4) * 6;
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.left = ((i * 8.7) % 100) + "%";
    el.style.animationDelay = ((i * 0.7) % 8) + "s";
    el.style.animationDuration = (8 + (i % 5)) + "s";
    sky.appendChild(el);
  }
})();

/* ---------- Date texts (hero pill, when card, footer) ---------- */
(function () {
  const pad = (n) => String(n).padStart(2, "0");
  const longDate = `${MONTHS[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()}`;
  const clock = (d) => {
    const h = ((d.getHours() + 11) % 12) + 1;
    const m = d.getMinutes() ? ":" + pad(d.getMinutes()) : ":00";
    return h + m + (d.getHours() < 12 ? " AM" : " PM");
  };

  document.getElementById("hero-date").textContent = longDate;
  document.getElementById("when-dow").textContent = DAYS[start.getDay()];
  document.getElementById("when-date").textContent = longDate;
  document.getElementById("when-time").textContent = `From ${clock(start)} till ${clock(end)}`;
  document.getElementById("footer-date").textContent =
    `${pad(start.getDate())} · ${pad(start.getMonth() + 1)} · ${start.getFullYear()}`;

  document.getElementById("venue-name").textContent = INVITE.venue;
  document.getElementById("venue-name-ar").textContent = INVITE.venueAr;
  document.getElementById("venue-address").textContent = INVITE.address;
  document.getElementById("maps-link").href = INVITE.mapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(INVITE.venue);
})();

/* ---------- Calendar for the event's month ---------- */
(function () {
  const cal = document.getElementById("month");
  const y = start.getFullYear();
  const m = start.getMonth();
  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  let html = `<div class="month-title">${MONTHS[m]} ${y}</div><div class="month-grid">`;
  for (const wd of ["S", "M", "T", "W", "T", "F", "S"]) html += `<div class="month-wd">${wd}</div>`;
  for (let i = 0; i < firstDow; i++) html += '<div class="month-day"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const cls = d === start.getDate() ? "month-day the-day" : "month-day";
    html += `<div class="${cls}"><span>${d}</span></div>`;
  }
  html += "</div>";
  cal.innerHTML = html;
})();

/* ---------- Countdown ---------- */
(function () {
  const node = document.getElementById("ticker");
  const target = start.getTime();

  function tick() {
    const diff = Math.max(0, target - Date.now());
    const cells = [
      { v: Math.floor(diff / 86400000), l: "days" },
      { v: Math.floor((diff / 3600000) % 24), l: "hours" },
      { v: Math.floor((diff / 60000) % 60), l: "minutes" },
      { v: Math.floor((diff / 1000) % 60), l: "seconds" },
    ];
    node.innerHTML = cells
      .map((c) => `<div class="tick-box"><div class="tick-num">${String(c.v).padStart(2, "0")}</div><div class="tick-lbl">${c.l}</div></div>`)
      .join("");
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- Toast ---------- */
function showToast(message) {
  const t = document.getElementById("toast");
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove("show"), 3500);
}

/* ---------- Message form ----------
   Wishes go to a Google Sheet when INVITE.wishesUrl is set
   (Apps Script web app — see apps-script/Code.gs). Until then,
   submissions only log to the console. */
(function () {
  const form = document.getElementById("note-form");
  const button = form.querySelector("button[type=submit]");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("note-name").value.trim();
    const message = document.getElementById("note-text").value.trim();
    if (!message) return;

    const wish = { name, message, at: new Date().toISOString() };
    console.log("RSVP message:", wish);

    if (INVITE.wishesUrl) {
      // no-cors + text/plain keeps this a "simple request" so the browser
      // sends it without a preflight (Apps Script doesn't answer preflights).
      // The response is opaque, so we toast optimistically.
      button.disabled = true;
      fetch(INVITE.wishesUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(wish),
      }).catch((err) => console.error("Wish delivery failed:", err))
        .finally(() => { button.disabled = false; });
    }

    showToast("Thank you for the sweet words! 💕");
    form.reset();
  });
})();

/* ---------- Background music ---------- */
(function () {
  const music = document.getElementById("tune");
  const btn = document.getElementById("tune-toggle");
  if (!music || !btn) return;

  const playIcon = btn.querySelector(".ico-play");
  const pauseIcon = btn.querySelector(".ico-pause");

  function setPlaying(isPlaying) {
    btn.classList.toggle("playing", isPlaying);
    playIcon.style.display = isPlaying ? "none" : "block";
    pauseIcon.style.display = isPlaying ? "block" : "none";
  }

  function tryPlay() {
    if (!music.paused) return;
    const p = music.play();
    if (p) p.then(() => { setPlaying(true); removeGestureListeners(); }).catch(() => {
      /* autoplay blocked — keep waiting for a real tap */
    });
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (music.paused) tryPlay();
    else { music.pause(); setPlaying(false); }
  });

  // Browsers block autoplay: start on the guest's first interaction instead.
  const gestures = ["click", "touchstart", "touchend", "pointerdown", "keydown"];
  const onGesture = () => tryPlay();
  function removeGestureListeners() {
    gestures.forEach((evt) => document.removeEventListener(evt, onGesture));
  }
  gestures.forEach((evt) => document.addEventListener(evt, onGesture, { passive: true }));
})();
