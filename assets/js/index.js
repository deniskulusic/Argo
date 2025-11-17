(function () {
  window.history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If user prefers reduced motion, skip Lenis entirely (accessibility first)
  if (prefersReduced) {
    console.info('[Lenis] Disabled due to prefers-reduced-motion.');
    document.documentElement.style.scrollBehavior = 'smooth';
    return;
  }

  if (typeof window.Lenis !== 'function') {
    console.warn('[Lenis] CDN failed or unavailable. Falling back to native scrolling.');
    return;
  }

  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    lerp: 0.1,
    smoothWheel: true,
    smoothTouch: false
  });
    // Collect targets
    const textEls  = Array.from(document.querySelectorAll('.reveal-text'));
    const imageEls = Array.from(document.querySelectorAll('.reveal-image'));
    const targets  = [...textEls, ...imageEls];

    if (!targets.length) return;

    // Optional: lightweight stagger for siblings
    const applyStagger = (els, base = 70) => {
      els.forEach((el, i) => {
        if (!el.matches('.reveal-text')) return;
        el.dataset.stagger = "1";
        el.style.setProperty('--stagger', `${i * base}ms`);
      });
    };

    // Group consecutive reveal-text siblings for nicer stagger
    let group = [];
    const flushGroup = () => { if (group.length) { applyStagger(group); group = []; } };
    textEls.forEach((el, i) => {
      const prev = textEls[i - 1];
      if (prev && prev.parentElement === el.parentElement) {
        group.push(el);
        if (!group.includes(prev)) group.unshift(prev);
      } else {
        flushGroup();
        group = [el];
      }
    });
    flushGroup();

    // If reduced motion, just mark them visible and bail
    if (prefersReduced) {
      targets.forEach(el => el.classList.add('is-inview'));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          // Unobserve once revealed (one-time animation)
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      // Reveal a bit before fully on screen for a snappier feel
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.12
    });

    targets.forEach(t => io.observe(t));

    // Optional: if you use Lenis, ensure IO gets regular rAF ticks (helps on some mobile browsers)
    // Your rAF already runs; but we can ping IO’s internal checks during scroll:
    if (window.__lenis) {
      window.__lenis.on('scroll', () => { /* no-op; forces layout/paint cadence with Lenis */ });
    }


const VH = () => window.innerHeight || document.documentElement.clientHeight;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const items = Array.from(document.querySelectorAll('.section-3-element-holder , .section-7-holder , .section-10-img-holder , .blog-element-holder ,.section-argo-1-right-holder , .section-argo-2-img'))
    .map(el => {
      const picture = el.querySelector('picture');
      const img = picture && picture.querySelector('img');
      if (!picture || !img) return null;

      const scale = parseFloat(img.dataset.scale || el.dataset.scale || 1.2);
      return {
        el, img, scale,
        height: 0,
        top: 0,
        extra: 0
      };
    })
    .filter(Boolean);

  const measure = () => {
    items.forEach(it => {
      const rect = it.el.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      it.height = rect.height;
      it.top = rect.top + scrollY;
      it.extra = (it.scale - 1) * it.height;
    });
  };

  measure();
  window.addEventListener('resize', () => requestAnimationFrame(measure), { passive: true });

  // ✅ This is what the raf() will call
  window.updateParallax = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const vh = VH();

    items.forEach(it => {
      const start = it.top - vh;
      const end   = it.top + it.height;
      const t = clamp((scrollY - start) / (end - start), 0, 1);
      const y = (0.5 - t) * it.extra;

      it.img.style.setProperty('--s', it.scale);
      it.img.style.setProperty('--y', `${y}px`);
    });
  };





  // rAF loop — drives Lenis updates
  function raf(time) {
  lenis.raf(time);

  // ✅ add this new line
  if (window.updateParallax) window.updateParallax();

  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

  // Optional: scroll to hash on load if URL contains one (with header offset)
  const stickyOffset = 64; // header height in px
  if (window.location.hash) {
    const el = document.querySelector(window.location.hash);
    if (el) {
      setTimeout(() => lenis.scrollTo(el, { offset: -stickyOffset }), 50);
    }
  }

  // Enhance all in-page anchor links to use Lenis
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const el = document.querySelector(targetId);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -stickyOffset });
      history.pushState(null, '', targetId); // optional
    });
  });

  // Expose for debugging in the console
  window.__lenis = lenis;








  
  /* ===== BASIC ===== */
  let WindowHeight=window.innerHeight;
  const header = document.querySelector('header');
  const nav = document.querySelector('.menu-full');
  let Section6=document.querySelector('.section-6');
  let Section6Elements=document.querySelectorAll('.section-6-element');
  let Section6ImgsFromTop=window.pageYOffset + Section6.getBoundingClientRect().top;
  const menu = document.querySelector('.menu-full');
  const growSection = document.querySelectorAll('.grow-section');
  let SectionArgo2=document.querySelector(".section-argo-2-img");
  let SectionArgo2FromTop=window.pageYOffset + SectionArgo2.getBoundingClientRect().top;
  let PreFooter=document.querySelector('.pre-footer');
  let PreFooterElements=document.querySelectorAll('.image-group div');
  let PreFooterFromTop=window.pageYOffset + PreFooter.getBoundingClientRect().top;
