import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { gsap } from "gsap";
import { useLanguage, LanguageSwitcher } from "../hooks/useLanguage.jsx";

const GoArrowUpRight = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    stroke-width="0"
    viewBox="0 0 24 24"
    class="nav-card-link-icon"
    aria-hidden="true"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M6 18L18 6M18 6v12M18 6H6"></path>
  </svg>
);

const CardNav = ({
  logo,
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor,
  buttonBgColor,
  buttonTextColor,
  children,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const { translate } = useLanguage();
  const lastScrollY = useRef(0);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);
  const desktopLinksRef = useRef(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 230;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content");
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        contentEl.offsetHeight;

        const topBar = 56;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 230;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 56, overflow: "visible" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        gsap.set(navEl, { overflow: "hidden" });
      },
      onReverseComplete: () => {
        gsap.set(navEl, { overflow: "visible" });
      },
    });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1"
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const collapseThreshold = window.innerHeight * 0.25; // 1/4 屏幕高度

          // 三阶段动画逻辑
          if (currentScrollY <= 0) {
            // 阶段1: 页面顶部 - 显示无背景导航栏
            setIsAtTop(true);
            setIsScrolling(false);
            setVisible(true);
          } else if (currentScrollY > 0 && currentScrollY <= 50) {
            // 阶段2: 开始滚动 - 显示完整导航栏
            setIsAtTop(false);
            setIsScrolling(true);
            setVisible(true);
          } else {
            // 阶段3: 继续滚动 - 根据滚动方向决定显示/隐藏
            setIsAtTop(false);
            setIsScrolling(true);

            if (currentScrollY > lastScrollY.current && currentScrollY > collapseThreshold) {
              setVisible(false);
            } else {
              setVisible(true);
            }
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i) => (el) => {
    if (el) cardsRef.current[i] = el;
  };



  // 构建CSS类名
  const getContainerClasses = () => {
    let classes = `card-nav-container ${className}`;

    if (isAtTop) {
      classes += ' at-top';
    } else if (isScrolling && visible) {
      classes += ' scrolling';
    } else if (!visible) {
      classes += ' hidden';
    }

    return classes;
  };

  return (
    <div class={getContainerClasses()}>
      <nav
        ref={navRef}
        class={`card-nav ${isExpanded ? "open" : ""}`}
      >
        <div class="card-nav-top">
          <div class="card-nav-left">
            <div
              class={`hamburger-menu ${isHamburgerOpen ? "open" : ""}`}
              onClick={toggleMenu}
              role="button"
              aria-label={isExpanded ? "Close menu" : "Open menu"}
              tabIndex={0}
              style={{ color: menuColor || "#000" }}
            >
              <div class="hamburger-line" />
              <div class="hamburger-line" />
            </div>
            <a href="/" class="logo-text">Chen</a>
          </div>

          <div class="card-nav-right-actions">
            <div class="desktop-nav-links">
              <a href="/blog">{translate('nav.blog')}</a>
              <a href="/about">{translate('nav.about')}</a>
            </div>
            <a href="/search" aria-label={translate('nav.search')} class="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </a>
            <LanguageSwitcher />
            {children}
          </div>
        </div>

        <div class="card-nav-content" aria-hidden={!isExpanded}>
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              class="nav-card"
              ref={setCardRef(idx)}
            >
              <div class="nav-card-label">{translate(`nav.${item.key}`) || item.label}</div>
              <div class="nav-card-links">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    class="nav-card-link"
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                  >
                    <GoArrowUpRight />
                    {translate(`navLinks.${lnk.key}`) || lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
