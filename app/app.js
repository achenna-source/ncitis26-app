/* NCITIS’26 app: single-page, hash-routed, works offline once installed. */
(function () {
  "use strict";

  // ------------------------------------------------------------------ data
  var APP_URL = "https://conferences.univ-batna2.dz/ncitis26/app/";
  var CMT_URL = "https://cmt3.research.microsoft.com/User/Login?ReturnUrl=%2FNCITIS2026%2F";
  var EMAIL = "ncitis26@univ-batna2.dz";
  var SITE = "../index.html";
  var A = "../assets/";
  var FILES = {
    cfp: A + "NCITIS26-call-for-papers.pdf",
    template: A + "NCITIS26-extended-abstract-template.zip",
    preview: A + "NCITIS26-template-preview.pdf",
    form: A + "NCITIS26-registration-form.docx"
  };
  var MAP_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Faculté des Mathématiques et d'Informatique, Université de Batna 2, Batna, Algérie");

  var TRACKS = [
    {
      title: "Artificial Intelligence and Big Data",
      short: "AI methods, generative AI and big data analytics.",
      text: "Advanced AI methodologies, including machine learning, deep learning, generative AI and data-driven insights across industries, together with frameworks, algorithms and systems for big data analytics and intelligent systems.",
      topics: ["Machine learning and deep learning", "Generative AI and data-driven insights", "Big data analytics and intelligent systems"],
      icon: '<rect x="6" y="6" width="12" height="12" rx="2.5"/><path d="M9.5 9.5h5v5h-5zM9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>'
    },
    {
      title: "Human-Centric and Emerging Technologies",
      short: "Sustainable IT, UX and responsible technologies.",
      text: "Sustainable IT solutions, user experience design and emerging technologies with a social impact, along with the ethical concerns that are crucial for advancing responsible technologies.",
      topics: ["Sustainable IT and user experience", "Emerging technologies and social impact", "Ethical and responsible technologies"],
      icon: '<circle cx="9" cy="6.5" r="3"/><path d="M3.5 20v-1.5A5.5 5.5 0 0 1 9 13a5.4 5.4 0 0 1 3 .9"/><path d="M14 20c0-4 2.5-6.5 7-7-.3 4.3-2.6 7-7 7z"/><path d="M14 20l3.5-3.5"/>'
    },
    {
      title: "Security Strategies for IoT, Cloud and Edge Computing",
      short: "Cryptography, secure protocols, threat detection.",
      text: "Innovative strategies, methodologies and solutions for security in interconnected and distributed environments, aiming to secure modern infrastructures and enable secure real-time data processing.",
      topics: ["Cryptography and data integrity", "Secure communication protocols", "Cyber-threat detection and mitigation"],
      icon: '<path d="M12 2.8l7.5 3v5.6c0 4.6-3.1 8.6-7.5 9.8-4.4-1.2-7.5-5.2-7.5-9.8V5.8z"/><rect x="9" y="10.5" width="6" height="5" rx="1"/><path d="M10.3 10.5V9a1.7 1.7 0 0 1 3.4 0v1.5"/>'
    },
    {
      title: "Distributed Systems and Blockchain",
      short: "Reliability, scalability and blockchain applications.",
      text: "Advances in distributed computing and blockchain technologies, with an emphasis on reliability, scalability and innovative applications in healthcare, supply chain and other domains. Use cases and theoretical advances are highly encouraged.",
      topics: ["Reliability and scalability", "Blockchain applications and innovation"],
      icon: '<rect x="2.8" y="3" width="7" height="7" rx="1.5"/><rect x="14.2" y="3" width="7" height="7" rx="1.5"/><rect x="8.5" y="14" width="7" height="7" rx="1.5"/><path d="M9.8 6.5h4.4M6.3 10v2.5a1.5 1.5 0 0 0 1.5 1.5h.7M17.7 10v2.5a1.5 1.5 0 0 1-1.5 1.5h-.7"/>'
    }
  ];

  var DATES = [
    { key: "abstract", label: "Abstract submission deadline", when: "25 November 2026", short: "25 Nov.", end: "2026-11-25T23:59:59+01:00", ics: ["20261125", "20261126"], icon: "upload" },
    { key: "notif", label: "Author notification", when: "01 December 2026", short: "01 Dec.", end: "2026-12-01T23:59:59+01:00", ics: ["20261201", "20261202"], icon: "mail" },
    { key: "reg", label: "Author registration deadline", when: "02–03 December 2026", short: "02–03 Dec.", end: "2026-12-03T23:59:59+01:00", ics: ["20261202", "20261204"], icon: "check" },
    { key: "conf", label: "Conference days, University of Batna 2", when: "13–14 December 2026", short: "13–14 Dec.", start: "2026-12-13T08:00:00+01:00", end: "2026-12-14T23:59:59+01:00", ics: ["20261213", "20261215"], icon: "cal" }
  ];

  var ICONS = {
    upload: '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M4 15v3.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V15"/>',
    download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M4 16v2.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V16"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
    check: '<path d="M15 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M9 13.5l2.2 2.2L15.5 11"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    calplus: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    leaf: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19l7-7"/>',
    users: '<circle cx="9" cy="7.5" r="3"/><path d="M3.5 20v-1A5.5 5.5 0 0 1 9 13.5a5.5 5.5 0 0 1 5.5 5.5v1"/><circle cx="17" cy="8.5" r="2.4"/><path d="M16.5 13.6A4.5 4.5 0 0 1 21 18v1"/>',
    ticket: '<path d="M3 8.5V6a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 6v2.5a2.5 2.5 0 0 0 0 5V16a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16v-2.5a2.5 2.5 0 0 0 0-5z"/><path d="M14 4.5v13" stroke-dasharray="2 2.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.8 3.9 5.8 3.9 9s-1.3 6.2-3.9 9c-2.6-2.8-3.9-5.8-3.9-9S9.4 5.8 12 3z"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
    arrow: '<path d="M7 17L17 7M9 7h8v8"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    menu: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/>'
  };
  function ico(name, cls) { return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : "") + ">" + ICONS[name] + "</svg>"; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ext(href, label, cls, icon) { return '<a class="' + cls + '" href="' + href + '" target="_blank" rel="noopener">' + (icon ? ico(icon) : "") + label + "</a>"; }

  // ------------------------------------------------------------------ helpers
  var isLocal = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var deferredPrompt = null;
  var timer = null;

  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  function nextMilestone(now) {
    for (var i = 0; i < DATES.length; i++) {
      var d = DATES[i];
      if (d.key === "conf") {
        if (now < new Date(d.start)) return { d: d, target: new Date(d.start), text: "Conference opens in" };
        if (now <= new Date(d.end)) return { d: d, live: true };
        return null;
      }
      if (now <= new Date(d.end)) return { d: d, target: new Date(d.end), text: d.label + " in" };
    }
    return null;
  }

  function countdownHTML() {
    var now = new Date(), m = nextMilestone(now);
    if (!m) return '<div class="countdown"><div class="label"><span class="dot"></span><span>Thank you for joining <b>NCITIS’26</b>. See you next edition!</span></div></div>';
    if (m.live) return '<div class="countdown"><div class="label"><span class="dot"></span><span><b>NCITIS’26 is happening now</b> at the University of Batna 2.</span></div></div>';
    var ms = m.target - now, d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), mn = Math.floor(ms % 36e5 / 6e4);
    return '<div class="countdown" aria-live="off"><div class="label"><span class="dot"></span><span>' + esc(m.text) + " · <b>" + esc(m.d.when) + "</b></span></div>" +
      '<div class="cd-tiles"><div><b>' + d + "</b><span>days</span></div><div><b>" + h + "</b><span>hours</span></div><div><b>" + mn + "</b><span>min</span></div></div></div>";
  }

  function dateState(d, now, nextKey) {
    var end = new Date(d.end);
    if (d.key === "conf" && now >= new Date(d.start) && now <= end) return { cls: "next", label: "Live now" };
    if (now > end) return { cls: "done", label: "Passed" };
    if (d.key === nextKey) return { cls: "next", label: "Next" };
    return { cls: "", label: "Upcoming" };
  }

  function icsFile(all) {
    var list = all ? DATES : [DATES[3]];
    var stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//NCITIS26//Conference App//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
    list.forEach(function (d) {
      var title = d.key === "conf" ? "NCITIS'26 conference, University of Batna 2" : "NCITIS'26: " + d.label;
      lines.push("BEGIN:VEVENT", "UID:ncitis26-" + d.key + "@univ-batna2.dz", "DTSTAMP:" + stamp,
        "DTSTART;VALUE=DATE:" + d.ics[0], "DTEND;VALUE=DATE:" + d.ics[1], "SUMMARY:" + title,
        "LOCATION:Faculty of Mathematics and Informatics\\, University of Batna 2\\, Batna\\, Algeria",
        "DESCRIPTION:Second National Conference on Information Technology and Intelligent Systems. " + APP_URL,
        "URL:" + APP_URL, "END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    var blob = new Blob([lines.join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = all ? "NCITIS26-key-dates.ics" : "NCITIS26-conference.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    toast("Calendar file downloaded: open it to add the dates");
  }

  function share() {
    var data = { title: "NCITIS’26", text: "NCITIS’26, Second National Conference on Information Technology and Intelligent Systems, 13–14 December 2026, University of Batna 2. Get the app:", url: APP_URL };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    var done = function () { toast("Link copied: " + APP_URL); };
    if (navigator.clipboard) navigator.clipboard.writeText(APP_URL).then(done, function () { toast(APP_URL); });
    else toast(APP_URL);
  }

  function openOverleaf() {
    if (isLocal) {
      var a = document.createElement("a");
      a.href = FILES.template; a.download = "NCITIS26-extended-abstract-template.zip";
      document.body.appendChild(a); a.click(); a.remove();
      window.open("https://www.overleaf.com/project", "_blank", "noopener");
      toast("Template downloaded. In Overleaf: New project, then Upload project");
      return;
    }
    document.getElementById("snip-uri").value = new URL(FILES.template, location.href).href;
    document.getElementById("overleaf-form").submit();
  }

  // ------------------------------------------------------------------ sheet
  var lastFocus = null;
  function openSheet(title, bodyHTML) {
    lastFocus = document.activeElement;
    document.getElementById("sheet-title").textContent = title;
    document.getElementById("sheet-body").innerHTML = bodyHTML;
    document.getElementById("sheet").hidden = false;
    document.getElementById("sheet-backdrop").hidden = false;
    document.getElementById("sheet-close").focus();
  }
  function closeSheet() {
    document.getElementById("sheet").hidden = true;
    document.getElementById("sheet-backdrop").hidden = true;
    if (lastFocus) lastFocus.focus();
  }

  function install() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () { deferredPrompt = null; refreshInstall(); });
      return;
    }
    if (isIOS) {
      openSheet("Install on iPhone", '<p class="muted">Add NCITIS’26 to your home screen in three taps, in Safari:</p><ol><li>Tap the <b>Share</b> button ' + ico("upload", "ico") + ' at the bottom of Safari.</li><li>Scroll and tap <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>. The NCITIS’26 icon appears on your home screen.</li></ol>');
      return;
    }
    openSheet("Install the app", '<p class="muted">Open your browser menu and choose:</p><ol><li><b>Install app</b> or <b>Add to Home screen</b> (Chrome, Edge, Samsung Internet).</li><li>Confirm. The NCITIS’26 icon appears with your other apps and works offline.</li></ol>');
  }

  function installBanner() {
    if (isStandalone) return "";
    return '<div class="install" id="install-banner"><img src="icons/icon-192.png" alt=""><p><b>Get the NCITIS’26 app</b>Works offline, one tap from your home screen.</p><button class="btn btn-navy" type="button" data-act="install">Install</button></div>';
  }
  function refreshInstall() { /* banner stays available; on iOS and other browsers it opens instructions */ }

  // ------------------------------------------------------------------ views
  function trackCard(t, i, inList) {
    return '<a class="track-card' + (i % 2 ? " even" : "") + '" href="#/tracks/' + (i + 1) + '"><span class="track-num" aria-hidden="true">0' + (i + 1) + '</span><span class="track-icon">' + '<svg viewBox="0 0 24 24" aria-hidden="true">' + t.icon + '</svg></span><span class="eyebrow">Track ' + (i + 1) + "</span><h3>" + esc(t.title) + "</h3><p>" + esc(inList ? t.text : t.short) + '</p><span class="track-go">Explore track ' + ico("chev") + "</span></a>";
  }

  function timelineHTML() {
    var now = new Date(), m = nextMilestone(now), nextKey = m && m.d ? m.d.key : null;
    return '<ol class="timeline">' + DATES.map(function (d) {
      var s = dateState(d, now, nextKey);
      return '<li class="tl ' + s.cls + (d.key === "conf" ? " conf" : "") + '"><span class="tl-mark">' + ico(d.icon) + '</span><div><div class="tl-when">' + esc(d.when) + '</div><div class="tl-what">' + esc(d.label) + '</div><span class="state">' + s.label + "</span></div></li>";
    }).join("") + "</ol>";
  }

  var NET = '<svg class="hero-net" viewBox="0 0 240 240" aria-hidden="true"><line x1="40" y1="60" x2="120" y2="30"/><line class="g" x1="120" y1="30" x2="200" y2="70"/><line x1="200" y1="70" x2="215" y2="150"/><line x1="40" y1="60" x2="70" y2="140"/><line class="g" x1="70" y1="140" x2="150" y2="200"/><line x1="150" y1="200" x2="215" y2="150"/><line x1="120" y1="30" x2="70" y2="140"/><circle cx="40" cy="60" r="4"/><circle class="g" cx="120" cy="30" r="5"/><circle cx="200" cy="70" r="4"/><circle class="g" cx="215" cy="150" r="4"/><circle cx="70" cy="140" r="5"/><circle class="g" cx="150" cy="200" r="5"/></svg>';

  var views = {
    home: function () {
      return '<section class="hero">' + NET +
        '<div class="hero-logos"><img src="../assets/logo-univ-batna2.png" alt="University of Batna 2"><img src="../assets/logo-faculte-mi.png" alt="Faculty of Mathematics and Informatics"></div>' +
        '<div class="kicker">Call for papers · 2nd edition</div>' +
        '<div class="acronym" aria-hidden="true">NCITIS <span>’26</span></div>' +
        '<h1 id="title" tabindex="-1">The Second National Conference on Information Technology and Intelligent Systems</h1>' +
        '<div class="meta-row"><span class="meta-chip">' + ico("cal") + "13–14 Dec. 2026</span><span class=\"meta-chip\">" + ico("pin") + "Univ. Batna 2, Algeria</span></div>" +
        '<div id="countdown">' + countdownHTML() + "</div>" +
        '<div class="btn-row">' + ext(CMT_URL, "Submit", "btn btn-gold", "upload") + '<a class="btn btn-ghost" href="#/submit">' + ico("doc") + "Template</a></div></section>" +
        installBanner() +
        '<div class="section-h"><h2>Conference tracks</h2><a href="#/tracks">See all</a></div>' +
        '<div class="carousel">' + TRACKS.map(function (t, i) { return trackCard(t, i, false); }).join("") + "</div>" +
        '<div class="section-h"><h2>Key dates</h2><a href="#/dates">Details</a></div>' +
        '<div class="card pad">' + timelineHTML() + "</div>" +
        '<div class="section-h"><h2>Quick access</h2></div>' +
        '<div class="quick">' +
        '<a href="' + FILES.cfp + '" target="_blank" rel="noopener"><span class="mi">' + ico("doc") + "</span>Call for papers</a>" +
        '<a href="#/register"><span class="mi g">' + ico("ticket") + "</span>Registration</a>" +
        '<a href="#/committees"><span class="mi">' + ico("users") + "</span>Committees</a>" +
        '<a href="#/contact"><span class="mi g">' + ico("pin") + "</span>Venue &amp; contact</a>" +
        '<button type="button" data-act="ics-all"><span class="mi">' + ico("calplus") + "</span>Add dates to calendar</button>" +
        '<button type="button" data-act="share"><span class="mi g">' + ico("share") + "</span>Share the app</button>" +
        "</div>" +
        '<div class="section-h"><h2>About</h2><a href="#/about">More</a></div>' +
        '<div class="card pad"><p style="margin:0">NCITIS’26 brings together researchers, academics and industry specialists to exchange ideas and foster collaboration on advances in computer science, IT, intelligent systems and AI. It is organized by the Faculty of Mathematics and Informatics, University of Batna 2, with the <b>LASTIC</b> and <b>LAMIE</b> laboratories.</p></div>' +
        '<p class="app-foot">NCITIS’26 · University of Batna 2</p>';
    },

    tracks: function () {
      return '<span class="eyebrow">Main topics</span><h1 class="page-title" id="title" tabindex="-1">Four conference tracks</h1><p class="page-lead">Contributions are invited on, but not limited to, the following tracks.</p>' +
        '<div class="track-list">' + TRACKS.map(function (t, i) { return trackCard(t, i, true); }).join("") + "</div>";
    },

    track: function (n) {
      var i = Math.max(0, Math.min(TRACKS.length - 1, (parseInt(n, 10) || 1) - 1)), t = TRACKS[i];
      return '<section class="track-hero' + (i % 2 ? " even" : "") + '"><span class="track-icon"><svg viewBox="0 0 24 24" aria-hidden="true">' + t.icon + '</svg></span><span class="eyebrow">Track ' + (i + 1) + ' of 4</span><h1 id="title" tabindex="-1">' + esc(t.title) + "</h1></section>" +
        '<div class="card pad" style="margin-top:14px"><p style="margin:0 0 14px">' + esc(t.text) + '</p><h2 style="font-size:20px;margin-bottom:10px">Topics</h2><ul class="chips' + (i % 2 ? " gold" : "") + '">' + t.topics.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="btn-row" style="margin-top:14px"><a class="btn btn-navy" href="#/submit">' + ico("upload") + 'Submit</a><a class="btn btn-line" href="#/tracks/' + ((i + 1) % TRACKS.length + 1) + '">Next track ' + ico("chev") + "</a></div>";
    },

    dates: function () {
      return '<span class="eyebrow">Important dates</span><h1 class="page-title" id="title" tabindex="-1">Key deadlines</h1><p class="page-lead">Times are given for Algeria (UTC+1).</p>' +
        '<div class="card pad">' + timelineHTML() + "</div>" +
        '<div class="btn-row" style="margin-top:14px"><button class="btn btn-navy" type="button" data-act="ics-all">' + ico("calplus") + 'All dates</button><button class="btn btn-line" type="button" data-act="ics-conf">' + ico("cal") + "Conference</button></div>" +
        '<p class="note">Adds the dates to your phone calendar (.ics file).</p>';
    },

    submit: function () {
      return '<span class="eyebrow">Submission</span><h1 class="page-title" id="title" tabindex="-1">Submit a short paper</h1><p class="page-lead">Short papers take the form of a 2-page extended abstract (about 800–1,200 words), written with the official NCITIS’26 template and submitted through Microsoft CMT.</p>' +
        '<ol class="steps">' +
        '<li><div><b>Choose a track</b><p>Check that your work fits one of the four conference tracks.</p><a class="btn btn-line" href="#/tracks">' + ico("menu") + "View the tracks</a></div></li>" +
        '<li><div><b>Use the template</b><p>Write your 2-page extended abstract with the official LaTeX template, keeping its layout. The bibliography is compiled with biber.</p>' +
        '<div class="btn-row" style="margin-top:10px"><button class="btn btn-navy" type="button" data-act="overleaf">' + ico("leaf") + "Overleaf</button>" +
        '<a class="btn btn-line" href="' + FILES.template + '" download>' + ico("download") + ".zip</a></div>" +
        '<a class="btn btn-line btn-block" style="margin-top:10px" href="' + FILES.preview + '" target="_blank" rel="noopener">' + ico("doc") + "Preview the template (PDF)</a>" +
        (isLocal ? '<p class="note">Local copy: “Overleaf” downloads the .zip and opens Overleaf, where you choose New project, then Upload project.</p>' : '<p class="note">“Overleaf” creates your own copy of the template in your Overleaf account.</p>') + "</div></li>" +
        '<li><div><b>Submit on Microsoft CMT</b><p>Sign in to Microsoft CMT (or create a free account) and upload your paper before 25 November 2026.</p>' + ext(CMT_URL, "Go to the submission page", "btn btn-gold btn-block", "upload") + "</div></li>" +
        '<li><div><b>Register</b><p>After acceptance (01 December), register by 02–03 December 2026.</p><a class="btn btn-line" href="#/register">' + ico("ticket") + "Registration</a></div></li>" +
        "</ol>";
    },

    register: function () {
      return '<span class="eyebrow">Registration</span><h1 class="page-title" id="title" tabindex="-1">Registration fees</h1><p class="page-lead">At least one author of each accepted paper must register before the registration deadline (02–03 December 2026).</p>' +
        '<div class="card" style="overflow:hidden"><table class="fees"><caption class="sr-only" style="position:absolute;left:-9999px">Fees in Algerian dinars</caption><thead><tr><th scope="col">Fees (DA)</th><th scope="col">In person</th><th scope="col">Online<sup>*</sup></th></tr></thead><tbody>' +
        '<tr><th scope="row">Academic</th><td class="amt">10,000</td><td class="amt">7,000</td></tr>' +
        '<tr><th scope="row">PhD student</th><td class="amt">8,000</td><td class="amt">5,000</td></tr>' +
        '<tr><th scope="row">Industrial</th><td class="amt">12,000</td><td class="muted">n/a</td></tr>' +
        '<tr><th scope="row">Second paper<sup>*</sup></th><td class="amt">4,000</td><td class="amt">3,000</td></tr>' +
        '</tbody></table></div><p class="note"><sup style="color:#b9831a">*</sup> Online and second-paper rates are taken from the NCITIS’25 registration form and remain to be confirmed for this edition.</p>' +
        '<div class="card pad" style="margin-top:14px"><h2 style="font-size:21px;margin-bottom:10px">Registration includes</h2><ul class="check"><li>Access to all conference sessions</li><li>Conference proceedings</li><li>Coffee breaks and lunches on all conference days</li></ul></div>' +
        '<div class="card pad" style="margin-top:14px"><h2 style="font-size:21px;margin-bottom:8px">How to register</h2><p class="muted" style="margin:0 0 12px;font-size:14.5px">Fill in the registration form and send it with your payment receipt to <a href="mailto:' + EMAIL + '">' + EMAIL + "</a>.</p>" +
        '<a class="btn btn-navy btn-block" href="' + FILES.form + '" download>' + ico("download") + "Registration form (.docx)</a></div>" +
        '<div class="card pad bank" style="margin-top:14px"><h2>Bank transfer <span class="tbc">to confirm</span></h2><dl><dt>Beneficiary</dt><dd>Algerian Society of Engineering and Technology (ASET)</dd><dt>Bank</dt><dd>BADR Bank, agency 344, Batna</dd><dt>IBAN (RIB)</dt><dd class="mono">00300344000276720017</dd><dt>SWIFT/BIC</dt><dd class="mono">BADRDZALXXX</dd></dl></div>';
    },

    committees: function () {
      return '<span class="eyebrow">People</span><h1 class="page-title" id="title" tabindex="-1">Committees</h1>' +
        '<div class="card" style="margin-bottom:16px">' +
        person("HS", "Hacene SMADI", "Honorary chair · Rector of the University of Batna 2", true) +
        person("HM", "Hamouma MOUMEN", "Honorary chair · Dean of the Faculty of Mathematics and Informatics", true) +
        person("BB", "Dr. Badreddine BENREGUIA", "Conference chair · University of Batna 2") +
        person("BM", "Prof. Bilal MOKHTARI", "Scientific committee chair · University of Batna 2") +
        person("AB", "Dr. Abderrazak BENYAHIA", "Organizing committee chair · University of Batna 2") + "</div>" +
        '<div class="seg" role="tablist" aria-label="Committee"><button type="button" role="tab" aria-selected="true" data-com="scientific">Scientific</button><button type="button" role="tab" aria-selected="false" data-com="organizing">Organizing</button></div>' +
        '<label class="search"><span style="position:absolute;left:-9999px">Search a member</span>' + ico("search") + '<input type="search" id="com-search" placeholder="Search a member" autocomplete="off"></label>' +
        '<p class="count" id="com-count"></p><div class="card" id="com-list"></div>';
    },

    contact: function () {
      return '<span class="eyebrow">Information</span><h1 class="page-title" id="title" tabindex="-1">Venue &amp; contact</h1>' +
        '<ul class="card menu">' +
        '<li><a href="mailto:' + EMAIL + '"><span class="mi">' + ico("mail") + "</span><span><b>Email</b><small>" + EMAIL + "</small></span></a></li>" +
        '<li><a href="' + SITE + '"><span class="mi g">' + ico("globe") + "</span><span><b>Conference website</b><small>conferences.univ-batna2.dz/ncitis26</small></span>" + ico("chev", "chev") + "</a></li>" +
        '<li><a href="' + MAP_URL + '" target="_blank" rel="noopener"><span class="mi">' + ico("pin") + "</span><span><b>Venue</b><small>Department of Computer Science, Faculty of Mathematics and Informatics, University of Batna 2 Chahid Mostefa Benboulaïd, Batna, Algeria</small></span>" + ico("arrow", "chev") + "</a></li>" +
        '<li><button type="button" data-act="ics-conf"><span class="mi g">' + ico("calplus") + "</span><span><b>13–14 December 2026</b><small>Add the conference to your calendar</small></span></button></li>" +
        "</ul>" +
        '<p class="ack"><b>CMT acknowledgment.</b> The Microsoft CMT service was used for managing the peer-reviewing process for this conference. This service was provided for free by Microsoft and they bore all expenses, including costs for Azure cloud services as well as for software development and support.</p>';
    },

    about: function () {
      return '<span class="eyebrow">About</span><h1 class="page-title" id="title" tabindex="-1">NCITIS’26</h1>' +
        '<div class="card pad"><p style="margin:0 0 12px">NCITIS’26 is organized by the Faculty of Mathematics and Informatics at the University of Batna 2, Algeria, in collaboration with two research laboratories of the University.</p><p style="margin:0">The conference aims to create a forum for researchers, faculty members and industry specialists to share insights, exchange ideas and build foundations for collaboration on recent advances and evolving trends in computer science, information technology, intelligent systems and artificial intelligence.</p></div>' +
        '<div class="labs" style="margin-top:14px"><div class="card lab"><span class="tag">LASTIC</span><p>Laboratoire des Systèmes et Technologies de l’Information et de la Communication</p></div><div class="card lab"><span class="tag g">LAMIE</span><p>Laboratoire d’Applications des Mathématiques à l’Informatique et à l’Électronique</p></div></div>' +
        '<a class="btn btn-navy btn-block" style="margin-top:14px" href="' + FILES.cfp + '" target="_blank" rel="noopener">' + ico("doc") + "Call for papers (PDF)</a>";
    },

    more: function () {
      function row(href, icon, gold, title, sub, extAttr) {
        return '<li><a href="' + href + '"' + (extAttr || "") + '><span class="mi' + (gold ? " g" : "") + '">' + ico(icon) + "</span><span><b>" + title + "</b><small>" + sub + "</small></span>" + ico("chev", "chev") + "</a></li>";
      }
      function btn(act, icon, gold, title, sub) {
        return '<li><button type="button" data-act="' + act + '"><span class="mi' + (gold ? " g" : "") + '">' + ico(icon) + "</span><span><b>" + title + "</b><small>" + sub + "</small></span></button></li>";
      }
      return '<span class="eyebrow">Menu</span><h1 class="page-title" id="title" tabindex="-1">More</h1>' +
        '<ul class="card menu">' +
        row("#/register", "ticket", true, "Registration", "Fees, form and bank transfer") +
        row("#/committees", "users", false, "Committees", "Chairs, scientific and organizing committees") +
        row("#/contact", "pin", true, "Venue &amp; contact", "Email, website, map") +
        row("#/about", "info", false, "About NCITIS’26", "Objectives and laboratories") +
        row(FILES.cfp, "doc", true, "Call for papers", "PDF", ' target="_blank" rel="noopener"') +
        "</ul>" +
        '<ul class="card menu" style="margin-top:14px">' +
        (isStandalone ? "" : btn("install", "phone", false, "Install the app", "Add NCITIS’26 to your home screen")) +
        btn("share", "share", true, "Share the app", "Invite colleagues and students") +
        btn("ics-all", "calplus", false, "Add key dates to calendar", "Deadlines and conference days") +
        "</ul>" +
        '<p class="app-foot">NCITIS’26 app · Faculty of Mathematics and Informatics, University of Batna 2</p>';
    }
  };

  function person(initials, name, sub, gold) {
    return '<div class="person"><span class="avatar' + (gold ? " g" : "") + '">' + initials + "</span><div><b>" + esc(name) + "</b><small>" + esc(sub) + "</small></div></div>";
  }

  // committees list behaviour
  function bindCommittees() {
    var C = window.NCITIS_COMMITTEES, which = "scientific";
    var list = document.getElementById("com-list"), input = document.getElementById("com-search"), count = document.getElementById("com-count");
    function norm(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
    function draw() {
      var q = norm(input.value.trim()), c = C[which], ch = c.chair;
      var rows = c.members.filter(function (m) { return !q || norm(m.join(" ")).indexOf(q) !== -1; });
      var chairOk = !q || norm(ch.join(" ")).indexOf(q) !== -1;
      count.textContent = (c.members.length + 1) + " members" + (q ? " · " + (rows.length + (chairOk ? 1 : 0)) + " found" : "");
      var html = chairOk ? person(ch[1][0] + ch[2][0], ch[0] + " " + ch[1] + " " + ch[2], "Chair · " + ch[3], true) : "";
      html += rows.map(function (m) {
        var ext = m[2] !== "Univ. Batna 2";
        return '<div class="person' + (ext ? " ext" : "") + '"><span class="avatar">' + esc(m[0][0] + m[1][0]) + "</span><div><b>" + esc(m[0]) + " " + esc(m[1]) + "</b><small>" + esc(m[2]) + "</small></div></div>";
      }).join("");
      list.innerHTML = html || '<p class="pad muted" style="margin:0">No member matches this search.</p>';
    }
    document.querySelectorAll(".seg button").forEach(function (b) {
      b.addEventListener("click", function () {
        which = b.getAttribute("data-com");
        document.querySelectorAll(".seg button").forEach(function (x) { x.setAttribute("aria-selected", x === b); });
        draw();
      });
    });
    input.addEventListener("input", draw);
    draw();
  }

  // ------------------------------------------------------------------ router
  var TAB_OF = { home: "home", tracks: "tracks", track: "tracks", dates: "dates", submit: "submit", more: "more", register: "more", committees: "more", contact: "more", about: "more" };
  var TITLES = { home: "NCITIS’26", tracks: "Tracks", track: "Track", dates: "Key dates", submit: "Submit", more: "More", register: "Registration", committees: "Committees", contact: "Venue & contact", about: "About" };

  function parse() {
    var parts = (location.hash || "#/home").replace(/^#\/?/, "").split("/");
    var name = parts[0] || "home";
    if (name === "tracks" && parts[1]) return { name: "track", arg: parts[1] };
    if (!views[name]) name = "home";
    return { name: name, arg: parts[1] };
  }

  function render(first) {
    var r = parse(), main = document.getElementById("view");
    var swap = function () {
      main.innerHTML = views[r.name](r.arg);
      if (!reduced) { main.classList.remove("view-anim"); void main.offsetWidth; main.classList.add("view-anim"); }
      document.title = r.name === "home" ? "NCITIS’26 App" : TITLES[r.name] + " · NCITIS’26";
      document.querySelectorAll(".tabbar a").forEach(function (a) {
        if (a.getAttribute("data-tab") === TAB_OF[r.name]) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
      document.getElementById("back-btn").hidden = !(r.name === "track" || TAB_OF[r.name] === "more" && r.name !== "more");
      if (r.name === "committees") bindCommittees();
      window.scrollTo(0, 0);
      if (!first) { var h = document.getElementById("title"); if (h) h.focus({ preventScroll: true }); }
      clearInterval(timer);
      if (r.name === "home") timer = setInterval(function () { var c = document.getElementById("countdown"); if (c) c.innerHTML = countdownHTML(); }, 30000);
    };
    swap();
  }

  // ------------------------------------------------------------------ events
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var act = b.getAttribute("data-act");
    if (act === "share") share();
    else if (act === "install") install();
    else if (act === "ics-all") icsFile(true);
    else if (act === "ics-conf") icsFile(false);
    else if (act === "overleaf") openOverleaf();
  });
  document.getElementById("share-btn").addEventListener("click", share);
  document.getElementById("back-btn").addEventListener("click", function () {
    var r = parse();
    location.hash = r.name === "track" ? "#/tracks" : "#/more";
  });
  document.getElementById("sheet-close").addEventListener("click", closeSheet);
  document.getElementById("sheet-backdrop").addEventListener("click", closeSheet);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !document.getElementById("sheet").hidden) closeSheet(); });

  window.addEventListener("hashchange", function () { render(false); });
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferredPrompt = e; });
  window.addEventListener("appinstalled", function () { deferredPrompt = null; toast("NCITIS’26 is installed"); var b = document.getElementById("install-banner"); if (b) b.remove(); });

  function onlineState() { document.getElementById("offline-pill").hidden = navigator.onLine; }
  window.addEventListener("online", onlineState);
  window.addEventListener("offline", onlineState);
  onlineState();

  render(true);

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