window.addEventListener("resize", function () {
  PreFooterFromTop=window.pageYOffset + PreFooter.getBoundingClientRect().top;
  SectionArgo2FromTop=window.pageYOffset + SectionArgo2.getBoundingClientRect().top;
  Section6ImgsFromTop=window.pageYOffset + Section6.getBoundingClientRect().top;
  });

  

  // Parallax via [data-lenis-speed]
  const SCALE = 0.1;
  lenis.on('scroll', ({ scroll }) => {
    if(scroll > WindowHeight - 100){
      document.querySelector(".menu-full").classList.add("menu-filled")
      document.querySelector(".menu-full").classList.add("inverted")
    }
    else{
      document.querySelector(".menu-full").classList.remove("menu-filled")
      document.querySelector(".menu-full").classList.remove("inverted")
    }


    // Top of the screen (0px offset)
  const viewportTop = scroll;

  let insideGrow = false;

  growSection.forEach(section => {
    const rectTop = section.offsetTop;
    const rectBottom = rectTop + section.offsetHeight;

    // Check if viewport top is inside the section boundaries
    if (viewportTop >= rectTop && viewportTop < rectBottom) {
      insideGrow = true;
    }
  });

  // Toggle the class
  if (insideGrow) {
    menu.classList.add('menu-hidden');
  } else {
    menu.classList.remove('menu-hidden');
  }

    document.querySelectorAll('[data-lenis-speed]').forEach((el) => {
      const speed = parseFloat(el.dataset.lenisSpeed) || 0;
       if(scroll < 1.5*WindowHeight)
      el.style.transform = `translate3d(0, ${scroll * speed * SCALE}px, 0)`;

      
  
    
    });
/*
    if (Section6.getBoundingClientRect().top - 1.5*WindowHeight < 0 && Section6.getBoundingClientRect().top + Section6.clientHeight + 0.5*WindowHeight  > 0) {
        Section6Elements[0].animate({
          transform: "translateY(" + (0.08 * (Section6ImgsFromTop - scroll)) + "px )"
        }, { duration: 1500, fill: "forwards" });
        Section6Elements[1].animate({
          transform: "translateY(" + (0.15 * (Section6ImgsFromTop - scroll)) + "px )"
        }, { duration: 1500, fill: "forwards" });
        Section6Elements[2].animate({
          transform: "translateY(" + (0.22 * (Section6ImgsFromTop - scroll)) + "px )"
        }, { duration: 1500, fill: "forwards" });
        
    }
*/

  
    if (SectionArgo2.getBoundingClientRect().top - WindowHeight < 0 && SectionArgo2.getBoundingClientRect().top + SectionArgo2.clientHeight > 0) {
        SectionArgo2.animate({
          transform: "translateY(" + (-0.1 * (SectionArgo2FromTop - scroll)) + "px )"
        }, { duration: 1500, fill: "forwards" });
    }

    if (PreFooter.getBoundingClientRect().top - 1.5*WindowHeight < 0 && PreFooter.getBoundingClientRect().top + PreFooter.clientHeight + 0.5*WindowHeight  > 0) {
        PreFooterElements[0].animate({
          transform: "translateY(" + (0.22 * (PreFooterFromTop - scroll)) + "px )"
        }, { duration: 1500, fill: "forwards" });
        PreFooterElements[1].animate({
          transform: "translateY(" + (0.15 * (PreFooterFromTop - scroll)) + "px )"
        }, { duration: 1500, fill: "forwards" });
        PreFooterElements[2].animate({
          transform: "translateY(" + (0.08 * (PreFooterFromTop - scroll)) + "px )"
        }, { duration: 1500, fill: "forwards" });
        PreFooterElements[3].animate({
          transform: "translateY(" + (0.15 * (PreFooterFromTop - scroll)) + "px )"
        }, { duration: 1500, fill: "forwards" });
        PreFooterElements[4].animate({
          transform: "translateY(" + (0.22 * (PreFooterFromTop - scroll)) + "px )"
        }, { duration: 1500, fill: "forwards" });

    }
  
  });





          const acordation=document.getElementsByClassName('faq');
