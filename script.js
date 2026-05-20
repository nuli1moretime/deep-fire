/**
 * AI + Combustion Lab - 页面核心交互脚本 (含电影级双语转场动效)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. 基础视觉交互（滚动监听与高亮转换）
    // ==========================================
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    const observerOptions = { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));


    // ==========================================
    // 2. 自动化中英文国际化语言包
    // ==========================================
    const langDict = {
        'zh': {
            'nav-about': '团队简介',
            'nav-news': '新闻动态',
            'nav-members': '成员介绍',
            'nav-papers': '发表论文',
            'nav-join': '招生计划',
            'hero-title': '用人工智能<br><span class="gradient-text">重构燃烧科学。</span>',
            'hero-desc': '我们致力于将深度学习、物理驱动神经网络（PINN）与先进燃烧数值模拟相结合，探索下一代高效、清洁的能源转化与安全防控技术。',
            'hero-btn': '探索前沿',
            'about-title': '团队简介',
            'about-content': '本课题组聚焦于“AI + 燃烧科学”的前沿交叉研究。传统燃烧科学依赖于复杂的化学动力学与高昂的计算流体力学（CFD）模拟。我们通过引入先进的 AI 算法（如算子网络、流场预测等），打破传统计算瓶颈，实现对复杂燃烧动力学、火焰传播及工程热物理问题的快速、高精度建模与智能优化。',
            'news-title': '新闻动态',
            'news-1-title': '物理驱动神经网络（PINN）三维热传导研究被顶级期刊接收',
            'news-1-desc': '通过引入空间几何对称性先验，成功将三维瞬态火灾流场预测速度提升三个数量级。',
            'news-2-title': '祝贺组内硕士研究生获得优秀毕业论文荣誉。',
            'news-2-desc': '其毕业设计探讨了基于傅里鱼算子网络（FNO）的垂直电缆燃烧数值加速算法。',
            'news-3-title': '课题组成功承办 AI 时代的工程热物理青年学者学术沙龙',
            'news-3-desc': '来自全球 20 余所高校的专家学者齐聚，共同探讨深度学习在燃烧动力学中的应用。',
            'members-title': '成员介绍',
            'pi-name': '导师姓名',
            'pi-title': '教授 / 博士生导师',
            'pi-bio': '主要研究方向为物理驱动深度学习、三维瞬态火灾流场预测及工程热物理智能优化。主持多项国家级科研项目，在 Combustion and Flame 等顶级期刊发表论文数十篇。',
            'tier-phd': '博士研究生',
            'phd-1-name': '成员 A',
            'phd-1-title': '2024级 博士生',
            'phd-2-name': '成员 B',
            'phd-2-title': '2025级 博士生',
            'tier-master': '硕士研究生',
            'm-1-name': '成员 C',
            'm-1-title': '2024级 硕士生',
            'm-2-name': '成员 D',
            'm-2-title': '2024级 硕士生',
            'm-3-name': '成员 E',
            'm-3-title': '2025级 硕士生',
            'm-4-name': '成员 F',
            'm-4-title': '2025级 硕士生',
            'papers-title': '发表论文',
            'join-title': '期待你的加入',
            'join-desc': '课题组每年招收博士研究生 1-2 名，硕士研究生 2-3 名。欢迎具有工程热物理、安全工程、计算机科学、应用数学等背景的同学联系报考。',
            'join-dir': '<strong>核心研究方向：</strong> 物理驱动深度学习（PINN/FNO）、复杂动力学高效燃烧模拟、火灾安全智能防控。',
            'join-contact': '联系方式：pi_email@university.edu.cn (邮件请附带个人简历及成绩单)'
        },
        'en': {
            'nav-about': 'About Us',
            'nav-news': 'News',
            'nav-members': 'Members',
            'nav-papers': 'Publications',
            'nav-join': 'Join Us',
            'hero-title': 'Reinventing Combustion Science <br><span class="gradient-text">with Artificial Intelligence.</span>',
            'hero-desc': 'We dedicate to combining deep learning, physics-informed neural networks (PINN) with advanced combustion numerical simulations to explore next-generation clean energy conversion and intelligent fire safety engineering.',
            'hero-btn': 'Explore More',
            'about-title': 'About the Lab',
            'about-content': 'Our group focuses on the frontier interdisciplinary research of "AI + Combustion Science". Traditional combustion science heavily relies on intricate chemical kinetics and computationally expensive Computational Fluid Dynamics (CFD) simulations. By introducing cutting-edge AI algorithms (such as operator networks and flow-field forecasting), we break traditional computational bottlenecks, achieving fast, high-fidelity modeling and intelligent optimization for complex combustion dynamics, flame propagation, and engineering thermophysics problems.',
            'news-title': 'News & Events',
            'news-1-title': 'Research on 3D Heat Conduction via PINN Accepted by Top-tier Journal',
            'news-1-desc': 'By introducing spatial geometric symmetry priors, the prediction speed of 3D transient fire flow fields was successfully accelerated by three orders of magnitude.',
            'news-2-title': 'Congratulations to the master \'s students in the group for receiving the Excellent Graduation Thesis award',
            'news-2-desc': 'The thesis explored accelerated numerical algorithms for vertical cable fires based on Fourier Neural Operators (FNO).',
            'news-3-title': 'Successfully Hosted the Engineering Thermophysics Young Scholars Academic Salon in the AI Era',
            'news-3-desc': 'Experts and scholars from over 20 universities worldwide gathered to discuss the deep learning applications in combustion dynamics.',
            'members-title': 'Team Members',
            'pi-name': 'Professor Name',
            'pi-title': 'Professor / Ph.D. Advisor',
            'pi-bio': 'Main research interests include physics-informed deep learning, 3D transient fire flow field prediction, and intelligent optimization of engineering thermophysics. Dr. Name has led multiple national research projects and published dozens of papers in top journals such as Combustion and Flame.',
            'tier-phd': 'Ph.D. Students',
            'phd-1-name': 'Member A',
            'phd-1-title': 'Class of 2024, Ph.D.',
            'phd-2-name': 'Member B',
            'phd-2-title': 'Class of 2025, Ph.D.',
            'tier-master': 'Master Students',
            'm-1-name': 'Member C',
            'm-1-title': 'Class of 2024, M.S.',
            'm-2-name': 'Member D',
            'm-2-title': 'Class of 2024, M.S.',
            'm-3-name': 'Member E',
            'm-3-title': 'Class of 2025, M.S.',
            'm-4-name': 'Member F',
            'm-4-title': 'Class of 2025, M.S.',
            'papers-title': 'Selected Publications',
            'join-title': 'Join Our Group',
            'join-desc': 'The lab recruits 1-2 Ph.D. students and 2-3 Master students annually. We sincerely welcome motivated candidates with backgrounds in Engineering Thermophysics, Safety Engineering, Computer Science, and Applied Mathematics to apply.',
            'join-dir': '<strong>Core Research:</strong> Physics-Informed Deep Learning (PINN/FNO), High-efficiency Combustion Simulation, Intelligent Fire Safety and Control.',
            'join-contact': 'Contact: pi_email@university.edu.cn (Please attach your CV and transcripts in the email)'
        }
    };

    let currentLang = localStorage.getItem('preferred-lang') || 'zh';
    const langBtn = document.getElementById('lang-btn');

    // 映射引擎（初始化时无动画，保持瞬开）
    function applyLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (langDict[lang][key]) {
                if (langDict[lang][key].includes('<')) {
                    el.innerHTML = langDict[lang][key];
                } else {
                    el.innerText = langDict[lang][key];
                }
            }
        });
        langBtn.innerText = lang === 'zh' ? 'EN' : '中文';
        localStorage.setItem('preferred-lang', lang);
    }

    // 初始化运行（无闪烁）
    applyLanguage(currentLang);

    // 🔴 拦截按钮点击：注入平滑异步动画
    langBtn.addEventListener('click', () => {
        // 1. 瞬间添加类名，触发全站 data-i18n 文本渐隐下沉
        document.body.classList.add('lang-switching');
        
        // 2. 在文本完全透明的完美时刻（250毫秒时），在后台静悄悄地把词换掉
        setTimeout(() => {
            currentLang = currentLang === 'zh' ? 'en' : 'zh';
            applyLanguage(currentLang);
            
            // 3. 换词完毕，撤销类名，全站文本以优雅的苹果曲线淡入并弹回原位
            document.body.classList.remove('lang-switching');
        }, 250);
    });
});
