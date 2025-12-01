// Respect reduced-motion: skip Lenis if user prefers less motion
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && typeof Lenis === 'function') {
  const lenis = new Lenis({
    duration: 1.1,           // feel free to tweak
    smoothWheel: true,
    smoothTouch: false,
        // allow native scroll in nested scroll areas
        autoRaf: true,
    });

    document.querySelector('.menu-div').setAttribute('data-lenis-prevent', '')

  // rAF loop drives Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Make in-page links use Lenis (with optional sticky-header offset)
  const STICKY_OFFSET = 56; // change if your header height differs
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -STICKY_OFFSET });
      history.pushState(null, '', id);
    });
  });

  // Optional: if page loads with a hash, smooth to it
  if (location.hash) {
    const el = document.querySelector(location.hash);
    if (el) setTimeout(() => lenis.scrollTo(el, { offset: -STICKY_OFFSET }), 50);
  }

  // For console debugging
  window.__lenis = lenis;

  let WindowHeight = window.innerHeight;

  lenis.on('scroll', ({ scroll }) => {
    if (scroll > 0.6 * WindowHeight - 108) {
      document.querySelector(".menu-full").classList.add("menu-transparent")
    }
    else {
      document.querySelector(".menu-full").classList.remove("menu-transparent")
    }
  });
  document.querySelector(".han-menu-full").addEventListener("click", function () {
    const menu = document.querySelector(".menu-full");
    const isActive = menu.classList.toggle("menu-active");
    document.querySelector(".menu-bg").classList.toggle("menu-active-bg");

    if (isActive) {
      // Disable Lenis scrolling
      lenis.stop();
    } else {
      // Re-enable Lenis scrolling
      lenis.start();
    }
  });
  const acordation = document.getElementsByClassName('faq');
  for (i = 0; i < acordation.length; i++) {

    acordation[i].addEventListener('click', function () {
      var faqa = this.classList.contains("active");
      var elems = document.querySelectorAll(".faq.active");
      setTimeout(() => lenis.resize(), 550);


      [].forEach.call(elems, function (el) {
        el.classList.remove("active");
      });

      if (faqa) {
        this.classList.remove("active");
      }
      else {
        this.classList.add("active");
      }
    })
  }



}
else {
  // Gentle native fallback
  document.documentElement.style.scrollBehavior = 'smooth';
  console.info('[Lenis] Skipped (reduced-motion or script unavailable).');
}