for(i=0;i<acordation.length;i++){
  
    acordation[i].addEventListener('click',function(){
      var faqa=this.classList.contains("active");
        var elems = document.querySelectorAll(".faq.active");
        setTimeout(() => lenis.resize(), 550);
        
        
[].forEach.call(elems, function(el) {
    el.classList.remove("active");
});

if(faqa) {
  this.classList.remove("active");
        }
        else{
          this.classList.add("active");
        }
    })
}



/* =======================================================
        // 1. SHARED CURSOR LOGIC (for the main slider)
        // ======================================================= */
const cursor = document.createElement('div');
cursor.className = 'drag-cursor';
cursor.setAttribute('aria-hidden', 'true');
// MODIFICATION: Add plus icon and ring elements
cursor.innerHTML = `
    <span class="label">scroll</span>
    <span class="plus-icon">+</span>
    <div class="ring" aria-hidden="true"></div>
`;
document.body.appendChild(cursor);

let cursorRAF = null;
let cursorX = 0, cursorY = 0;
let targetX = 0, targetY = 0;
let cursorScale = 1, targetScale = 1;

function showCursor(){ cursor.classList.add('show'); if(cursorRAF==null) cursorLoop(); }
function hideCursor(){ cursor.classList.remove('show'); if(cursorRAF!=null){ cancelAnimationFrame(cursorRAF); cursorRAF=null; } }

function cursorLoop(){
    cursorX += (targetX - cursorX) * 0.18;
    cursorY += (targetY - cursorY) * 0.18;
    cursorScale += (targetScale - cursorScale) * 0.15;
    // Use style properties for smooth transformation
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursor.style.transform = `translate(-50%, -50%) scale(${cursorScale})`;
    cursorRAF = requestAnimationFrame(cursorLoop);
}
window.addEventListener('touchstart', () => hideCursor(), { passive: true });

// Helper to set cursor mode
function setCursorMode(mode) {
    cursor.classList.remove('cursor-mode-drag', 'cursor-mode-scroll', 'cursor-mode-plus');
    cursor.classList.add(`cursor-mode-${mode}`);
    // Update label text
    if (mode === 'drag' || mode === 'scroll') {
        cursor.querySelector('.label').textContent = mode;
    }
}


