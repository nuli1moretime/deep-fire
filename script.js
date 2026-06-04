/* ============================================================
   Canvas fire system — realistic ember physics
   ============================================================ */
(function() {
  var canvas = document.getElementById('ember-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, dpr = window.devicePixelRatio || 1;

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = rect.width * dpr;
    H = canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);
    W = rect.width;
    H = rect.height;
  }
  function updateBounds() { bottomLine = H * BOTTOM_RATIO; }
  resize();
  updateBounds();
  window.addEventListener('resize', function() { resize(); updateBounds(); setTimeout(buildCoals, 100); });

  // ---- Bottom confinement zone ----
  var BOTTOM_RATIO = 0.55;
  var bottomLine = H * BOTTOM_RATIO;

  // ---- Ember particle system with physics ----
  var embers = [];
  var MAX_EMBERS = 40;
  var SPAWN_LINE = 0.88;

  function spawnEmber() {
    return {
      x: Math.random() * W,
      y: H - Math.random() * (H - bottomLine) * 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.6 + 0.15),
      size: Math.random() * 2.8 + 1.2,
      life: 0,
      maxLife: Math.floor(Math.random() * 80 + 50),
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleFreq: Math.random() * 0.05 + 0.02,
      wobbleAmp: Math.random() * 15 + 8,
      startHue: Math.random() * 15 + 30,
      startLight: Math.random() * 12 + 72,
      endHue: Math.random() * 15 + 5,
      endLight: Math.random() * 8 + 12,
      glowSize: 0,
      trail: [],
    };
  }

  for (var i = 0; i < MAX_EMBERS * 0.7; i++) {
    var e = spawnEmber();
    e.y = H - Math.random() * (H - bottomLine) * 0.6;
    e.life = Math.random() * e.maxLife;
    e.vy = -(Math.random() * 0.4 + 0.08);
    embers.push(e);
  }

  // ---- Coal bed ----
  var coals = [];

  function buildCoals() {
    coals = [];
    for (var i = 0; i < 30; i++) {
      coals.push({
        x: Math.random() * W,
        y: H - Math.random() * 12 - 2,
        size: Math.random() * 12 + 5,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.04 + 0.008,
        baseBright: Math.random() * 0.3 + 0.25,
        hue: Math.random() * 25 + 8,
        sat: 85 + Math.random() * 15,
        lightBase: Math.random() * 18 + 35,
      });
    }
    for (var i = 0; i < 12; i++) {
      coals.push({
        x: W * 0.25 + Math.random() * W * 0.5,
        y: H - Math.random() * 8 - 1,
        size: Math.random() * 16 + 7,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.01,
        baseBright: Math.random() * 0.3 + 0.35,
        hue: Math.random() * 20 + 10,
        sat: 90 + Math.random() * 10,
        lightBase: Math.random() * 20 + 40,
      });
    }
  }
  buildCoals();

  // ---- Sparks ----
  var sparks = [];

  function spawnSpark() {
    var angle = -Math.PI * Math.random() * 0.5 - Math.PI * 0.25;
    var speed = Math.random() * 6 + 3;
    return {
      x: Math.random() * W,
      y: H - Math.random() * 15 - 5,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: Math.floor(Math.random() * 18 + 8),
      size: Math.random() * 2 + 0.5,
    };
  }

  // ---- Flame lick helpers ----
  function drawFlame(cx, baseY, height, width, t, phase, speed) {
    var flicker = Math.sin(t * speed + phase) * 0.25 +
                  Math.sin(t * speed * 1.7 + phase * 1.3) * 0.15 + 0.6;
    var sway = Math.sin(t * speed * 0.4 + phase * 0.7) * 12;
    var fh = height * flicker;
    if (fh < 5) return;

    var grad = ctx.createRadialGradient(
      cx + sway, baseY - fh * 0.4, 0,
      cx + sway, baseY - fh * 0.4, fh * 1.1
    );
    grad.addColorStop(0, 'hsla(40, 100%, 80%, 0.12)');
    grad.addColorStop(0.3, 'hsla(30, 100%, 60%, 0.08)');
    grad.addColorStop(0.6, 'hsla(20, 100%, 40%, 0.04)');
    grad.addColorStop(1, 'hsla(10, 100%, 25%, 0)');

    ctx.beginPath();
    ctx.moveTo(cx + sway - width * 0.4, baseY);
    ctx.quadraticCurveTo(
      cx + sway - width * 0.3, baseY - fh * 0.6,
      cx + sway, baseY - fh
    );
    ctx.quadraticCurveTo(
      cx + sway + width * 0.3, baseY - fh * 0.6,
      cx + sway + width * 0.4, baseY
    );
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // ---- Main animation loop ----
  var time = 0;

  function tick() {
    time++;
    ctx.clearRect(0, 0, W, H);

    // ── 1. Flame licks (bottom layer) ──
    var flamePositions = [
      W * 0.1, W * 0.25, W * 0.35, W * 0.5,
      W * 0.6, W * 0.72, W * 0.82, W * 0.92
    ];
    for (var i = 0; i < flamePositions.length; i++) {
      drawFlame(
        flamePositions[i], H,
        18 + Math.sin(i * 2.3 + time * 0.005) * 8 + 8,
        14 + Math.sin(i * 1.7 + time * 0.008) * 4,
        time, i * 1.1, 0.025 + i * 0.002
      );
    }

    // ── 2. Ember bed — glowing coals ──
    for (var i = 0; i < coals.length; i++) {
      var c = coals[i];
      var bright = Math.sin(time * c.speed + c.phase) * 0.25 + 0.75;
      var alpha = c.baseBright * bright * 0.7;
      var light = c.lightBase + Math.sin(time * c.speed * 0.7 + c.phase * 1.2) * 12;

      var grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size * bright);
      grad.addColorStop(0, 'hsla(' + c.hue + ', ' + c.sat + '%, ' + (light + 20) + '%, ' + (alpha * 0.9) + ')');
      grad.addColorStop(0.5, 'hsla(' + (c.hue - 5) + ', ' + (c.sat - 10) + '%, ' + light + '%, ' + (alpha * 0.5) + ')');
      grad.addColorStop(1, 'hsla(' + (c.hue - 10) + ', ' + c.sat + '%, ' + (light - 20) + '%, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * bright * 1.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── 3. Ember particles ──
    for (var i = 0; i < embers.length; i++) {
      var e = embers[i];
      var progress = e.life / e.maxLife;
      if (progress >= 1) continue;

      var brightness = Math.sin(progress * Math.PI) * 0.8 + 0.2;
      var sizeScale = progress < 0.6 ? 1 : 1 - (progress - 0.6) / 0.4 * 0.7;
      var displaySize = e.size * sizeScale;
      if (displaySize < 0.3) continue;

      var hue = e.startHue + (e.endHue - e.startHue) * progress;
      var light = e.startLight - (e.startLight - e.endLight) * Math.pow(progress, 1.3);
      var sat = 85 + progress * 10;
      var alpha = brightness * 0.85;

      var wobX = Math.sin(time * e.wobbleFreq + e.wobblePhase) * e.wobbleAmp * progress;

      var glowR = displaySize * (3 + Math.sin(progress * 8) * 2);
      if (glowR > 0.5) {
        var g = ctx.createRadialGradient(
          e.x + wobX, e.y, 0,
          e.x + wobX, e.y, glowR
        );
        g.addColorStop(0, 'hsla(' + hue + ', ' + sat + '%, ' + (light + 10) + '%, ' + (alpha * 0.4) + ')');
        g.addColorStop(0.5, 'hsla(' + hue + ', ' + sat + '%, ' + light + '%, ' + (alpha * 0.15) + ')');
        g.addColorStop(1, 'hsla(' + hue + ', ' + sat + '%, ' + (light - 20) + '%, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.x + wobX, e.y, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = 'hsla(' + hue + ', ' + sat + '%, ' + light + '%, ' + alpha + ')';
      ctx.beginPath();
      ctx.arc(e.x + wobX, e.y, displaySize, 0, Math.PI * 2);
      ctx.fill();

      if (progress < 0.4 && displaySize > 1.5) {
        ctx.fillStyle = 'hsla(45, 100%, 95%, ' + (alpha * 0.6 * (1 - progress / 0.4)) + ')';
        ctx.beginPath();
        ctx.arc(e.x + wobX, e.y, displaySize * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      var buoyancy = 1 - progress * 0.7;
      e.vy -= 0.02 * buoyancy;
      e.vx *= 0.995;
      e.vy *= 0.998;
      var wind = Math.sin(time * 0.003 + e.y * 0.005) * 0.08;
      e.vx += wind * 0.01;
      e.x += e.vx + wind * 0.3;
      e.y += e.vy;

      e.life++;

      if (e.y < bottomLine) {
        Object.assign(e, spawnEmber());
        e.y = H - Math.random() * (H - bottomLine) * 0.3;
      }

      if (e.life >= e.maxLife || e.x < -50 || e.x > W + 50) {
        Object.assign(e, spawnEmber());
      }
    }

    // ── 4. Sparks ──
    if (Math.random() < 0.06 && sparks.length < 8) {
      sparks.push(spawnSpark());
    }

    for (var i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i];
      var sp = s.life / s.maxLife;
      if (sp >= 1) { sparks.splice(i, 1); continue; }

      var sa = 1 - sp;
      var ss = s.size * (1 - sp * 0.7);

      ctx.fillStyle = 'hsla(45, 100%, 90%, ' + sa * 0.9 + ')';
      ctx.beginPath();
      ctx.arc(s.x, s.y, ss, 0, Math.PI * 2);
      ctx.fill();

      if (ss > 0.5) {
        ctx.fillStyle = 'hsla(35, 100%, 60%, ' + sa * 0.3 + ')';
        ctx.beginPath();
        ctx.arc(s.x, s.y, ss * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.08;
      s.vx *= 0.97;
      s.life++;
    }

    requestAnimationFrame(tick);
  }

  tick();
})();

/* ============================================================
   News carousel controller
   ============================================================ */
(function() {
  var track = document.querySelector('.news-carousel-track');
  var dots = document.querySelectorAll('.news-dot');
  var prevBtn = document.getElementById('news-prev');
  var nextBtn = document.getElementById('news-next');
  var curSpan = document.getElementById('news-cur');
  var totalSpan = document.getElementById('news-total');
  if (!track) return;
  var slides = track.children;
  var total = slides.length;
  var current = 0;

  if (totalSpan) totalSpan.textContent = String(total).padStart(2, '0');

  function goTo(index) {
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;
    current = index;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    if (curSpan) curSpan.textContent = String(current + 1).padStart(2, '0');
    if (prevBtn) prevBtn.disabled = current <= 0;
    if (nextBtn) nextBtn.disabled = current >= total - 1;
    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });
  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      goTo(parseInt(this.getAttribute('data-index')));
    });
  });

  goTo(0);
})();

