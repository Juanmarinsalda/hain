/* HAIN: idioma, enlaces y escenas pixel art */
(function () {
  // ===== Tus enlaces: cambialos acá =====
  // Dejá steam en "" mientras la página de Steam no esté lista: el botón queda como "próximamente".
  var LINKS = {
    x: "https://x.com/KotaixStudios",         // ej. https://x.com/tu_usuario
    itch: "https://juanmarinsalda.itch.io/hain",    // ej. https://tu-usuario.itch.io/hain
    steam: ""                    // ej. https://store.steampowered.com/app/XXXXXX/HAIN/
  };

  var root = document.documentElement;

  // ----- Enlaces -----
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var url = LINKS[a.getAttribute("data-link")];
    if (url) {
      a.href = url; a.target = "_blank"; a.rel = "noopener";
    } else {
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      a.setAttribute("role", "link");
      (a.parentElement || a).querySelectorAll(".soon").forEach(function (s) { s.hidden = false; });
    }
  });

  // ----- Idioma -----
  var lang = "es";
  try { lang = localStorage.getItem("hain-lang") || ""; } catch (e) { lang = ""; }
  if (!lang) lang = (navigator.language || "es").slice(0, 2);
  if (lang !== "en") lang = "es";
  function setLang(l) {
    root.setAttribute("data-lang", l);
    root.lang = l;
    document.querySelectorAll("[data-setlang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-setlang") === l));
    });
    try { localStorage.setItem("hain-lang", l); } catch (e) {}
  }
  document.querySelectorAll("[data-setlang]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-setlang")); });
  });
  setLang(lang);

  // ----- Copiar mail -----
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = document.getElementById(btn.getAttribute("data-copy"));
      var msg = document.getElementById(btn.getAttribute("data-msg"));
      var text = el.textContent.trim();
      function selectIt() {
        var r = document.createRange(); r.selectNodeContents(el);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      }
      function show(ok) { if (msg) msg.hidden = !ok; }
      try {
        navigator.clipboard.writeText(text).then(function () { show(true); }, function () { selectIt(); show(false); });
      } catch (e) { selectIt(); show(false); }
    });
  });

  // ===== Capturas, logo e ícono =====
  // Cada recuadro busca su archivo. Si no existe, queda el aviso con el nombre que tiene que tener.
  document.querySelectorAll("[data-img]").forEach(function (box) {
    var src = box.getAttribute("data-img");
    var inner = box.firstElementChild;
    if (inner) {
      var f = document.createElement("span");
      f.className = "fname"; f.textContent = src;
      inner.appendChild(f);
    }
    var img = new Image();
    img.alt = inner ? inner.querySelector("span").textContent : "";
    img.onload = function () {
      box.textContent = "";
      box.classList.add("has-img");
      if (box.hasAttribute("data-full")) {
        var a = document.createElement("a");
        a.href = src; a.target = "_blank"; a.rel = "noopener";
        a.appendChild(img); box.appendChild(a);
      } else {
        box.appendChild(img);
      }
    };
    img.src = src;
  });

  // ===== Tráiler =====
  // Si existe video/trailer.mp4, aparece el reproductor y el enlace para abrirlo.
  document.querySelectorAll("[data-video]").forEach(function (box) {
    var src = box.getAttribute("data-video");
    var inner = box.firstElementChild;
    if (inner) {
      var f = document.createElement("span");
      f.className = "fname"; f.textContent = src;
      inner.appendChild(f);
    }
    var v = document.createElement("video");
    v.controls = true; v.preload = "metadata"; v.playsInline = true;
    var poster = box.getAttribute("data-poster");
    if (poster) {
      var pi = new Image();
      pi.onload = function () { v.poster = poster; };
      pi.src = poster;
    }
    v.addEventListener("loadedmetadata", function () {
      box.textContent = "";
      box.classList.add("has-video");
      box.appendChild(v);
      var dl = box.parentElement.querySelector(".video-dl");
      if (dl) dl.hidden = false;
    }, { once: true });
    v.src = src;
  });

  // ===== Animaciones (GIF) =====
  // Cada lugar busca su GIF en img/. Si el archivo todavía no existe, queda el recuadro con su nombre y medida.
  document.querySelectorAll("[data-gif]").forEach(function (box) {
    box.setAttribute("data-empty", "");
    var img = new Image();
    img.alt = "";
    img.onload = function () { box.removeAttribute("data-empty"); box.appendChild(img); };
    img.src = box.getAttribute("data-gif");
  });
})();