/* =======================================================
    // 2. PROGRESS BAR LOGIC (Independent)
    // ======================================================= 

const currentSlideCountEl = document.getElementById('currentSlideCount');
const totalSlideCountEl = document.getElementById('totalSlideCount');
const progressBarIndicator = document.getElementById('progressBarIndicator');

function updateProgressBarUI(currentIndex, totalSlides) {
    if (totalSlides === 0) return;
    
    const current = currentIndex + 1;
    // Calculate progress percentage: the bar should fully fill on the LAST slide
    const progress = (current / totalSlides) * 100;

    // Update text counts
    currentSlideCountEl.textContent = "0" + current;
    totalSlideCountEl.textContent = "0" + totalSlides;

    // Update progress indicator width
    progressBarIndicator.style.width = `${progress}%`;
}
*/

/* =======================================================
    // 3. MAIN SLIDER FUNCTIONALITY (Drag & Snap)
    // ======================================================= */

function initSlider(root){
    const viewport = root.querySelector('.slider-viewport');
    const track    = root.querySelector('.slider-track');
    const btnPrev = root.querySelector('.slider-btn.prev');
    const btnNext = root.querySelector('.slider-btn.next');
    const cards = Array.from(root.querySelectorAll('.card'));

    if(!viewport || !track) return;
    
    const isButtonsOnly = root.classList.contains('buttons-only');
    const dragEnabled = !isButtonsOnly && root.dataset.drag !== 'false';

    let offset = 0;           
    let baseOffset = 0;
    let maxScroll = 0;
    let stops = [];
    let momentumRAF = null;

    function measure(){
        const viewW = viewport.clientWidth;

        if (cards.length === 0) {
            baseOffset = 0;
            maxScroll = 0;
            stops = [0];
            return;
        }

        const first = cards[0];
        const last  = cards[cards.length - 1];

        const csFirst = getComputedStyle(first);
        const csLast  = getComputedStyle(last);

        // Calculate total track width and offsets
        const firstLeftOuter = first.offsetLeft - (parseFloat(csFirst.marginLeft) || 0);
        const lastRightOuter = last.offsetLeft + last.offsetWidth + (parseFloat(csLast.marginRight) || 0);
        const totalWidth = lastRightOuter - firstLeftOuter;

        baseOffset = -firstLeftOuter;
        maxScroll = Math.max(0, totalWidth - viewW);

        // Precompute snap positions (aligned to the left edge of each card)
        stops = cards.map(card => {
            const cs = getComputedStyle(card);
            const leftOuter = card.offsetLeft - (parseFloat(cs.marginLeft) || 0);
            return clamp(-leftOuter); // Ensure stops are clamped
        });
        
        // Keep offset within bounds
        offset = clamp(offset);
    }

    function clamp(x){
        const min = baseOffset - maxScroll;
        const max = baseOffset;
        return Math.max(min, Math.min(max, x));
    }

    function render(){
        track.style.transform = `translateX(${offset}px)`;
        
        // Update buttons
        if (btnPrev) btnPrev.disabled = (offset >= baseOffset - 0.5);
        if (btnNext) btnNext.disabled = (offset <= (baseOffset - maxScroll) + 0.5);
        
        // Update Progress Bar
        let currentIndexForProgress = 0;
        // Find the index of the card whose stop position is closest to the current offset
        let minDiff = Infinity;
        let closestIndex = 0;

        stops.forEach((stop, index) => {
            const diff = Math.abs(stop - offset);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = index;
            }
        });
        
      /*  updateProgressBarUI(closestIndex, cards.length);*/
    }

    function update(){
        measure();
        // Initial run: align to base offset (first card)
        if (Math.abs(offset) < 0.001 && Math.abs(baseOffset) > 0.001) {
            offset = baseOffset;
        }
        render();
    }

    // Snap logic: Find the next/previous *full card* stop position
    function findNextStop(current){
        const currentCardIndex = stops.findIndex(s => Math.abs(s - current) < 1);
        if (currentCardIndex !== -1 && currentCardIndex < stops.length - 1) {
             return stops[currentCardIndex + 1];
        }
        // Find the first card stop position *to the left* of the current position (if not currently snapped)
        let nextStop = current;
        for (let i = stops.length - 1; i >= 0; i--) {
            if (stops[i] < current - 1) { // Stop is further left than current view
                nextStop = stops[i];
                break;
            }
        }
        return clamp(nextStop);
    }

    function findPrevStop(current){
        const currentCardIndex = stops.findIndex(s => Math.abs(s - current) < 1);
        if (currentCardIndex > 0) {
             return stops[currentCardIndex - 1];
        }
        // Find the first card stop position *to the right* of the current position (if not currently snapped)
        let prevStop = current;
        for (let i = 0; i < stops.length; i++) {
            if (stops[i] > current + 1) { // Stop is further right than current view
                prevStop = stops[i];
                break;
            }
        }
        return clamp(prevStop);
    }
    
    function next(){
        offset = findNextStop(offset);
        render();
    }
    function prev(){
        offset = findPrevStop(offset);
        render();
    }

    // Attach button listeners
    if (btnNext) btnNext.addEventListener('click', next);
    if (btnPrev) btnPrev.addEventListener('click', prev);

    // Resize & Load handling
    const roViewport = new ResizeObserver(update);
    const roTrack    = new ResizeObserver(update);
    roViewport.observe(viewport);
    roTrack.observe(track);
    window.addEventListener('load', update);
    update();
    
    
    /* --- Cursor and Dragging Logic (From User Input) --- */

    if (isButtonsOnly) {
        viewport.addEventListener('pointerenter', () => { 
            showCursor(); 
            setCursorMode('plus');
        });
        viewport.addEventListener('pointerleave', () => { 
            hideCursor(); 
            targetScale=1; 
        });
        viewport.addEventListener('pointermove', (e) => { 
            targetX = e.clientX; 
            targetY = e.clientY; 
        });
        return; 
    }

    // ======= Dragging only if enabled =======
    if (!dragEnabled) return; 

    let isDragging = false;
    let startX = 0, startOffset = 0, lastX = 0, lastTs = 0, velocity = 0;
    const DRAG_THRESHOLD = 3;

    function stopMomentum(){ if (momentumRAF!=null) cancelAnimationFrame(momentumRAF); momentumRAF=null; }
    function startMomentum(){
        stopMomentum();
        const decay = 0.95;
        const minVel = 0.05;
        const frame = () => {
            velocity *= decay;
            if (Math.abs(velocity) < minVel) { stopMomentum(); return; }
            // Apply momentum, clamp, and render
            offset = clamp(offset + velocity * 16); 
            render();

            // Stop momentum if we hit the edge
            if (offset === 0 || offset === (baseOffset - maxScroll)) { 
                velocity = 0; // stop the velocity abruptly
                stopMomentum(); 
                return; 
            }
            momentumRAF = requestAnimationFrame(frame);
        };
        momentumRAF = requestAnimationFrame(frame);
    }

    // Cursor bubble (only for draggable sliders)
    viewport.addEventListener('pointerenter', () => { 
        showCursor(); 
        setCursorMode('scroll'); 
    });
    viewport.addEventListener('pointerleave', () => { hideCursor(); targetScale=1; });
    viewport.addEventListener('pointermove', (e) => { targetX = e.clientX; targetY = e.clientY; });

    // Pointer events for drag
    viewport.addEventListener('pointerdown', (e) => {
        // 🆕 Allow links to be clickable — don't start drag if pointer down on an <a>
        const anchor = e.target.closest('a');
        if (anchor) {
            return; // let the browser handle the link normally
        }

        if (e.button !== 0 && e.pointerType === 'mouse') return;
        viewport.setPointerCapture(e.pointerId);
        stopMomentum();
        isDragging = true;
        startX = lastX = e.clientX;
        startOffset = offset;
        lastTs = performance.now();
        velocity = 0;
        setCursorMode('drag'); 
        targetScale = 0.9;
        viewport.classList.add('dragging');
        e.preventDefault();
    });

    viewport.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const now = performance.now();
        const dxRaw = e.clientX - startX;

        const dxBase = Math.abs(dxRaw) < DRAG_THRESHOLD ? 0 : dxRaw;
        const dx = dxBase * 1; // Drag dampening

        offset = clamp(startOffset + dx);
        render();

        const dt = now - lastTs || 16;
        velocity = (e.clientX - lastX) / dt;
        lastX = e.clientX;
        lastTs = now;

        const speed = Math.min(Math.abs(velocity) * 30, 1);
        targetScale = 1 - speed * 0.35;
    });

    function endDrag(){
        if (!isDragging) return;
        isDragging = false;
        viewport.classList.remove('dragging');
        setCursorMode('scroll'); 
        targetScale = 1;
        
        // Start momentum only if it wasn't a static click and we are not at the edge
        if (Math.abs(velocity) > 0.01 && offset > (baseOffset - maxScroll) + 1 && offset < baseOffset - 1) { 
            startMomentum();
        } else {
            // Snap back if momentum is negligible
            offset = clamp(offset); // Re-clamp just in case
            render();
        }
        velocity = 0; // Reset velocity after drag ends
    }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('lostpointercapture', endDrag);

    track.addEventListener('dragstart', (e) => e.preventDefault());
}

