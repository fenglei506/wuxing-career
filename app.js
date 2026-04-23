/**
 * 主应用逻辑
 * 五行八卦职业命理分析网页
 */

document.addEventListener('DOMContentLoaded', function() {
    // 诊断：检查库加载状态
    console.log('=== 库加载状态检查 ===');
    console.log('Solar:', typeof window.Solar);
    console.log('Lunar:', typeof window.Lunar);
    console.log('LunarConverter:', typeof window.LunarConverter);
    console.log('BaziEngine:', typeof window.BaziEngine);
    console.log('CareerEngine:', typeof window.CareerEngine);
    
    if (typeof window.Solar === 'undefined') {
        alert('农历库加载失败！请刷新页面或检查网络。');
        return;
    }
    
    // 初始化下拉选项
    initSelectOptions();
    
    // 监听表单变化
    listenFormChanges();
    
    // 绑定事件
    bindEvents();
    
    // 初始化日期类型切换
    initDateTypeSwitch();
});

/**
 * 初始化日期类型切换
 */
function initDateTypeSwitch() {
    const dateTypeSelect = document.getElementById('dateType');
    const yearSelect = document.getElementById('birthYear');
    
    // 农历年份选项（显示干支年）
    function updateYearOptions(isLunar) {
        yearSelect.innerHTML = '<option value="">请选择</option>';
        for (let y = 2010; y >= 1950; y--) {
            if (isLunar) {
                const gz = LunarConverter.getLunarYearPillar(y);
                yearSelect.innerHTML += `<option value="${y}">${y}年 (${gz.name})</option>`;
            } else {
                yearSelect.innerHTML += `<option value="${y}">${y}年</option>`;
            }
        }
    }
    
    // 初始加载阳历年份
    updateYearOptions(false);
    
    // 切换时更新
    dateTypeSelect.addEventListener('change', function() {
        const isLunar = this.value === 'lunar';
        updateYearOptions(isLunar);
        // 更新提示文字
        const tip = document.querySelector('.input-section p');
        if (tip) {
            tip.textContent = isLunar ? '请输入农历（阴历）出生日期' : '支持阳历或农历输入，任选其一即可';
        }
    });
}

/**
 * 初始化下拉选项
 */
function initSelectOptions() {
    // 年份：1950-2010
    const yearSelect = document.getElementById('birthYear');
    for (let y = 2010; y >= 1950; y--) {
        yearSelect.innerHTML += `<option value="${y}">${y}年</option>`;
    }
    
    // 月份
    const monthSelect = document.getElementById('birthMonth');
    for (let m = 1; m <= 12; m++) {
        monthSelect.innerHTML += `<option value="${m}">${m}月</option>`;
    }
    
    // 日期（默认31天，会根据月份动态调整）
    const daySelect = document.getElementById('birthDay');
    updateDayOptions(1, 31);
}

/**
 * 更新日期选项
 */
function updateDayOptions(minDay, maxDay) {
    const daySelect = document.getElementById('birthDay');
    daySelect.innerHTML = '<option value="">请选择</option>';
    for (let d = 1; d <= maxDay; d++) {
        daySelect.innerHTML += `<option value="${d}">${d}日</option>`;
    }
}

/**
 * 监听表单变化
 */
function listenFormChanges() {
    const yearSelect = document.getElementById('birthYear');
    const monthSelect = document.getElementById('birthMonth');
    const daySelect = document.getElementById('birthDay');
    const hourSelect = document.getElementById('birthHour');
    const genderSelect = document.getElementById('gender');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    // 月份变化时调整日期选项
    monthSelect.addEventListener('change', function() {
        const month = parseInt(this.value);
        if (month) {
            const maxDay = getMaxDayOfMonth(month, parseInt(yearSelect.value) || 2000);
            updateDayOptions(1, maxDay);
        }
    });
    
    // 检查所有字段是否填写完整
    function checkFormComplete() {
        const complete = yearSelect.value && monthSelect.value && 
                        daySelect.value && hourSelect.value && genderSelect.value;
        analyzeBtn.disabled = !complete;
    }
    
    yearSelect.addEventListener('change', checkFormComplete);
    monthSelect.addEventListener('change', checkFormComplete);
    daySelect.addEventListener('change', checkFormComplete);
    hourSelect.addEventListener('change', checkFormComplete);
    genderSelect.addEventListener('change', checkFormComplete);
}

