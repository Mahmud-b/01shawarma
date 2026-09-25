/* 01 Shawarma — site behaviour
   Small, focused functions. No build step needed — plain JS. */

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initTicker();
  initMenuFilter();
  initLocationSearch();
  initReveal();
});

/* ---------- Mobile nav (hamburger) ---------- */
function initMobileNav() {
  var toggle = document.querySelector("[data-nav-toggle]");
  var panel = document.querySelector("[data-mobile-nav]");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", function () {
    var isOpen = panel.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.innerHTML = isOpen ? iconClose() : iconMenu();
  });

  // Close the menu after a link is tapped
  panel.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = iconMenu();
    });
  });
}

function iconMenu() {
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
}
function iconClose() {
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';
}

/* ---------- Ticker: duplicate its content once so the CSS marquee loops seamlessly ---------- */
function initTicker() {
  var track = document.querySelector("[data-ticker-track]");
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

/* ---------- Menu category filter (menu.html) ----------
   Reads ?category= from the URL so links like index.html can deep-link
   straight into a filtered view, same as the original site. */
function initMenuFilter() {
  var tabs = document.querySelector("[data-menu-tabs]");
  if (!tabs) return;

  var items = Array.prototype.slice.call(document.querySelectorAll("[data-menu-item]"));
  var buttons = Array.prototype.slice.call(tabs.querySelectorAll(".menu-tab"));

  function applyFilter(category) {
    items.forEach(function (item) {
      var match = !category || item.getAttribute("data-category") === category;
      item.classList.toggle("is-visible", match);
    });
    buttons.forEach(function (btn) {
      var active = (btn.getAttribute("data-category") || "") === (category || "");
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var category = btn.getAttribute("data-category") || "";
      applyFilter(category);
      var url = new URL(window.location.href);
      if (category) {
        url.searchParams.set("category", category);
      } else {
        url.searchParams.delete("category");
      }
      window.history.replaceState({}, "", url);
    });
  });

  var params = new URLSearchParams(window.location.search);
  applyFilter(params.get("category") || "");
}

/* ---------- Locations search (locations.html) ---------- */
function initLocationSearch() {
  var input = document.querySelector("[data-loc-search]");
  if (!input) return;
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-loc-card]"));

  input.addEventListener("input", function () {
    var q = input.value.trim().toLowerCase();
    cards.forEach(function (card) {
      var area = (card.getAttribute("data-area") || "").toLowerCase();
      card.style.display = area.indexOf(q) !== -1 ? "" : "none";
    });
  });
}

/* ---------- One quiet reveal-on-scroll pass for section headings ---------- */
function initReveal() {
  var targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (t) { t.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach(function (t) { observer.observe(t); });
}