// Initialize all sliders
document.querySelectorAll('.slider').forEach(initSlider);




/* ================= GALLERY LOGIC (DYNAMIC SLIDER) ================= 

// DOM elements
const gallery = document.querySelector('.fullscreen-gallery');
const galleryTrack = document.querySelector('.gallery-track'); // NEW: The track element
const closeBtn = document.querySelector('.gallery-close-btn');
const prevBtn = document.querySelector('.gallery-prev');
const nextBtn = document.querySelector('.gallery-next');
const galleryCounter = document.querySelector('.gallery-counter');

// State
let allImageUrls = [];
let currentIndex = -1;
let totalSlides = 0;
const TRANSITION_DURATION = 700;

// --- Core Functions ---

function collectAllImageUrls() {
    const cards = document.querySelectorAll('.opens-gallery .card');
    allImageUrls = Array.from(cards)
        .map(card => {
            const style = card.style.backgroundImage;
            return style ? style.replace(/url\(['"]?(.*?)['"]?\)/i, '$1') : null;
        })
        .filter(url => url);
    
    totalSlides = allImageUrls.length;
}

// NEW: Function to dynamically build the gallery track
function buildGallerySlides() {
    collectAllImageUrls();
    galleryTrack.innerHTML = ''; // Clear existing content

    allImageUrls.forEach(url => {
        const slide = document.createElement('div');
        slide.classList.add('gallery-slide');

        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Gallery image';

        slide.appendChild(img);
        galleryTrack.appendChild(slide);
    });
}

// 2. Update the gallery view (Modified for sliding the track)
function updateGallery(immediate = false) {
    if (currentIndex < 0 || currentIndex >= totalSlides) return;

    // Calculate the translation distance (e.g., -100vw for index 1, -200vw for index 2)
    const offset = currentIndex * -100; // In percentage/vw

    // Set transition speed
    galleryTrack.style.transitionDuration = immediate ? '0ms' : `${TRANSITION_DURATION}ms`;
    
    // Apply the transformation
    galleryTrack.style.transform = `translateX(${offset}vw)`;

    // Update buttons and counter
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;
    galleryCounter.textContent = `${currentIndex + 1}/${totalSlides}`;
}

// 3. Open the gallery
function openGallery(startIndex) {
    currentIndex = startIndex;
    
    gallery.classList.add('is-open');
    gallery.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Jump instantly to the starting slide
    updateGallery(true); 
}

// 4. Close the gallery
function closeGallery() {
    gallery.classList.remove('is-open');
    gallery.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// --- Event Handlers ---

// Navigation (Simply changes index and calls update)
function navigate(direction) {
    let newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < totalSlides) {
        currentIndex = newIndex;
        updateGallery(false); // Animate the slide
    }
}

// 1. Article click handler (to open the gallery)
document.querySelectorAll('.opens-gallery .card').forEach((card, index) => {
    card.style.cursor = 'pointer'; 
    card.addEventListener('click', (e) => {
        // 🆕 Allow links inside cards to be clickable
        const anchor = e.target.closest('a');
        if (anchor) {
            return; // don't open gallery if a link was clicked
        }

        // Ensure slides are built before opening
        if (totalSlides === 0) buildGallerySlides(); 
        openGallery(index);
    });
});

// 2. Gallery button event listeners
closeBtn.addEventListener('click', closeGallery);
prevBtn.addEventListener('click', () => navigate(-1));
nextBtn.addEventListener('click', () => navigate(1));

// 3. Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!gallery.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
        closeGallery();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); 
        navigate(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault(); 
        navigate(1);
    }
});

// Initial Setup: Build the slides when the page loads
window.addEventListener('load', buildGallerySlides);*/