/**
 * 获取月份最大天数
 */
function getMaxDayOfMonth(month, year, isLunar = false) {
    if (isLunar) {
        // 农历月份天数
        return LunarConverter.getLunarMonthDays ? 30 : 29;
    }
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let maxDay = daysPerMonth[month - 1];
    
    // 闰年2月
    if (month === 2 && isLeapYear(year)) {
        maxDay = 29;
    }
    
    return maxDay;
}

/**
 * 判断闰年
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 分析按钮
    document.getElementById('analyzeBtn').addEventListener('click', startAnalysis);
    
    // 支付按钮
    document.getElementById('paymentBtn').addEventListener('click', showPaymentModal);
    
    // 支付完成按钮
    document.getElementById('confirmPaymentBtn').addEventListener('click', showFullReport);
    
    // 关闭弹窗
    document.getElementById('closeModal').addEventListener('click', hidePaymentModal);
    
    // 点击弹窗外部关闭
    document.getElementById('paymentModal').addEventListener('click', function(e) {
        if (e.target === this) hidePaymentModal();
    });
}

/**
 * 开始分析
 */
function startAnalysis() {
    try {
        console.log('=== startAnalysis 开始 ===');
        
        const dateType = document.getElementById('dateType').value;
        const year = parseInt(document.getElementById('birthYear').value);
        const month = parseInt(document.getElementById('birthMonth').value);
        const day = parseInt(document.getElementById('birthDay').value);
        const hour = parseInt(document.getElementById('birthHour').value);
        const gender = document.getElementById('gender').value;
        
        console.log('输入参数:', {dateType, year, month, day, hour, gender});
        
        // 检查库是否加载
        if (typeof LunarConverter === 'undefined') {
            alert('错误：LunarConverter未加载！');
            return;
        }
        if (typeof BaziEngine === 'undefined') {
            alert('错误：BaziEngine未加载！');
            return;
        }
        if (typeof CareerEngine === 'undefined') {
            alert('错误：CareerEngine未加载！');
            return;
        }
        
        // 根据日期类型转换为阳历
        let solarYear, solarMonth, solarDay;
        let lunarInfo = null;
        let solarInfo = null;
        
        if (dateType === 'lunar') {
            // 农历输入，转换为阳历
            const solar = LunarConverter.lunarToSolar(year, month, day);
            solarYear = solar.year;
            solarMonth = solar.month;
            solarDay = solar.day;
            lunarInfo = { year, month, day, name: LunarConverter.getLunarYearPillar(year).name + ' ' + month + '月' + day + '日' };
        solarInfo = { year: solarYear, month: solarMonth, day: solarDay, name: solarYear + '年' + solarMonth + '月' + solarDay + '日' };
    } else {
        // 阳历输入，转换为农历
        solarYear = year;
        solarMonth = month;
        solarDay = day;
        const lunar = LunarConverter.solarToLunar(year, month, day);
        lunarInfo = { year: lunar.year, month: lunar.month, day: lunar.day, name: lunar.fullName };
        solarInfo = { year, month, day, name: year + '年' + month + '月' + day + '日' };
    }
    
    // 显示加载
    showLoading();
    
    // 执行计算（使用阳历日期）
    setTimeout(() => {
        try {
            // 八字排盘
            const bazi = BaziEngine.getFullBazi(solarYear, solarMonth, solarDay, hour);
            
            // 五行统计
            const elements = BaziEngine.countElements(bazi);
            
            // 身强弱分析
            const strength = BaziEngine.analyzeStrength(bazi, elements);
            
            // 职业分析
            const career = CareerEngine.analyzeCareer(bazi, strength, elements);
            
            // 渲染结果
            renderResults(bazi, elements, strength, career, solarInfo, lunarInfo);
            
            // 显示结果区域
            document.getElementById('inputSection').style.display = 'none';
            document.getElementById('resultSection').style.display = 'block';
            document.getElementById('paymentSection').style.display = 'block';
            
        } catch (error) {
            alert('分析出错，请检查输入信息');
            console.error(error);
        }
    }, 500);
    
    } catch (error) {
        alert('分析过程出错: ' + error.message);
        console.error('startAnalysis 错误:', error);
    }
}

