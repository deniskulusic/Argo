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
    const textEls = Array.from(document.querySelectorAll('.reveal-text'));
    const imageEls = Array.from(document.querySelectorAll('.reveal-image'));
    const targets = [...textEls, ...imageEls];


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
            const end = it.top + it.height;
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
    let WindowHeight = window.innerHeight;
    const header = document.querySelector('header');
    const nav = document.querySelector('.menu-full');

    if (header) header.classList.add('header-loaded');
    if (nav) nav.classList.add('nav-loaded');
    console.log("yo")

    /* ===== ANY ANIMATION LOGIC ===== */

    let PreFooter = document.querySelector('.s-a-a-1');
    let PreFooterElements = document.querySelectorAll('.s-a-a-1-right , .s-a-a-1-left-wrapper');
    let PreFooterFromTop = window.pageYOffset + PreFooter.getBoundingClientRect().top;
    window.addEventListener("resize", function () {
        PreFooterFromTop = window.pageYOffset + PreFooter.getBoundingClientRect().top;
        Section6ImgsFromTop = window.pageYOffset + Section6.getBoundingClientRect().top;
    });


    const factors = [0.15, 0.35];
    // 1. Define your boundaries
    const maxW = 1920;
    const minW = 850;
    let responsiveScale = 1; // Default to 1x

    // 2. Calculate the scale based on current width
    if (window.innerWidth >= maxW) {
        responsiveScale = 1;
    } else if (window.innerWidth <= minW) {
        responsiveScale = 0.5;
    } else {
        // Calculate percentage of width between 850 and 1920
        const percentage = (window.innerWidth - minW) / (maxW - minW);
        // Map that percentage to the 0.5 - 1.0 range
        responsiveScale = 0.5 + (percentage * 0.5);
    }



    // Parallax via [data-lenis-speed]
    const SCALE = 0.1;
    lenis.on('scroll', ({ scroll }) => {

        if (scroll > WindowHeight - 100) {
            document.querySelector(".menu-full").classList.add("menu-filled")
            document.querySelector(".menu-full").classList.add("inverted")
        }
        else {
            document.querySelector(".menu-full").classList.remove("menu-filled")
            document.querySelector(".menu-full").classList.remove("inverted")
        }


        /*
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
        */

        document.querySelectorAll('[data-lenis-speed]').forEach((el) => {
            const speed = parseFloat(el.dataset.lenisSpeed) || 0;
            if (scroll < 1.5 * WindowHeight)
                el.style.transform = `translate3d(0, ${scroll * speed * SCALE}px, 0)`;
        });


        // 3. Check Visibility
        if (PreFooter.getBoundingClientRect().top - 1.5 * WindowHeight < 0 &&
            PreFooter.getBoundingClientRect().top + PreFooter.clientHeight + 0.5 * WindowHeight > 0) {

            // Loop through the elements
            // Assuming PreFooterElements is a NodeList or Array
            for (let i = 0; i < PreFooterElements.length; i++) {
                if (factors[i] !== undefined) {
                    // Calculate distance
                    let val = factors[i] * responsiveScale * (PreFooterFromTop - scroll);

                    // Apply style directly (more performant than .animate)
                    PreFooterElements[i].style.transform = "translateY(" + val + "px)";
                }
            }
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

    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const paginationContainer = document.getElementById('pagination');
    const touchArea = document.getElementById('touchArea');

    let currentIndex = 0;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;

    // 1. Initialization
    slides.forEach((slide, index) => {
        if (index === 0) {
            slide.style.transform = 'translateX(0%)';
        } else {
            slide.style.transform = 'translateX(100%)';
        }
    });

    // 2. Pagination Dots Setup
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            if (index === currentIndex || isAnimating) return;
            const direction = index > currentIndex ? 'next' : 'prev';
            handleSlideChange(direction, index);
        });

        paginationContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    // 3. Main Slide Logic
    function handleSlideChange(direction, specificIndex = null) {
        if (isAnimating) return;
        isAnimating = true;

        const outgoing = slides[currentIndex];
        let incomingIndex;

        if (specificIndex !== null) {
            incomingIndex = specificIndex;
        } else {
            if (direction === 'next') {
                incomingIndex = (currentIndex + 1) % slides.length;
            } else {
                incomingIndex = (currentIndex - 1 + slides.length) % slides.length;
            }
        }

        const incoming = slides[incomingIndex];

        // --- A. Setup Incoming Slide ---
        incoming.style.transition = 'none'; // Disable transition for instant placement

        if (direction === 'next') {
            incoming.style.transform = 'translateX(100%)';
        } else {
            incoming.style.transform = 'translateX(-100%)';
        }

        // Force reflow
        void incoming.offsetWidth;

        // --- B. Execute Animation ---
        incoming.style.transition = 'transform 800ms cubic-bezier(.215, .61, .355, 1)';
        outgoing.style.transition = 'transform 800ms cubic-bezier(.215, .61, .355, 1)';

        incoming.style.transform = 'translateX(0%)';

        if (direction === 'next') {
            outgoing.style.transform = 'translateX(-100%)';
        } else {
            outgoing.style.transform = 'translateX(100%)';
        }

        // Update Dots
        dots[currentIndex].classList.remove('active');
        dots[incomingIndex].classList.add('active');

        // --- C. Cleanup ---
        setTimeout(() => {
            currentIndex = incomingIndex;
            isAnimating = false;
        }, 600);
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => handleSlideChange('next'));
    prevBtn.addEventListener('click', () => handleSlideChange('prev'));

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') handleSlideChange('next');
        if (e.key === 'ArrowLeft') handleSlideChange('prev');
    });

    // Touch
    touchArea.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    touchArea.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            handleSlideChange('next');
        }
        if (touchEndX > touchStartX + threshold) {
            handleSlideChange('prev');
        }
    }

    document.querySelector(".han-menu-full").addEventListener("click", function () {
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
})();
