/**
 * Deep-Fire Lab - 页面核心交互与全站国际化语言包脚本
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
    // 2. Deep-Fire 课题组实名双语字典
    // ==========================================
    const langDict = {
        'zh': {
            'nav-about': '团队简介',
            'nav-news': '新闻动态',
            'nav-members': '成员介绍',
            'nav-papers': '发表论文',
            'nav-join': '招生计划',
            'hero-title': '用理论建模与 AI 平台<br><span class="gradient-text">深度重构火灾安全。</span>',
            'hero-desc': '依托中国科学技术大学火灾科学国家重点实验室，通过系列实验、理论建模与人工智能平台开发，深入探索商业复合材料的火灾行为与新型阻燃配方优化。',
            'hero-btn': '探索前沿',
            'about-title': '团队简介',
            'about-content': '本课题组（Deep-Fire）依托中国科学技术大学火灾科学国家重点实验室。我们致力于通过系列实验、理论建模与先进人工智能（AI）平台的交叉研发，实现对商业复合材料火灾行为的深度理解，并针对安全、清洁、低成本的阻燃材料进行智能配方优化，打破传统材料试错瓶颈，开拓下一代工业火灾安全防控技术。',
            'news-title': '新闻动态',
            'news-1-title': '研究突破：高压电弧下开关柜绝缘子阻燃配方研究发表于《Fire Technology》',
            'news-1-desc': '课题组深入探讨了高压电弧触发下绝缘材料的着火与自熄行为，成功优化了新型阻燃配方体系。',
            'news-2-title': '阻燃电缆火灾行为研究在《Fire Safety Journal》等顶刊连续发表',
            'news-2-desc': '博士生方倩等针对不同 ATH 含量的阻燃电缆，量化揭示了其在向上火焰传播过程中的溶胀、流动及内部传热机制。',
            'news-3-title': '课题组复合材料气泡破裂与炭化动力学耦合机制取得重要进展',
            'news-3-desc': '成功构建了定量耦合热解机制模型，为复合材料火灾演化预测提供了更精确的理论骨架。',
            'members-title': '成员介绍',
            'pi-name': '谢启源',
            'pi-title': '教授 / 博士生导师 · 中国科大火灾科学国家重点实验室',
            'pi-bio': '教授，博士生导师，美国北卡罗来纳大学访问学者。现任国际知名SCI期刊《Journal of Thermal Analysis and Calorimetry》副主编、中国消防协会防火材料分会副主任委员、中国运筹学会可靠性分会理事。作为项目负责人，主持科技部“十四五”国家重点研发计划课题、多项国家自然科学基金面上项目。长期致力于高聚物特殊燃烧、阻燃电缆引燃特性、高压电弧引燃及系统安全分析方法等方向。',
            'tier-phd': '博士研究生',
            'phd-1-name': '何灿星',
            'phd-1-title': '博士研究生 · 阻燃复合材料火焰传播机制',
            'phd-2-name': '方谦',
            'phd-2-title': '博士研究生 · 电缆火灾传热与热解模拟',
            'tier-master': '硕士研究生',
            'm-1-name': '刘羽琦',
            'm-1-title': '硕士研究生',
            'm-2-name': '朱宇喆',
            'm-2-title': '硕士研究生',
            'm-3-name': '邹红宇',
            'm-3-title': '硕士研究生',
            'm-4-name': '杜彦薇',
            'm-4-title': '硕士研究生',
            'papers-title': '发表论文',
            'join-title': '期待你的加入',
            'join-desc': '课题组（Deep-Fire Lab）每年在火灾科学国家重点实验室招收高水平博士研究生 1-2 名，硕士研究生 2-3 名。欢迎具有工程热物理、安全工程、工程力学、计算机科学与大数据应用数学等背景的同学联系报考。',
            'join-dir': '<strong>核心研究方向：</strong> 高聚物材料特殊燃烧蔓延机理、阻燃电缆引慢特性与检测技术、高压电弧引燃有机阻燃绝缘件、系统安全分析方法与优化设计、核电站危险源辨识与事故演化、安全文化与本质安全（结合实验、理论建模与 AI 平台开发）。',
            'join-contact': '联系方式：xqy@ustc.edu.cn (邮件请附带个人简历及本科/硕士成绩单)'
        },
        'en': {
            'nav-about': 'About Us',
            'nav-news': 'News',
            'nav-members': 'Members',
            'nav-papers': 'Publications',
            'nav-join': 'Join Us',
            'hero-title': 'Reinventing Fire Safety Engineering <br><span class="gradient-text">via Theoretical Modeling & AI.</span>',
            'hero-desc': 'Based at the State Key Laboratory of Fire Safety, USTC, we aim at the deep understanding of fire behaviors of commercial composites and the formula optimization of safe, clean, inexpensive fire-retardant materials through series of experiments, theoretical modeling and AI platform development.',
            'hero-btn': 'Explore Frontiers',
            'about-title': 'Research Group Mission',
            'about-content': 'The Deep-Fire Lab is located within the State Key Laboratory of Fire Safety at the University of Science and Technology of China (USTC). Our mission centers on achieving a profound understanding of the fire behaviors of commercial composites and optimizing the formulation of safe, clean, and inexpensive fire-retardant materials. By combining rigorous physical testing with theoretical coupling mechanisms and robust AI algorithms, we break traditional empirical limitations to advance international fire engineering and thermal safety barriers.',
            'news-title': 'Research Briefs',
            'news-1-title': 'Breakthrough on Fire Resistance of Insulators by High-Voltage Arcing Published in Fire Technology',
            'news-1-desc': 'The team deep-dived into ignition and self-sustained burning kinetics of switchgear insulators under arcing hazards, optimizing promising clean formula routes.',
            'news-2-title': 'FR-Cable Fire Behaviors Successively Featured in Fire Safety Journal & JTAC',
            'news-2-desc': 'PhD candidate Qian Fang and teammates quantitatively revealed the inner heat transfer, swelling, and flowing mechanism of cables under concurrent flame spread.',
            'news-3-title': 'Quantitative Coupling Pyrolysis Modeling for Degradation of Composites Made Major Headway',
            'news-3-desc': 'Successfully pioneered a coupling algorithm that accounts for bubbling, breaking, and charring kinetics during high-temperature degradation.',
            'members-title': 'Research Team',
            'pi-name': 'Qiyuan Xie',
            'pi-title': 'Professor / Ph.D. Advisor · State Key Laboratory of Fire Safety, USTC',
            'pi-bio': 'Full Professor at the University of Science and Technology of China (USTC) and former Visiting Scholar at the University of North Carolina (UNC). Dr. Xie currently serves as the Associate Editor of the *Journal of Thermal Analysis and Calorimetry*, Vice Chair of the Fire Retardant Materials Subcommittee of the China Fire Protection Association, and Board Member of the Reliability Subcommittee of the Operations Research Society of China. As Principal Investigator, he has spearheaded the Ministry of Science and Technology\'s "14th Five-Year" National Key R&D Program project and multiple National Natural Science Foundation of China (NSFC) grants. His research scopes polymer combustion mechanisms, FR cable evaluation technologies, and arc-induced ignition. ',
            'tier-phd': 'Ph.D. Candidates',
            'phd-1-name': 'Canxing He',
            'phd-1-title': 'Ph.D. Candidate · Flame spread mechanism of FR-composites',
            'phd-2-name': 'Qian Fang',
            'phd-2-title': 'Ph.D. Candidate · Cable fire heat transfer & pyrolysis kinetics',
            'tier-master': 'Master Candidates',
            'm-1-name': 'Yuqi Liu',
            'm-1-title': 'Master Candidate',
            'm-2-name': 'Yuzhe Zhu',
            'm-2-title': 'Master Candidate',
            'm-3-name': 'Hongyu Zou',
            'm-3-title': 'Master Candidate',
            'm-4-name': 'Yanwei Du',
            'm-4-title': 'Master Candidate',
            'papers-title': 'Selected Publications',
            'join-title': 'Recruitment & Openings',
            'join-desc': 'Deep-Fire Lab offers 1-2 Ph.D. fellowships and 2-3 Master student openings annually. Driven students with structural backgrounds in Engineering Thermophysics, Safety Engineering, Applied Mathematics, or Machine Learning are highly welcome to reach out.',
            'join-dir': '<strong>Core Directions:</strong> 1) Special combustion and flame spread mechanisms of polymer materials; 2) Ignition characteristics and detection technologies of FR cables; 3) High-voltage arcing-induced ignition of organic FR insulators; 4) System safety analysis methods and optimization design; 5) Hazard identification and accident evolution in nuclear power plants; 6) Safety culture and inherent safety (integrated via advanced AI platform developments).',
            'join-contact': 'Inquiries: xqy@ustc.edu.cn (Please forward your academic CV and transcripts directly)'
        }
    };

    let currentLang = localStorage.getItem('preferred-lang') || 'zh';
    const langBtn = document.getElementById('lang-btn');

    // 映射解析核心（完全脱离 ID 绑定）
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

    // 初始化运行
    applyLanguage(currentLang);

    // 绑定异步柔和过渡动效
    langBtn.addEventListener('click', () => {
        document.body.classList.add('lang-switching');
        setTimeout(() => {
            currentLang = currentLang === 'zh' ? 'en' : 'zh';
            applyLanguage(currentLang);
            document.body.classList.remove('lang-switching');
        }, 250);
    });
});
