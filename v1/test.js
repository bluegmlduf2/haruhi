window.addEventListener("load", function () {
    /* =============================================
     SCROLL REVEAL — Intersection Observer
  ============================================= */
    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
        revealObserver.observe(el);
    });

    /* =============================================
     HEADER — scroll state + hamburger
  ============================================= */
    const header = document.getElementById("header");
    const menuBtn = document.getElementById("menuBtn");
    const headerNav = document.getElementById("headerNav");

    window.addEventListener(
        "scroll",
        function () {
            header.classList.toggle("scrolled", window.scrollY > 20);
        },
        { passive: true },
    );

    menuBtn.addEventListener("click", function () {
        const isOpen = headerNav.classList.toggle("open");
        menuBtn.classList.toggle("open", isOpen);
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    headerNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            headerNav.classList.remove("open");
            menuBtn.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
        });
    });

    /* =============================================
     FLOATING CTA — show after scroll, hide at footer
  ============================================= */
    const floatCta = document.getElementById("floatCta");
    const footer = document.getElementById("footer");

    window.addEventListener(
        "scroll",
        function () {
            floatCta.classList.toggle("visible", window.scrollY > 400);
        },
        { passive: true },
    );

    const footerObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                floatCta.classList.toggle("hidden", entry.isIntersecting);
            });
        },
        { threshold: 0.1 },
    );
    footerObserver.observe(footer);

    /* =============================================
     HERO PARALLAX — background orbs
  ============================================= */
    const orb1 = document.querySelector(".hero__bg-orb--1");
    const orb2 = document.querySelector(".hero__bg-orb--2");
    const orb3 = document.querySelector(".hero__bg-orb--3");

    window.addEventListener(
        "scroll",
        function () {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                if (orb1)
                    orb1.style.transform = "translateY(" + y * 0.2 + "px)";
                if (orb2)
                    orb2.style.transform = "translateY(" + y * -0.15 + "px)";
                if (orb3)
                    orb3.style.transform =
                        "translate(-50%, calc(-50% + " + y * 0.1 + "px))";
            }
        },
        { passive: true },
    );

    /* =============================================
     PARTICLE CANVAS
  ============================================= */
    function initParticles() {
        const canvas = document.getElementById("particleCanvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let W, H;

        function resize() {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener("resize", resize, { passive: true });

        const COLORS = [
            "rgba(102,193,255,",
            "rgba(255,213,128,",
            "rgba(255,255,255,",
            "rgba(168,224,255,",
        ];

        const COUNT = window.innerWidth < 600 ? 28 : 55;
        const particles = [];

        for (let i = 0; i < COUNT; i++) {
            particles.push(createParticle(false));
        }

        function createParticle(fromBottom) {
            const col = COLORS[Math.floor(Math.random() * COLORS.length)];
            return {
                x: Math.random() * W,
                y: fromBottom ? H + 10 : Math.random() * H,
                r: Math.random() * 3.5 + 1,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -(Math.random() * 0.5 + 0.2),
                alpha: Math.random() * 0.45 + 0.2,
                color: col,
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.02 + Math.random() * 0.03,
            };
        }

        let animId;

        function draw() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(function (p) {
                p.twinkle += p.twinkleSpeed;
                const a = p.alpha * (0.7 + 0.3 * Math.sin(p.twinkle));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color + a + ")";
                ctx.fill();
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < -p.r * 2) {
                    Object.assign(p, createParticle(true));
                }
                if (p.x < -p.r) {
                    p.x = W + p.r;
                }
                if (p.x > W + p.r) {
                    p.x = -p.r;
                }
            });
            animId = requestAnimationFrame(draw);
        }

        const heroEl = document.getElementById("hero");
        const heroVis = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) {
                        if (!animId) draw();
                    } else {
                        cancelAnimationFrame(animId);
                        animId = null;
                    }
                });
            },
            { threshold: 0 },
        );
        heroVis.observe(heroEl);
    }
    initParticles();

    /* =============================================
     SMOOTH SCROLL for anchor links
  ============================================= */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (!target) return;
            e.preventDefault();

            const headerH =
                parseInt(
                    getComputedStyle(document.documentElement).getPropertyValue(
                        "--header-h",
                    ),
                    10,
                ) || 68;

            const top =
                target.getBoundingClientRect().top + window.scrollY - headerH;
            window.scrollTo({ top: top, behavior: "smooth" });
        });
    });

    /* =============================================
     KEYBOARD ART — RGB key shimmer on hover
  ============================================= */
    document.querySelectorAll(".kb-art__key--hi").forEach(function (key) {
        key.addEventListener("mouseenter", function () {
            key.style.boxShadow =
                "0 2px 0 rgba(58,160,232,0.5), 0 0 16px rgba(102,193,255,0.8)";
        });
        key.addEventListener("mouseleave", function () {
            key.style.boxShadow = "";
        });
    });

    /* =============================================
     MOUSE ART — subtle hover tilt
  ============================================= */
    function initMouseArtTilt() {
        const msArt = document.querySelector(".ms-art__body");
        if (!msArt) return;

        const parent = msArt.closest(".product-visual__placeholder");
        if (!parent) return;

        msArt.style.transition = "transform 0.15s ease";

        parent.addEventListener("mousemove", function (e) {
            const rect = parent.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            msArt.style.transform =
                "rotateY(" + dx * 8 + "deg) rotateX(" + -dy * 6 + "deg)";
        });

        parent.addEventListener("mouseleave", function () {
            msArt.style.transform = "";
        });
    }
    initMouseArtTilt();
});