/* ============================================================
   Chinese / English language switcher
   ============================================================ */
(function() {
  var langDict = {
    'zh': {
      'nav-about': '团队简介',
      'nav-news': '新闻动态',
      'nav-members': '成员介绍',
      'nav-papers': '发表论文',
      'nav-join': '招生计划',
      'label-approach': '研究方向',
      'dir-1-title': '阻燃电缆火蔓延研究',
      'dir-1-desc': '揭示电缆火焰竖直向上传播的宏观机理与关键影响因素，为电缆防火设计提供理论基础。',
      'dir-1-tag': '火蔓延机制 · 电缆火灾安全',
      'dir-2-title': '微观热解与鼓泡碳化',
      'dir-2-desc': '探究多组分材料在高温下的热解行为、气体鼓泡动力学及膨胀成炭的耦合发展过程。',
      'dir-2-tag': '热解机理 · 鼓泡 · 成炭',
      'dir-3-title': 'AI 阻燃配方优化',
      'dir-3-desc': '突破传统"乱枪打鸟"试错模式，基于耦合阻燃机理实现"有的放矢"的智能阻燃配方预测。',
      'dir-3-tag': 'AI 预测 · 阻燃配方',
      'hero-badge': '火灾科学国家重点实验室 · USTC',
      'hero-title-line1': '深入认识火灾演化机制',
      'hero-title-line2': '构筑你我安全美好生活',
      'hero-desc': '面向火灾安全防控关键，聚焦新材料与新场景的火灾动力学演化机制和防控核心技术，致力于基础科研与工程应用的有机合一。',
      'about-title': '团队简介',
      'about-p1': 'Deep-Fire Lab 隶属于中国科学技术大学火灾科学国家重点实验室（SKLFS）。课题组以跨学科视角整合实验燃烧诊断、理论建模与人工智能平台开发，致力于揭示商用复合材料在真实火灾场景下的热解、引燃及火蔓延机理。',
      'about-p2': '我们提出"理论建模 + AI 平台"双轮驱动的方法论，突破传统"试错"实验模式的瓶颈，针对安全、清洁、低成本的阻燃材料进行智能配方优化，为火灾安全工程提供可量化的预测工具与设计准则。',
      'news-title': '新闻动态',
      'news-1-title': '开关柜绝缘阻燃配方研究发表于 <em>Fire Technology</em>',
      'news-1-desc': '课题组关于高压电弧作用下开关柜绝缘材料阻燃配方的研究被 <em>Fire Technology</em> 接收发表。系统评估了不同阻燃配方在高压电弧引燃条件下的耐火性能。',
      'news-2-title': '阻燃电缆火蔓延行为研究发表于 <em>Fire Safety Journal</em>',
      'news-2-desc': '博士研究生方谦为第一作者的研究发表于 <em>Fire Safety Journal</em>，定量揭示了不同 ATH 含量电缆在火蔓延过程中的膨胀、流动与内部传热机制。',
      'news-3-title': '气泡破裂与成炭动力学耦合模型取得进展',
      'news-3-desc': '课题组建立了定量耦合热解机理模型，实现了对复合材料中气泡破裂与成炭动力学行为的预测，为提升火灾演化预测精度提供了理论基础。',
      'members-title': '成员介绍',
      'pi-name': '谢启源',
      'pi-role': '博士生导师 · 火灾安全全国重点实验室教授',
      'pi-bio': '担任科技部国家重点研发计划“基础科研条件与重大科学仪器设备研发”重点专项总体专家组成员、中国消防协会防火材料分会副主任委员、国际热分析期刊JTAC副主编等。主要研究兴趣:（阻燃电缆等）阻燃聚合材料的燃烧机制与优化设计、高压电弧成灾机制及安全文化等。',
      'pi-tag-1': '安徽省科学技术一等奖',
      'pi-tag-2': '国家电网科技进步一等奖',
      'tier-phd': '博士研究生',
      'phd-1-name': '何灿星',
      'phd-1-label': '博士研究生',
      'phd-1-topic': '阻燃复合材料火蔓延机理研究',
      'phd-2-name': '方谦',
      'phd-2-label': '博士研究生',
      'phd-2-topic': '电缆火灾传热与热解建模',
      'tier-master': '硕士研究生',
      'm-1-name': '刘羽琦',
      'm-1-label': '硕士研究生',
      'm-2-name': '朱宇喆',
      'm-2-label': '硕士研究生',
      'm-3-name': '邹红宇',
      'm-3-label': '硕士研究生',
      'm-4-name': '杜彦薇',
      'm-4-label': '硕士研究生',
      'm-5-name': '石银领',
      'm-5-label': '硕士研究生',
      'm-6-name': '金志勇',
      'm-6-label': '硕士研究生',
      'm-7-name': '张洋',
      'm-7-label': '硕士研究生',
      'papers-title': '发表论文',
      'papers-more': '阅读更多论文',
      'join-title': '招生计划',
      'join-card-phd-title': '博士研究生',
      'join-card-phd-slots': '1–2 名',
      'join-card-phd-desc': '每年招收 1–2 名博士研究生，从事聚合物燃烧机理、电缆火灾安全、AI 驱动阻燃配方优化等前沿研究。',
      'join-card-ms-title': '硕士研究生',
      'join-card-ms-slots': '2–3 名',
      'join-card-ms-desc': '每年招收 2–3 名硕士研究生，欢迎具有以下学科背景的同学申请。',
      'join-disc-1': '工程热物理',
      'join-disc-2': '安全科学与工程',
      'join-disc-3': '工程力学',
      'join-disc-4': '计算机科学',
      'join-disc-5': '应用数学',
      'join-contact-title': '欢迎有志于火灾安全研究的同学加入！请将个人简历及本科/硕士成绩单发送至：',
      'footer-ustc': '中国科学技术大学',
    },
    'en': {
      'nav-about': 'About',
      'nav-news': 'News',
      'nav-members': 'Members',
      'nav-papers': 'Publications',
      'nav-join': 'Join Us',
      'label-approach': 'Research Areas',
      'dir-1-title': 'Upward Flame Spread of FR Cables',
      'dir-1-desc': 'Revealing the macroscopic mechanisms and key influencing factors of vertical flame propagation along cables, providing theoretical foundations for cable fire protection design.',
      'dir-1-tag': 'Flame Spread · Cable Fire Safety',
      'dir-2-title': 'Micro-Pyrolysis & Bubbling/Charring',
      'dir-2-desc': 'Investigating high-temperature pyrolysis behavior, gas bubble kinetics, and the coupled swelling-charring development of multicomponent materials.',
      'dir-2-tag': 'Pyrolysis · Bubbling · Charring',
      'dir-3-title': 'AI-Driven Formulation Optimization',
      'dir-3-desc': 'Breaking the conventional trial-and-error approach to achieve targeted, mechanism-informed intelligent prediction of flame-retardant formulations.',
      'dir-3-tag': 'AI Prediction · FR Formulations',
      'hero-badge': 'State Key Laboratory of Fire Safety · USTC',
      'hero-title-line1': 'Advancing Fire Evolution Understanding',
      'hero-title-line2': 'for a Safer and More Beautiful Life',
      'hero-desc': 'Advancing fire safety through research on fire dynamics evolution and protection technologies for novel materials and emerging scenarios, bridging fundamental research with engineering applications.',
      'about-title': 'About the Lab',
      'about-p1': 'Deep-Fire Lab is based at the State Key Laboratory of Fire Safety (SKLFS), University of Science and Technology of China. Our interdisciplinary approach combines experimental combustion diagnostics, theoretical modeling, and AI platform development to reveal the pyrolysis, ignition, and flame spread mechanisms of commercial composite materials in real-world fire scenarios.',
      'about-p2': 'We propose a dual-drive methodology of "theoretical modeling + AI platform" to break the bottleneck of traditional trial-and-error experimentation, enabling intelligent optimization of safe, clean, and low-cost flame-retardant formulations, while providing quantifiable predictive tools and design criteria for fire safety engineering.',
      'news-title': 'Research News',
      'news-1-title': 'FR insulation for switchgears published in <em>Fire Technology</em>',
      'news-1-desc': 'The team\u2019s research on flame-retardant formulations for switchgear insulator materials under high-voltage arcing has been accepted by <em>Fire Technology</em>, systematically evaluating the fire resistance of different formulations.',
      'news-2-title': 'FR cable fire spread study featured in <em>Fire Safety Journal</em>',
      'news-2-desc': 'PhD candidate Qian Fang\u2019s first-author study published in <em>Fire Safety Journal</em> quantitatively reveals the swelling, flow, and internal heat transfer mechanisms of cables with varying ATH content during flame spread.',
      'news-3-title': 'Bubble-cracking-charring coupling model milestone',
      'news-3-desc': 'The lab established a quantitatively coupled pyrolysis mechanism model that predicts bubble rupture and charring kinetics in composites, providing a theoretical foundation for improved fire evolution prediction accuracy.',
      'members-title': 'Research Team',
      'pi-name': 'Prof. Qiyuan Xie',
      'pi-role': 'Ph.D. Advisor \u00b7 State Key Laboratory of Fire Safety, USTC',
      'pi-bio': 'He serves as a member of the General Expert Panel for the National Key R&D Program\u2019s “Basic Research Infrastructure and Major Scientific Instrumentation R&D” project under the Ministry of Science and Technology, Vice Chair of the Fire-Retardant Materials Branch of the China Fire Protection Association, and Associate Editor of the Journal of Thermal Analysis (JTAC).His primary research interests include the combustion mechanisms and optimized design of flame-retardant polymer materials (such as flame-retardant cables), the mechanisms of high-voltage arc-induced fires, and safety culture.',
      'pi-tag-1': 'The First Prize for Science and Technology from Anhui Province',
      'pi-tag-2': 'The First Prize for Scientific and Technological Progress from State Grid Corporation of China',
      'tier-phd': 'Ph.D. Candidates',
      'phd-1-name': 'Canxing He',
      'phd-1-label': 'Ph.D. Candidate',
      'phd-1-topic': 'Flame spread mechanism of FR composites',
      'phd-2-name': 'Qian Fang',
      'phd-2-label': 'Ph.D. Candidate',
      'phd-2-topic': 'Cable fire heat transfer &amp; pyrolysis kinetics',
      'tier-master': 'Master Candidates',
      'm-1-name': 'Yuqi Liu',
      'm-1-label': 'Master Candidate',
      'm-2-name': 'Yuzhe Zhu',
      'm-2-label': 'Master Candidate',
      'm-3-name': 'Hongyu Zou',
      'm-3-label': 'Master Candidate',
      'm-4-name': 'Yanwei Du',
      'm-4-label': 'Master Candidate',
      'm-5-name': 'Yinling Shi',
      'm-5-label': 'Master Candidate',
      'm-6-name': 'Zhiyong Jin',
      'm-6-label': 'Master Candidate',
      'm-7-name': 'Yang Zhang',
      'm-7-label': 'Master Candidate',
      'papers-title': 'Selected Publications',
      'papers-more': 'View All Publications',
      'join-title': 'Recruitment & Openings',
      'join-card-phd-title': 'Ph.D. Positions',
      'join-card-phd-slots': '1\u20132 Openings',
      'join-card-phd-desc': '1\u20132 Ph.D. positions open annually for cutting-edge research in polymer combustion mechanisms, cable fire safety, and AI-driven FR formulation optimization.',
      'join-card-ms-title': 'Master Positions',
      'join-card-ms-slots': '2\u20133 Openings',
      'join-card-ms-desc': '2\u20133 Master positions open annually. Students with backgrounds in the following disciplines are encouraged to apply.',
      'join-disc-1': 'Engineering Thermophysics',
      'join-disc-2': 'Safety Science &amp; Engineering',
      'join-disc-3': 'Engineering Mechanics',
      'join-disc-4': 'Computer Science',
      'join-disc-5': 'Applied Mathematics',
      'join-contact-title': 'Interested candidates should send their CV and transcripts to:',
      'footer-ustc': 'USTC',
    }
  };

  // Default to English
  var currentLang = 'en';
  var langBtn = document.getElementById('lang-btn');

  function applyLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (langDict[lang] && langDict[lang][key]) {
        var val = langDict[lang][key];
        if (val.indexOf('<') !== -1) {
          el.innerHTML = val;
        } else {
          el.innerText = val;
        }
      }
    });
    if (langBtn) langBtn.innerText = lang === 'zh' ? 'EN' : '中文';
  }

  // Initialize
  applyLanguage(currentLang);

  // Bind toggle with text-only float animation — no white flash, no jitter
  if (langBtn) {
    langBtn.addEventListener('click', function() {
      var targets = document.querySelectorAll('[data-i18n]');

      // Remove .anim-up so animation-fill-mode stops blocking transitions
      targets.forEach(function(el) { el.classList.remove('anim-up', 'anim-d1', 'anim-d2', 'anim-d3', 'anim-d4'); });

      // Float out — each text element independently
      targets.forEach(function(el) { el.classList.add('lang-exit'); });

      setTimeout(function() {
        // Swap text while elements are in float-out state
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        applyLanguage(currentLang);

        // Float in — smoothly reverse the transform+opacity
        targets.forEach(function(el) { el.classList.remove('lang-exit'); });
      }, 280);
    });
  }
})();

/* ============================================================
   Scroll-reveal observer
   ============================================================ */
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.section, .section-alt, .member-pi, .member-card, .news-slide, .pub-item, .recruit-card, .contact-box')
    .forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.55s ease-out, transform 0.55s ease-out';
      observer.observe(el);
    });
})();

/* ============================================================
   Keyboard scroll navigation — Up/Down arrows scroll between sections
   ============================================================ */
(function() {
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('.hero, .section, .section-alt')
  );
  document.addEventListener('keydown', function(e) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      var cur = sections.findIndex(function(s) {
        var r = s.getBoundingClientRect();
        return r.top >= -1 && r.top < window.innerHeight - 100;
      });
      if (cur >= 0 && cur < sections.length - 1) {
        sections[cur + 1].scrollIntoView({ behavior: 'smooth' });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      var curIdx = -1;
      for (var i = sections.length - 1; i >= 0; i--) {
        var r = sections[i].getBoundingClientRect();
        if (r.top < window.innerHeight - 100 && r.top >= -1) {
          curIdx = i;
          break;
        }
      }
      if (curIdx > 0) {
        sections[curIdx - 1].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
})();