/*GROW SECTION*/

const growSections = Array.from(document.querySelectorAll('.grow-section'));
if (growSections.length) {
  const toPx = (val) => {
    if (typeof val !== 'string') return Number(val) || 0;
    if (val.endsWith('vh')) return (parseFloat(val) / 100) * window.innerHeight;
    if (val.endsWith('vw')) return (parseFloat(val) / 100) * window.innerWidth;
    if (val.endsWith('px')) return parseFloat(val);
    return parseFloat(val) || 0;
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp  = (a, b, t) => a + (b - a) * t;

  const state = growSections.map((section) => {
    const pin   = section.querySelector('.pin');
    const frame = section.querySelector('.frame');
    const video = frame ? frame.querySelector('img') : null;

    // Frame (container) scale range
    const startScale = parseFloat(section.dataset.growStart || 0.7);
    const endScale   = parseFloat(section.dataset.growEnd   || 1.0);

    // Video: its own range + a curve exponent to change the pace
    const vStart = parseFloat(section.dataset.videoStart ?? startScale);
    const vEnd   = parseFloat(section.dataset.videoEnd   ?? endScale);
    const vCurve = parseFloat(section.dataset.videoCurve || 1); // 1=linear, <1 ease-out, >1 ease-in

    const distStr = section.dataset.growDistance
      || getComputedStyle(section).getPropertyValue('--grow-distance')
      || '120vh';
    let growDistance = toPx(distStr);

    // Extra hold after reaching full scale (defaults to 10vh)
    const holdStr = section.dataset.growHold || '20vh';
    let holdPx = toPx(holdStr);

    // Sync section height (pin duration) — include hold
    section.style.setProperty('--grow-distance', `${growDistance}px`);
    section.style.setProperty('--grow-hold', `${holdPx}px`);
    section.style.height = `calc(100vh + ${growDistance}px + ${holdPx}px)`;

    // Initial transforms (in case CSS didn’t set them)
    if (frame && !frame.style.transform) frame.style.transform = `scale(${startScale})`;
    if (video && !video.style.transform) video.style.transform = `scale(${vStart})`;

    return { section, pin, frame, video, startScale, endScale, vStart, vEnd, vCurve, growDistance, holdPx, holdStr };
  });

  function updateGrow() {
    state.forEach((s) => {
      if (!s.section || !s.frame) return;
      const rect = s.section.getBoundingClientRect();

      // Use growDistance + holdPx as the effective pinned distance so the section
      // remains pinned (and at scale 1) for an extra holdPx of scroll.
      const effectiveDistance = s.growDistance + s.holdPx;

       // Base progress for the animation (0..1)
      // This should complete over growDistance, before the hold.
      const p = clamp((-rect.top) / s.growDistance, 0, 1);

      // Frame: linear
      const frameScale = lerp(s.startScale, s.endScale, p);
      s.frame.style.transform = `scale(${frameScale})`;

      // When it reaches full scale (or beyond) we can toggle any UI hooks
      if (frameScale >= 1) {
        const overlay = document.querySelector(".overlay");
        if (overlay) overlay.classList.add('overlay-text-active');

        const frameEl = document.querySelector(".frame");
        if (frameEl) frameEl.setAttribute("data-lenis-speed", "8");
      }

      // Video: apply curve to change pace
      const pv = Math.pow(p, s.vCurve); // <1 = faster at start, >1 = slower at start
      const videoScale = lerp(s.vStart, s.vEnd, clamp(pv, 0, 1));
      if (s.video) s.video.style.transform = `scale(${videoScale})`;
    });
  }

  function recomputeDistances() {
    state.forEach((s) => {
      const distStr = s.section.dataset.growDistance
        || getComputedStyle(s.section).getPropertyValue('--grow-distance')
        || '120vh';
      s.growDistance = toPx(distStr);

      // Recompute hold (in case CSS or dataset changed)
      const holdStr = s.section.dataset.growHold || s.holdStr || '10vh';
      s.holdPx = toPx(holdStr);

      s.section.style.setProperty('--grow-distance', `${s.growDistance}px`);
      s.section.style.setProperty('--grow-hold', `${s.holdPx}px`);
      s.section.style.height = `calc(100vh + ${s.growDistance}px + ${s.holdPx}px)`;
    });
    updateGrow();
  }

  // Hook into Lenis + resize
  if (window.__lenis) window.__lenis.on('scroll', updateGrow);
  window.addEventListener('resize', recomputeDistances);
  updateGrow();
}

/*END OF GROW SECTION*/



 
document.querySelector(".han-menu-full").addEventListener("click", function() {
  const menu = document.querySelector(".menu-full");
  const isActive = menu.classList.toggle("menu-active");

  if (isActive) {
    // Disable Lenis scrolling
    lenis.stop();
  } else {
    // Re-enable Lenis scrolling
    lenis.start();
  }
});
 

function id(v) { return document.getElementById(v); }

function loadbar() {
  let ovrl = id("overlay"),
      prog = id("progress"),
      stat = id("progstat"),
      ovIn = id("overlay-in"), 
      ovInh = document.querySelector("#overlay-in span");

  let duration = 2000; // 5 seconds total to reach 100%
  let start = null;

  function animate(timestamp) {
    if (!start) start = timestamp;
    let progress = Math.min((timestamp - start) / duration, 1);
    let perc = Math.floor(progress * 100) + "%";

    // Update visual progress
    prog.style.width = perc;
    stat.innerHTML = perc;
lenis.stop();
    // Positioning animations
    if (window.innerWidth <= 600) {
      ovIn.style.bottom = progress * 50 + "%";
    } else {
      ovIn.style.bottom = progress * 30 + "%";
    }

    ovInh.style.transform = "translateY(calc(100% - " + (progress * 50) + "%))";
 document.body.classList.add("preloader-active");

    // Continue until we hit 100%
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Pause for 1s before finishing
      setTimeout(doneLoading, 750);
    }
  }

  function doneLoading() {
 document.body.classList.remove("preloader-active");
    lenis.start();
    header.classList.add('header-loaded');
    nav.classList.add('nav-loaded');
    setTimeout(function () {
      ovrl.style.display = "none";
      ovrl.style.opacity = 0;
    }, 2000);
  }

  requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', loadbar, false);



})();
