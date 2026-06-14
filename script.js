/**
 * 东方雅韵 - 作家个人网站交互脚本
 * 功能：动画效果、导航交互、筛选过滤、滚动视差
 * 无外部依赖，纯原生 JavaScript 实现
 */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. 导航栏滚动效果
    // =============================================
    const nav = document.getElementById('siteNav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 10);
        });
    }

    // =============================================
    // 1.5 顶部语言栏下拉切换
    // =============================================
    const langDropdown = document.getElementById('langDropdown');
    const langTrigger = document.getElementById('langTrigger');
    const langMenu = document.getElementById('langMenu');
    const currentLangEl = document.getElementById('currentLang');

    if (langTrigger && langDropdown) {
        langTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!langDropdown.contains(e.target)) {
                langDropdown.classList.remove('open');
            }
        });
        if (langMenu) {
            langMenu.querySelectorAll('.lang-option').forEach(option => {
                option.addEventListener('click', () => {
                    langMenu.querySelectorAll('.lang-option').forEach(o => o.classList.remove('active'));
                    option.classList.add('active');
                    if (currentLangEl) currentLangEl.textContent = option.textContent;
                    langDropdown.classList.remove('open');
                });
            });
        }
    }

    // =============================================
    // 2. 移动端菜单开关
    // =============================================
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });
        // 点击移动端导航链接后自动关闭菜单
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // =============================================
    // 3. 锚点链接平滑滚动
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // =============================================
    // 4. Intersection Observer — 元素入场渐显动画
    // =============================================
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObserver.observe(el));

    // =============================================
    // 5. 数据统计数字滚动动画
    // =============================================
    const statNums = document.querySelectorAll('.stat-item');
    let statsDone = false;

    function animateStats() {
        if (statsDone) return;
        statsDone = true;
        statNums.forEach(item => {
            const target = parseInt(item.dataset.count);
            const numEl = item.querySelector('.stat-num');
            if (!numEl) return;
            const duration = 2000;
            const start = performance.now();

            // 缓出指数函数，使数字增长更自然
            function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                const val = Math.round(easeOutExpo(progress) * target);
                numEl.textContent = target >= 1000 ? val.toLocaleString() : val;
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    // 当统计区域进入视口时触发数字动画
    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { animateStats(); }
        }, { threshold: 0.3 }).observe(statsSection);
    }

    // =============================================
    // 6. 书籍 / 文章筛选标签页
    // =============================================
    document.querySelectorAll('.filter-tabs').forEach(tabGroup => {
        const tabs = tabGroup.querySelectorAll('.filter-tab');
        const parentSection = tabGroup.closest('.section') || tabGroup.parentElement;
        const cards = parentSection.querySelectorAll('[data-category]');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 切换激活状态
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.dataset.filter;

                cards.forEach(card => {
                    const match = filter === 'all' || card.dataset.category === filter;
                    if (match) {
                        card.style.display = '';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        requestAnimationFrame(() => {
                            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        setTimeout(() => { card.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    });

    // =============================================
    // 7. 首屏背景视差滚动
    // =============================================
    const heroBg = document.querySelector('.hero-bg-img');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight) {
                heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
            }
        });
    }

    // =============================================
    // 8. 首屏墨点装饰
    // =============================================
    const hero = document.querySelector('.hero');
    if (hero) {
        for (let i = 0; i < 8; i++) {
            const dot = document.createElement('div');
            dot.className = 'ink-dot';
            dot.style.cssText = `
                position: absolute;
                width: ${3 + Math.random() * 5}px;
                height: ${3 + Math.random() * 5}px;
                background: rgba(28, 26, 22, ${0.08 + Math.random() * 0.12});
                border-radius: 50%;
                left: ${10 + Math.random() * 80}%;
                top: ${10 + Math.random() * 80}%;
                z-index: 1;
                pointer-events: none;
                animation: inkDot ${2 + Math.random() * 3}s ${Math.random() * 2}s ease forwards;
            `;
            hero.appendChild(dot);
        }
    }

    // =============================================
    // 9. 书籍卡片 3D 悬停倾斜效果
    // =============================================
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // =============================================
    // 10. 滚动时高亮当前导航链接
    // =============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(sec => {
                if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) link.classList.add('active');
            });
        });
    }

    // =============================================
    // 11. 首屏标题逐字入场动画
    // =============================================
    const heroBrush = document.querySelector('.hero-title-brush');
    if (heroBrush) {
        const text = heroBrush.textContent;
        heroBrush.innerHTML = '';
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(30px) scale(0.8);
                transition: opacity 0.6s ${0.8 + i * 0.12}s ease, transform 0.6s ${0.8 + i * 0.12}s cubic-bezier(0.16, 1, 0.3, 1);
            `;
            heroBrush.appendChild(span);
            // 延迟触发，使过渡动画生效
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0) scale(1)';
            }, 100);
        });
    }

});