/**
 * 显示加载
 */
function showLoading() {
    const resultSection = document.getElementById('resultSection');
    resultSection.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>正在推算命理...</p>
        </div>
    `;
    resultSection.style.display = 'block';
}

/**
 * 渲染结果
 */
function renderResults(bazi, elements, strength, career, solarInfo, lunarInfo) {
    // 恢复结果区域结构
    const resultSection = document.getElementById('resultSection');
    resultSection.innerHTML = `
        <h2>命理分析结果</h2>
        
        <!-- 历法转换显示 -->
        <div class="result-card" style="background:#f0f5ff;border:1px solid #d0e3ff;">
            <h3>📅 出生日期</h3>
            <div class="date-info">
                <p><strong>阳历：</strong>${solarInfo.name}</p>
                <p><strong>农历：</strong>${lunarInfo.name}</p>
            </div>
        </div>
        
        <div class="result-card">
            <h3>八字四柱</h3>
            <div class="bazi-grid" id="baziGrid"></div>
        </div>
        
        <div class="result-card">
            <h3>五行分布</h3>
            <div class="wuxing-bars" id="wuxingBars"></div>
            <div class="strength-info" id="strengthInfo"></div>
        </div>
        
        <div class="result-card">
            <h3>性格特质</h3>
            <div class="personality-box" id="personalityBox"></div>
        </div>
        
        <div class="result-card highlight-card">
            <h3>最适合的职业方向</h3>
            <div class="career-box" id="careerBox"></div>
        </div>
        
        <div class="result-card">
            <h3>综合建议</h3>
            <div class="suggestions-box" id="suggestionsBox"></div>
        </div>
        
        <div class="payment-section" id="paymentSection">
            <p class="payment-tip">想要获取更详细的命理分析报告？</p>
            <button class="payment-btn" id="paymentBtn">支付 ¥0.99 获取完整报告</button>
        </div>
    `;
    
    // 重新绑定支付按钮事件
    document.getElementById('paymentBtn').addEventListener('click', showPaymentModal);
    
    // 渲染八字
    renderBazi(bazi);
    
    // 渲染五行
    renderWuxing(elements);
    
    // 渲染身强弱
    renderStrength(strength, bazi);
    
    // 渲染性格
    renderPersonality(career);
    
    // 渲染职业
    renderCareer(career);
    
    // 渲染建议
    renderSuggestions(career);
}

/**
 * 渲染八字排盘
 */
function renderBazi(bazi) {
    const grid = document.getElementById('baziGrid');
    const pillars = [
        { label: '年柱', ...bazi.year },
        { label: '月柱', ...bazi.month },
        { label: '日柱', ...bazi.day, isDayMaster: true },
        { label: '时柱', ...bazi.hour }
    ];
    
    grid.innerHTML = pillars.map(p => `
        <div class="bazi-column">
            <div class="label">${p.label}${p.isDayMaster ? '（日主）' : ''}</div>
            <div class="stem">${p.stem}</div>
            <div class="branch">${p.branch}</div>
        </div>
    `).join('');
}

/**
 * 渲染五行分布
 */
function renderWuxing(elements) {
    const bars = document.getElementById('wuxingBars');
    const elementNames = { '金': 'gold', '水': 'water', '木': 'wood', '火': 'fire', '土': 'earth' };
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    
    bars.innerHTML = Object.entries(elements).map(([name, count]) => {
        const percent = (count / total * 100).toFixed(0);
        return `
            <div class="wuxing-bar">
                <span class="name">${name}</span>
                <div class="bar-container">
                    <div class="bar-fill ${elementNames[name]}" style="width: ${percent}%"></div>
                </div>
                <span class="count">${count}</span>
            </div>
        `;
    }).join('');
}

/**
 * 渲染身强弱
 */
function renderStrength(strength, bazi) {
    const info = document.getElementById('strengthInfo');
    const dayElement = ELEMENTS[bazi.dayMaster];
    
    info.innerHTML = `
        <div class="strength-label">
            日主${bazi.dayMaster}(${dayElement}) · ${strength.strength}
        </div>
        <div class="strength-desc">
            ${strength.getsSeason ? '✓ 得月令' : '○ 不得月令'} · 
            ${strength.hasRoot ? '✓ 地支有根' : '○ 地支无根'} · 
            天干帮扶${strength.supportCount}个
        </div>
    `;
}

/**
 * 渲染性格特质
 */
function renderPersonality(career) {
    const box = document.getElementById('personalityBox');
    const p = career.personality;
    
    box.innerHTML = `
        <div class="trait-item">
            <strong>性格类型：</strong>${p.trait}型
        </div>
        <div class="trait-item">
            <strong>性格特点：</strong>${p.desc}
        </div>
        <div class="trait-item">
            <strong>关键词：</strong>${p.keywords.join('、')}
        </div>
    `;
}

/**
 * 渲染职业推荐
 */
function renderCareer(career) {
    const box = document.getElementById('careerBox');
    
    box.innerHTML = `
        <div class="career-main">
            最适合行业：${career.dominantElement}行业
        </div>
        <div class="career-list">
            <h4>推荐行业</h4>
            <ul>
                ${career.adjustedCareers.map(c => `<li>${c}</li>`).join('')}
            </ul>
        </div>
        <div class="career-list">
            <h4>典型职位</h4>
            <ul>
                ${career.careerInfo.roles.slice(0, 5).map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
        <div class="career-list">
            <h4>发展方向</h4>
            <ul>
                <li>${career.template.direction}</li>
                <li>${career.template.advice}</li>
            </ul>
        </div>
    `;
}

/**
 * 渲染综合建议
 */
function renderSuggestions(career) {
    const box = document.getElementById('suggestionsBox');
    
    box.innerHTML = career.suggestions.map(s => `
        <div class="suggestion-item">${s}</div>
    `).join('');
}

/**
 * 显示支付弹窗
 */
function showPaymentModal() {
    document.getElementById('paymentModal').style.display = 'flex';
}

/**
 * 隐藏支付弹窗
 */
function hidePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

/**
 * 显示完整报告（支付完成后）
 * TODO: 支付验证功能待接入后恢复验证逻辑
 */
function showFullReport() {
    hidePaymentModal();
    
    // 隐藏支付按钮
    document.getElementById('paymentSection').style.display = 'none';
    
    // 获取当前分析数据
    const dateType = document.getElementById('dateType').value;
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    const hour = parseInt(document.getElementById('birthHour').value);
    const gender = document.getElementById('gender').value;
    
    // 转换为阳历（用于八字计算）
    let solarYear, solarMonth, solarDay;
    if (dateType === 'lunar') {
        const solar = LunarConverter.lunarToSolar(year, month, day);
        solarYear = solar.year;
        solarMonth = solar.month;
        solarDay = solar.day;
    } else {
        solarYear = year;
        solarMonth = month;
        solarDay = day;
    }
    
    // 计算完整分析
    const bazi = BaziEngine.getFullBazi(solarYear, solarMonth, solarDay, hour);
    const elements = BaziEngine.countElements(bazi);
    const strength = BaziEngine.analyzeStrength(bazi, elements);
    const career = CareerEngine.analyzeCareer(bazi, strength, elements);
    
    // 生成详细报告
    const detailedReport = generateDetailedReport(career, bazi, elements, gender);
    
    // 添加完整报告卡片
    const resultSection = document.getElementById('resultSection');
    
    // 清空原有内容，重新渲染完整报告
    resultSection.innerHTML = `
        <h2>🏆 完整命理分析报告</h2>
        
        <!-- 成功提示 -->
        <div class="result-card" style="background:#f6ffed;border:1px solid #b7eb8f;">
            <p style="color:#52c41a;text-align:center;font-size:18px;margin:0;">✅ 报告已解锁！以下是详细分析内容</p>
        </div>
        
        <!-- 基础信息 -->
        <div class="result-card">
            <h3>📋 基础信息</h3>
            <div class="info-grid">
                <p><strong>阳历：</strong>${solarYear}年${solarMonth}月${solarDay}日</p>
                <p><strong>农历：</strong>${dateType === 'lunar' ? LunarConverter.getLunarYearPillar(year).name + ' ' + month + '月' + day + '日' : LunarConverter.solarToLunar(solarYear, solarMonth, solarDay).fullName}</p>
                <p><strong>性别：</strong>${gender}</p>
                <p><strong>时辰：</strong>${['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][hour]}时</p>
            </div>
        </div>
        
        <!-- 八字四柱详解 -->
        <div class="result-card">
            <h3>🔮 八字四柱详解</h3>
            <div class="bazi-detail">
                ${generateBaziDetail(bazi)}
            </div>
        </div>
        
        <!-- 五行分析 -->
        <div class="result-card">
            <h3>⭐ 五行能量分析</h3>
            ${generateElementAnalysis(elements, strength)}
        </div>
        
        <!-- 十神分析 -->
        <div class="result-card">
            <h3>🎭 十神性格分析</h3>
            ${generateShishenAnalysis(bazi)}
        </div>
        
        <!-- 详细职业分析 -->
        <div class="result-card highlight-card">
            <h3>🎯 详细职业分析报告</h3>
            ${generateCareerDetail(detailedReport)}
        </div>
        
        <!-- 开运建议 -->
        <div class="result-card">
            <h3>🌈 开运指南</h3>
            ${generateFortuneGuide(career, bazi)}
        </div>
        
        <!-- 未来运势 -->
        <div class="result-card">
            <h3>📅 未来三年运势展望</h3>
            ${generateFutureTrend(bazi, career)}
        </div>
        
        <!-- 免责声明 -->
        <div class="result-card" style="background:#fffbe6;border:1px solid #ffe58f;">
            <p style="color:#d48806;font-size:0.85em;text-align:center;margin:0;">⚠️ 本报告基于传统命理学规则框架，仅供娱乐和自我探索参考，不构成人生决策建议</p>
        </div>
    `;
}

/**
 * 生成详细报告数据
 */
function generateDetailedReport(career, bazi, elements) {
    const dayMaster = bazi.dayMaster;
    const dayElement = ELEMENTS[dayMaster];
    
    // 基于五行和职业信息生成TOP5
    const topJobs = career.careerInfo.roles.slice(0, 5).map((role, idx) => {
        const scores = [95, 88, 82, 76, 70];
        const reasons = [
            `与${career.dominantElement}属性高度契合，发挥天赋优势`,
            `符合日主${dayMaster}的性格特质，自然适应`,
            `五行${career.dominantElement}旺，行业能量加持`,
            `性格${career.personality.trait}型，工作风格匹配`,
            `综合命理分析，有发展潜力`
        ];
        return {
            name: role,
            score: scores[idx],
            reason: reasons[idx]
        };
    });
    
    // 职业发展建议
    const developmentAdvice = `${career.template.direction}的职业路线最适合您。${career.template.advice}建议在${career.dominantElement}相关行业深耕，选择${career.careerInfo.industries[0]}或${career.careerInfo.industries[1]}方向作为长期发展目标。发挥${career.personality.keywords.slice(0, 2).join('、')}的优势，在工作中展现${career.careerInfo.traits.slice(0, 2).join('与')}的特质。`;
    
    // 需避免的行业（与旺五行相克的行业）
    const克五行 = { '金': '火', '水': '土', '木': '金', '火': '水', '土': '木' };
    const avoidElement = 克五行[career.dominantElement];
    const avoidIndustries = `建议谨慎进入${avoidElement}属性过强的行业，如${CareerEngine.ELEMENT_CAREERS[avoidElement]?.industries.slice(0, 3).join('、') || '相关行业'}。这些领域可能与您的命理特质存在冲突，容易消耗精力或难以发挥优势。`;
    
    // 未来运势（基于当前年份）
    const currentYear = new Date().getFullYear();
    const yearStemIdx = (currentYear - 3) % 10;
    const yearStem = STEMS[yearStemIdx];
    const yearElement = ELEMENTS[yearStem];
    const isFavorable = yearElement === career.dominantElement || 
                        yearElement === dayElement ||
                        (career.personality.keywords.some(k => k.includes(yearElement)));
    
    const futureTrend = `${currentYear}年（${yearStem}${yearElement}年）${isFavorable ? '运势向好' : '运势平稳'}。${isFavorable ? '五行能量加持，适合把握机会开拓进取。' : '稳中求进，宜巩固基础、积累经验。'}未来三年建议专注${career.dominantElement}行业的发展，${career.template.direction === '主动出击型' ? '可尝试突破性转型或创业尝试' : '宜在现有领域深耕，稳步提升专业能力'}。`;
    
    return {
        topJobs,
        developmentAdvice,
        avoidIndustries,
        futureTrend
    };
}
/**
 * 生成八字四柱详解
 */
function generateBaziDetail(bazi) {
    const pillars = [
        { label: '年柱', ...bazi.year, meaning: '代表祖上、童年、根基' },
        { label: '月柱', ...bazi.month, meaning: '代表父母、兄弟姐妹、青年' },
        { label: '日柱', ...bazi.day, meaning: '代表自己、配偶、中年', isDayMaster: true },
        { label: '时柱', ...bazi.hour, meaning: '代表子女、晚年、归宿' }
    ];
    return pillars.map(p => `<div class="pillar-detail"><h4 style="color:#1890ff;">${p.label} ${p.stem}${p.branch}${p.isDayMaster ? '（日主）' : ''}</h4><p style="color:#666;font-size:0.9em;">${p.meaning}</p><p style="color:#888;font-size:0.85em;">天干${p.stem}属${ELEMENTS[p.stem]}，地支${p.branch}属${BRANCH_ELEMENTS[p.branch]}</p></div>`).join('<hr style="border:none;border-top:1px dashed #eee;margin:10px 0;">');
}

/**
 * 生成五行能量分析
 */
function generateElementAnalysis(elements, strength) {
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
    return `<div class="element-grid" style="display:flex;gap:20px;justify-content:space-around;">${sorted.map(([name, count]) => {const percent = Math.round(count / total * 100);const status = count >= 3 ? '旺' : count >= 2 ? '中' : '弱';const color = count >= 3 ? '#52c41a' : count >= 2 ? '#1890ff' : '#ff4d4f';return `<div style="text-align:center;"><strong style="font-size:1.5em;color:${color};">${name}</strong><p style="margin:5px 0;">${count}个 (${percent}%)</p><span style="color:${color};font-weight:bold;">${status}</span></div>`}).join('')}</div><div style="margin-top:15px;padding:10px;background:#f6f8fa;border-radius:8px;"><p><strong>身强弱判断：</strong>${strength.strength}</p><p style="font-size:0.85em;color:#888;">${strength.getsSeason ? '✓ 得月令' : '○ 不得月令'} · ${strength.hasRoot ? '✓ 地支有根' : '○ 地支无根'} · 天干帮扶${strength.supportCount}个</p></div>`;
}

/**
 * 生成十神分析
 */
function generateShishenAnalysis(bazi) {
    const dayElement = ELEMENTS[bazi.dayMaster];
    const shishenMap = {
        '木': {'木':'比肩','火':'食神','土':'偏财','金':'七杀','水':'印星'},
        '火': {'火':'比肩','土':'食神','金':'偏财','水':'七杀','木':'印星'},
        '土': {'土':'比肩','金':'食神','水':'偏财','木':'七杀','火':'印星'},
        '金': {'金':'比肩','水':'食神','木':'偏财','火':'七杀','土':'印星'},
        '水': {'水':'比肩','木':'食神','火':'偏财','土':'七杀','金':'印星'}
    };
    const yearSS = shishenMap[dayElement][ELEMENTS[bazi.year.stem]];
    const monthSS = shishenMap[dayElement][ELEMENTS[bazi.month.stem]];
    const hourSS = shishenMap[dayElement][ELEMENTS[bazi.hour.stem]];
    return `<div style="display:flex;gap:15px;justify-content:space-around;"><div style="text-align:center;"><strong>年干${bazi.year.stem}</strong><p style="color:#1890ff;">${yearSS}</p></div><div style="text-align:center;"><strong>月干${bazi.month.stem}</strong><p style="color:#1890ff;">${monthSS}</p></div><div style="text-align:center;"><strong>时干${bazi.hour.stem}</strong><p style="color:#1890ff;">${hourSS}</p></div></div><p style="margin-top:15px;color:#888;font-size:0.85em;text-align:center;">十神代表您与外界能量的关系模式，影响性格和人际关系</p>`;
}

/**
 * 生成职业详情
 */
function generateCareerDetail(report) {
    return `<h4>最佳职业匹配 TOP 5</h4><ul style="list-style:none;padding:0;">${report.topJobs.map((job, i) => `<li style="margin:10px 0;padding:15px;background:linear-gradient(135deg,#f6f8fa,#fff);border-radius:12px;border:1px solid #e8e8e8;"><div style="display:flex;align-items:center;justify-content:space-between;"><strong style="color:#1890ff;font-size:1.1em;">${i+1}. ${job.name}</strong><span style="background:#52c41a;color:#fff;padding:4px 12px;border-radius:20px;font-size:0.85em;">匹配 ${job.score}%</span></div><p style="margin:8px 0 0;color:#888;font-size:0.9em;">${job.reason}</p></li>`).join('')}</ul><div style="margin-top:20px;padding:15px;background:#e6f7ff;border-radius:12px;border:1px solid #91d5ff;"><h4 style="color:#1890ff;margin:0 0 10px;">💡 职业发展建议</h4><p style="color:#666;line-height:1.8;">${report.developmentAdvice}</p></div><div style="margin-top:15px;padding:15px;background:#fff2f0;border-radius:12px;border:1px solid #ffccc7;"><h4 style="color:#e74c3c;margin:0 0 10px;">⚠️ 需谨慎的行业</h4><p style="color:#666;line-height:1.8;">${report.avoidIndustries}</p></div>`;
}

/**
 * 生成开运指南
 */
function generateFortuneGuide(career, bazi) {
    const elem = career.dominantElement;
    const guide = {
        '金': {dir:'西方、西北方',color:'白色、金色',num:'4、9',item:'金银首饰'},
        '水': {dir:'北方',color:'黑色、蓝色',num:'1、6',item:'水晶、珍珠'},
        '木': {dir:'东方、东南方',color:'绿色、青色',num:'3、8',item:'木质手串'},
        '火': {dir:'南方',color:'红色、紫色',num:'2、7',item:'红宝石'},
        '土': {dir:'中央、西南',color:'黄色、棕色',num:'5、10',item:'玉石'}
    };
    const g = guide[elem];
    return `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:15px;"><div style="padding:12px;background:#f6f8fa;border-radius:8px;text-align:center;"><strong>🧭 有利方位</strong><p style="color:#666;margin:5px 0;">${g.dir}</p></div><div style="padding:12px;background:#f6f8fa;border-radius:8px;text-align:center;"><strong>🎨 助力颜色</strong><p style="color:#666;margin:5px 0;">${g.color}</p></div><div style="padding:12px;background:#f6f8fa;border-radius:8px;text-align:center;"><strong>🔢 幸运数字</strong><p style="color:#666;margin:5px 0;">${g.num}</p></div><div style="padding:12px;background:#f6f8fa;border-radius:8px;text-align:center;"><strong>💎 开运饰品</strong><p style="color:#666;margin:5px 0;">${g.item}</p></div></div>`;
}

/**
 * 生成未来运势
 */
function generateFutureTrend(bazi, career) {
    const currentYear = new Date().getFullYear();
    let html = '';
    for(let i=0;i<3;i++){
        const y = currentYear + i;
        const stemIdx = (y - 4) % 10;
        const branchIdx = (y - 4) % 12;
        const stem = STEMS[stemIdx];
        const branch = BRANCHES[branchIdx];
        const elem = ELEMENTS[stem];
        const isFav = elem === career.dominantElement || elem === ELEMENTS[bazi.dayMaster];
        const score = isFav ? '⭐⭐⭐⭐' : '⭐⭐⭐';
        html += `<div style="margin:10px 0;padding:12px;background:${isFav ? '#f6ffed' : '#f6f8fa'};border-radius:8px;border-left:3px solid ${isFav ? '#52c41a' : '#1890ff'};"><strong>${y}年 ${stem}${branch}年</strong><span style="float:right;">${score}</span><p style="color:#888;font-size:0.85em;margin:5px 0;">天干${stem}属${elem}，${isFav ? '与您五行相合，运势向好' : '运势平稳，稳中求进'}</p></div>`;
    }
    return html + '<p style="margin-top:15px;color:#888;font-size:0.85em;text-align:center;">运势仅供参考，个人努力和机遇同样重要</p>';
}
