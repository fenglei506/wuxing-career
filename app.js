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
    
    // renderResults 重写了 innerHTML， 元素被重新创建，必须重新绑定事件
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
                <li>宜前往${career.careerInfo.direction}发展</li>
                <li>发挥${career.careerInfo.traits.join('、')}特质，在${career.dominantElement}行业深耕</li>
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
    
    // 获取结果区域
    const resultSection = document.getElementById('resultSection');
    
    try {
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
        
        console.log('开始生成完整报告:', { solarYear, solarMonth, solarDay, hour, gender });
        
        // 计算完整分析
        const bazi = BaziEngine.getFullBazi(solarYear, solarMonth, solarDay, hour);
        const elements = BaziEngine.countElements(bazi);
        const strength = BaziEngine.analyzeStrength(bazi, elements);
        
        console.log('八字计算完成:', bazi);
        
        // 计算大运
        const daYun = BaziEngine.calculateDaYun(bazi, solarYear, solarMonth, solarDay, hour, gender === '男' ? 'male' : 'female');
        
        console.log('大运计算完成:', daYun);
        
        // 六维度分析
        const destiny = CareerEngine.analyzeDestiny(bazi, strength.detail, elements, gender === '男' ? 'male' : 'female');
        
        console.log('六维度分析完成:', destiny);
        
        // 生成各个部分
        const baziTechnique = generateBaziTechnique(bazi, strength, elements);
        const aspectsDetail = generateAspectsDetail(destiny);
        const daYunAnalysis = generateDaYunAnalysis(daYun, bazi);
        const coreAdvice = generateCoreAdvice(destiny, bazi);
        
        console.log('报告内容生成完成');
        
        // 清空原有内容，重新渲染完整报告
        resultSection.innerHTML = `
            <h2>🏆 完整命理分析报告</h2>
            
            <!-- 成功提示 -->
            <div class="result-card" style="background:#f6ffed;border:1px solid #b7eb8f;">
                <p style="color:#52c41a;text-align:center;font-size:18px;margin:0;">✅ 报告已解锁！以下是详细分析内容</p>
            </div>
            
            <!-- 前置声明 -->
            <div class="result-card" style="background:#fffbe6;border:1px solid #ffe58f;">
                <p style="color:#d48806;text-align:center;margin:0;font-size:14px;">本分析为文化娱乐参考，非专业决策依据，具体发展需结合个人努力与客观环境。</p>
            </div>
            
            <!-- 基础信息 -->
            <div class="result-card">
                <h3>📋 基础信息</h3>
                <div class="info-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                    <p><strong>阳历：</strong>${solarYear}年${solarMonth}月${solarDay}日 ${['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][hour]}时</p>
                    <p><strong>农历：</strong>${dateType === 'lunar' ? LunarConverter.getLunarYearPillar(year).name + ' ' + month + '月' + day + '日' : LunarConverter.solarToLunar(solarYear, solarMonth, solarDay).fullName}</p>
                    <p><strong>性别：</strong>${gender === '男' || gender === 'male' ? '男命' : '女命'}</p>
                    <p><strong>年龄：</strong>${new Date().getFullYear() - solarYear}岁（虚岁）</p>
                </div>
            </div>
            
            <!-- 命盘技法解读 -->
            <div class="result-card">
                <h3>1. 命盘技法解读</h3>
                ${baziTechnique}
            </div>
            
            <!-- 命盘事项解读 -->
            <div class="result-card">
                <h3>2. 命盘事项解读</h3>
                ${aspectsDetail}
            </div>
            
            <!-- 大运流年走势 -->
            <div class="result-card">
                <h3>3. 大运流年走势解读</h3>
                ${daYunAnalysis}
            </div>
            
            <!-- 核心建议与风险规避 -->
            <div class="result-card">
                <h3>4. 核心建议与风险规避</h3>
                ${coreAdvice}
            </div>
            
            <!-- 免责声明 -->
            <div class="result-card" style="background:#fffbe6;border:1px solid #ffe58f;">
                <p style="color:#d48806;font-size:0.85em;text-align:center;margin:0;">⚠️ 本分析完全基于您提供的命盘信息，命理是趋势的推演，人生的画卷最终由您的每一个选择与行动绘就。若有其他具体疑问，可随时提出。</p>
            </div>
        `;
        
        console.log('完整报告渲染完成');
        
    } catch (error) {
        console.error('生成完整报告时出错:', error);
        alert('生成报告失败: ' + error.message);
    }
}

/**
 * 生成命盘技法解读（专业版）
 */
function generateBaziTechnique(bazi, strength, elements) {
    const dayMaster = bazi.dayMaster;
    const dayElement = ELEMENTS[dayMaster];
    const tenGods = bazi.tenGods;
    const pattern = bazi.pattern;
    const usefulGod = bazi.usefulGod;
    
    // 八字排盘
    const baziStr = `${bazi.year.stem}${bazi.year.branch} ${bazi.month.stem}${bazi.month.branch} ${bazi.day.stem}${bazi.day.branch} ${bazi.hour.stem}${bazi.hour.branch}`;
    
    // 十神一览（带解释）
    const tenGodsHtml = `
        <div style="background:#f6f8fa;padding:15px;border-radius:8px;margin:10px 0;">
            <h4 style="color:#1890ff;font-size:16px;margin:0 0 10px;font-weight:600;">十神一览</h4>
            <ul style="margin:10px 0;padding-left:20px;line-height:2;">
                <li style="color:#333;font-size:15px;">
                    <strong>年柱：</strong>${tenGods.yearStem}（${bazi.year.stem}${bazi.year.branch}）
                    <span style="color:#666;font-size:14px;">${BaziEngine.TEN_GODS_INFO[tenGods.yearStem]?.desc || ''}</span>
                </li>
                <li style="color:#333;font-size:15px;">
                    <strong>月柱：</strong>${tenGods.monthStem}（${bazi.month.stem}${bazi.month.branch}）
                    <span style="color:#666;font-size:14px;">${BaziEngine.TEN_GODS_INFO[tenGods.monthStem]?.desc || ''}</span>
                </li>
                <li style="color:#333;font-size:15px;">
                    <strong>日柱：</strong>日主（${bazi.day.stem}${bazi.day.branch}）
                    <span style="color:#666;font-size:14px;">代表自己</span>
                </li>
                <li style="color:#333;font-size:15px;">
                    <strong>时柱：</strong>${tenGods.hourStem}（${bazi.hour.stem}${bazi.hour.branch}）
                    <span style="color:#666;font-size:14px;">${BaziEngine.TEN_GODS_INFO[tenGods.hourStem]?.desc || ''}</span>
                </li>
            </ul>
            <p style="color:#8c7300;font-size:13px;margin-top:10px;background:#fffbe6;padding:8px;border-radius:6px;">📌 <strong>术语解释：</strong>十神是八字命理的核心概念，描述日主与其他天干的关系。如<strong>比肩</strong>代表兄弟姐妹、自我意识；<strong>食神</strong>代表才华、子女；<strong>偏财</strong>代表意外之财、父亲等。</p>
        </div>
    `;
    
    // 五行旺衰分析
    const sortedElements = Object.entries(elements).sort((a, b) => b[1] - a[1]);
    const dominantElement = sortedElements[0][0];
    const weakestElement = sortedElements[sortedElements.length - 1][0];
    
    const elementHtml = `
        <div style="background:#e6f7ff;padding:15px;border-radius:8px;margin:10px 0;">
            <h4 style="color:#1890ff;font-size:16px;margin:0 0 10px;font-weight:600;">五行旺衰</h4>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;">
                日主${dayMaster}属${dayElement}，生于${bazi.month.branch}月（${BRANCH_ELEMENTS[bazi.month.branch]}季）。
            </p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:10px 0;">
                <strong>五行分布：</strong>${sortedElements.map(([e, c]) => `${e}(${Math.round(c)}分)`).join(' → ')}
            </p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:10px 0;">
                综合判为<strong style="color:${strength.strength.includes('强') ? '#52c41a' : '#cf1322'};">${strength.strength}</strong>。
                <span style="color:#666;font-size:14px;">${strength.detail?.strengthDesc || ''}</span>
            </p>
            <p style="color:#8c7300;font-size:13px;margin-top:10px;background:#fffbe6;padding:8px;border-radius:6px;">📌 <strong>术语解释：</strong><strong>身强</strong>指日主力量充沛，能承受财官（财富和职位）；<strong>身弱</strong>指日主力量不足，需要印星（贵人、学历）和比劫（朋友、兄弟）帮扶。</p>
        </div>
    `;
    
    // 格局分析
    const patternHtml = `
        <div style="background:#fffbe6;padding:15px;border-radius:8px;margin:10px 0;">
            <h4 style="color:#d46b08;font-size:16px;margin:0 0 10px;font-weight:600;">格局分析</h4>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;">
                <strong>格局：</strong>${pattern.name}
            </p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:10px 0;">${pattern.desc}</p>
            <p style="color:#8c7300;font-size:13px;margin-top:10px;background:#fff;padding:8px;border-radius:6px;">📌 <strong>术语解释：</strong><strong>格局</strong>是八字命理判断层次和命运走向的重要依据。如<strong>食神格</strong>主才华外露，适合技艺创作；<strong>正官格</strong>主正直守法，适合仕途管理。</p>
        </div>
    `;
    
    // 喜用忌神
    const usefulGodHtml = `
        <div style="background:#f6ffed;padding:15px;border-radius:8px;margin:10px 0;">
            <h4 style="color:#52c41a;font-size:16px;margin:0 0 10px;font-weight:600;">喜用忌神</h4>
            <div style="margin:10px 0;">
                <span style="background:#52c41a;color:#fff;padding:6px 12px;border-radius:6px;margin-right:8px;font-size:14px;">喜用：${usefulGod.useful.join('、')}</span>
                <span style="background:#ff4d4f;color:#fff;padding:6px 12px;border-radius:6px;font-size:14px;">忌神：${usefulGod.avoid.join('、') || '无明显忌神'}</span>
            </div>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:10px 0;">${usefulGod.usefulDesc}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:10px 0;">${usefulGod.avoidDesc}</p>
            <p style="color:#8c7300;font-size:13px;margin-top:10px;background:#fff;padding:8px;border-radius:6px;">📌 <strong>术语解释：</strong><strong>喜用神</strong>是对命主有益的五行，能增强运势；<strong>忌神</strong>是对命主不利的五行，会带来阻碍。通过补益喜用、规避忌神，可改善命运走向。</p>
        </div>
    `;
    
    return `
        <div style="color:#333;font-size:16px;font-weight:bold;margin-bottom:15px;">八字排盘：${baziStr}</div>
        ${tenGodsHtml}
        ${elementHtml}
        ${patternHtml}
        ${usefulGodHtml}
    `;
}

/**
 * 生成命盘事项解读（六维度）
 */
function generateAspectsDetail(destiny) {
    const aspects = destiny.aspects;
    
    // 事业
    const careerHtml = `
        <div style="margin:15px 0;padding:15px;background:#f6f8fa;border-radius:12px;border-left:4px solid #1890ff;">
            <h4 style="color:#1890ff;margin:0 0 10px;font-size:16px;">💼 事业</h4>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>职业倾向：</strong>${aspects.career.type}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;">${aspects.career.detail}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>适配职位：</strong>${aspects.career.suitableJobs.join('、')}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>建议：</strong>${aspects.career.advice}</p>
            <p style="color:#8c7300;font-size:13px;margin-top:10px;background:#fffbe6;padding:8px;border-radius:6px;">${aspects.career.warning}</p>
        </div>
    `;
    
    // 财运
    const wealthHtml = `
        <div style="margin:15px 0;padding:15px;background:#fff7e6;border-radius:12px;border-left:4px solid #fa8c16;">
            <h4 style="color:#d46b08;margin:0 0 10px;font-size:16px;">💰 财运</h4>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>财富级别：</strong>${aspects.wealth.level}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>主要来源：</strong>${aspects.wealth.source}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>聚财特征：</strong>${aspects.wealth.trait}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>建议：</strong>${aspects.wealth.advice}</p>
            <p style="color:#8c7300;font-size:13px;margin-top:10px;background:#fffbe6;padding:8px;border-radius:6px;">${aspects.wealth.warning}</p>
        </div>
    `;
    
    // 婚恋
    const marriageHtml = `
        <div style="margin:15px 0;padding:15px;background:#ffe7f6;border-radius:12px;border-left:4px solid #eb2f96;">
            <h4 style="color:#c41d7f;margin:0 0 10px;font-size:16px;">❤️ 婚恋</h4>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>适配对象：</strong>${aspects.marriage.spouseTrait}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>婚龄倾向：</strong>${aspects.marriage.marriageAge}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>潜在风险：</strong>${aspects.marriage.marriageRisk}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>建议：</strong>${aspects.marriage.advice}</p>
            <p style="color:#8c7300;font-size:13px;margin-top:10px;background:#fffbe6;padding:8px;border-radius:6px;">${aspects.marriage.warning}</p>
        </div>
    `;
    
    // 子女
    const childrenHtml = `
        <div style="margin:15px 0;padding:15px;background:#f0f5ff;border-radius:12px;border-left:4px solid #2f54eb;">
            <h4 style="color:#1d39c4;margin:0 0 10px;font-size:16px;">👨‍👩‍👧 子女</h4>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>缘分特征：</strong>${aspects.children.tendency}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>头胎倾向：</strong>${aspects.children.firstChildGender}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>育儿建议：</strong>${aspects.children.parentingAdvice}</p>
            <p style="color:#8c7300;font-size:13px;margin-top:10px;background:#fffbe6;padding:8px;border-radius:6px;">${aspects.children.warning}</p>
        </div>
    `;
    
    // 六亲
    const familyHtml = `
        <div style="margin:15px 0;padding:15px;background:#fcffe6;border-radius:12px;border-left:4px solid #a0d911;">
            <h4 style="color:#5b8c00;margin:0 0 10px;font-size:16px;">👨‍👩‍👦 六亲</h4>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>父亲：</strong>${aspects.family.fatherRelation}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>母亲：</strong>${aspects.family.motherRelation}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>兄弟姐妹：</strong>${aspects.family.siblingRelation}</p>
            <p style="color:#8c7300;font-size:13px;margin-top:10px;background:#fffbe6;padding:8px;border-radius:6px;">${aspects.family.warning}</p>
        </div>
    `;
    
    // 健康
    const healthHtml = `
        <div style="margin:15px 0;padding:15px;background:#fff1f0;border-radius:12px;border-left:4px solid #ff4d4f;">
            <h4 style="color:#cf1322;margin:0 0 10px;font-size:16px;">🏥 健康</h4>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>需关注脏腑：</strong>${aspects.health.weakOrgans}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>易患问题：</strong>${aspects.health.potentialDiseases}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>养生建议：</strong>${aspects.health.advice}</p>
            <p style="color:#8c7300;font-size:13px;margin-top:10px;background:#fffbe6;padding:8px;border-radius:6px;">${aspects.health.warning}</p>
        </div>
    `;
    
    return careerHtml + wealthHtml + marriageHtml + childrenHtml + familyHtml + healthHtml;
}

/**
 * 生成大运流年走势解读
 */
function generateDaYunAnalysis(daYun, bazi) {
    // 当前大运（找到当前年龄所在的大运）
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - 30; // 假设用户30岁左右
    const currentAge = currentYear - birthYear;
    
    let currentDaYun = daYun.find(d => currentAge >= d.startAge && currentAge <= d.endAge) || daYun[2];
    
    // 大运列表HTML
    const daYunListHtml = daYun.map((d, idx) => {
        const isCurrent = d === currentDaYun;
        const bgColor = d.isUseful ? '#f6ffed' : (d.isAvoid ? '#fff2f0' : '#f6f8fa');
        const borderColor = isCurrent ? '#1890ff' : (d.isUseful ? '#52c41a' : (d.isAvoid ? '#ff4d4f' : '#e8e8e8'));
        
        return `
            <div style="margin:10px 0;padding:12px;background:${bgColor};border-radius:8px;border-left:4px solid ${borderColor};${isCurrent ? 'box-shadow:0 2px 8px rgba(24,144,255,0.2);' : ''}">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong style="color:#333;font-size:15px;">${d.ganZhi}大运 (${d.startAge}-${d.endAge}岁)</strong>
                    ${isCurrent ? '<span style="background:#1890ff;color:#fff;padding:2px 8px;border-radius:12px;font-size:12px;">当前</span>' : ''}
                    <span style="color:${d.isUseful ? '#52c41a' : (d.isAvoid ? '#cf1322' : '#666')};font-weight:bold;font-size:14px;">${d.rating}</span>
                </div>
                <p style="color:#666;font-size:14px;margin:5px 0;">天干${d.stem}属${d.stemElement}（${d.tenGod}），地支${d.branch}属${d.branchElement}</p>
                <p style="color:#333;font-size:15px;line-height:1.5;">${d.desc}</p>
            </div>
        `;
    }).join('');
    
    // 未来5年流年分析
    const future5YearsHtml = generateFuture5Years(bazi);
    
    return `
        <div style="margin:10px 0;padding:15px;background:#f6f8fa;border-radius:12px;">
            <h4 style="color:#1890ff;font-size:16px;margin:0 0 10px;font-weight:600;">大运周期（每运10年）</h4>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:10px 0;">大运是命理学中的十年运势周期，反映人生不同阶段的运势起伏。当前运势受大运与流年共同影响。</p>
            <p style="color:#8c7300;font-size:13px;margin-top:10px;background:#fffbe6;padding:8px;border-radius:6px;">📌 <strong>术语解释：</strong><strong>大运</strong>是以10年为周期的运势阶段，由出生月柱顺推或逆推得出。<strong>流年</strong>是每年的运势，由当年干支决定。</p>
        </div>
        ${daYunListHtml}
        <div style="margin:20px 0;">
            <h4 style="color:#1890ff;font-size:16px;font-weight:600;">📅 未来5年流年走势</h4>
            ${future5YearsHtml}
        </div>
    `;
}

/**
 * 生成未来5年流年分析
 */
function generateFuture5Years(bazi) {
    const currentYear = new Date().getFullYear();
    const usefulGod = bazi.usefulGod;
    
    let html = '';
    for (let i = 0; i < 5; i++) {
        const year = currentYear + i;
        const stemIdx = (year - 4) % 10;
        const branchIdx = (year - 4) % 12;
        const stem = STEMS[stemIdx];
        const branch = BRANCHES[branchIdx];
        const stemElement = ELEMENTS[stem];
        const branchElement = BRANCH_ELEMENTS[branch];
        
        const isUseful = usefulGod.useful.includes(stemElement) || usefulGod.useful.includes(branchElement);
        const isAvoid = usefulGod.avoid.includes(stemElement) || usefulGod.avoid.includes(branchElement);
        
        const bg = isUseful ? '#f6ffed' : (isAvoid ? '#fff2f0' : '#f6f8fa');
        const border = isUseful ? '#52c41a' : (isAvoid ? '#ff4d4f' : '#e8e8e8');
        const rating = isUseful ? '⭐⭐⭐⭐' : (isAvoid ? '⭐⭐' : '⭐⭐⭐');
        
        html += `
            <div style="margin:8px 0;padding:10px;background:${bg};border-radius:8px;border-left:3px solid ${border};">
                <strong style="color:#333;font-size:15px;">${year}年 ${stem}${branch}年</strong>
                <span style="float:right;font-size:14px;">${rating}</span>
                <p style="color:#666;font-size:14px;margin:5px 0;">天干${stem}属${stemElement}，地支${branch}属${branchElement}
                ${isUseful ? '为喜用，运势向好' : (isAvoid ? '为忌神，需谨慎' : '运势平稳')}</p>
            </div>
        `;
    }
    return html;
}

/**
 * 生成核心建议与风险规避
 */
function generateCoreAdvice(destiny, bazi) {
    const fortuneGuide = destiny.fortuneGuide;
    const usefulGod = bazi.usefulGod;
    const aspects = destiny.aspects;
    
    // 安全获取数据
    const element = fortuneGuide?.element || '木';
    const elementCareers = CareerEngine.ELEMENT_CAREERS[element] || CareerEngine.ELEMENT_CAREERS['木'];
    const industries = elementCareers?.industries || ['教育培训', '文化出版', '农林园艺'];
    const useful = usefulGod?.useful || ['木', '水'];
    const avoid = usefulGod?.avoid || ['火', '土'];
    
    // 发展方向
    const directionHtml = `
        <div style="margin:15px 0;padding:15px;background:#e6f7ff;border-radius:12px;">
            <h4 style="color:#1890ff;font-size:16px;margin:0 0 10px;font-weight:600;">🧭 发展方向</h4>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>有利行业：</strong>五行属${element}的行业，如${industries.slice(0, 5).join('、')}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>有利方位：</strong>${fortuneGuide?.direction || '东方、东南方'}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>有利季节：</strong>${fortuneGuide?.season || '春季'}</p>
            <p style="color:#8c7300;font-size:13px;margin-top:10px;background:#fff;padding:8px;border-radius:6px;">${fortuneGuide?.explanation || '【开运原理】通过方位、颜色等五行属性增强运势。'}</p>
        </div>
    `;
    
    // 开运物品
    const itemsHtml = `
        <div style="margin:15px 0;padding:15px;background:#fff7e6;border-radius:12px;">
            <h4 style="color:#d46b08;font-size:16px;margin:0 0 10px;font-weight:600;">🌈 开运指南</h4>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                <div style="padding:10px;background:#fff;border-radius:8px;text-align:center;">
                    <strong style="color:#333;font-size:15px;">🎨 助力颜色</strong>
                    <p style="color:#333;font-size:14px;margin:5px 0;">${fortuneGuide?.color || '绿色、青色'}</p>
                </div>
                <div style="padding:10px;background:#fff;border-radius:8px;text-align:center;">
                    <strong style="color:#333;font-size:15px;">🔢 幸运数字</strong>
                    <p style="color:#333;font-size:14px;margin:5px 0;">${fortuneGuide?.number || '3、8'}</p>
                </div>
                <div style="padding:10px;background:#fff;border-radius:8px;text-align:center;">
                    <strong style="color:#333;font-size:15px;">💎 开运饰品</strong>
                    <p style="color:#333;font-size:14px;margin:5px 0;">${fortuneGuide?.item || '木质手串'}</p>
                </div>
                <div style="padding:10px;background:#fff;border-radius:8px;text-align:center;">
                    <strong style="color:#333;font-size:15px;">🧭 有利方位</strong>
                    <p style="color:#333;font-size:14px;margin:5px 0;">${fortuneGuide?.direction || '东方、东南方'}</p>
                </div>
            </div>
        </div>
    `;
    
    // 人际建议
    const relationHtml = `
        <div style="margin:15px 0;padding:15px;background:#fcffe6;border-radius:12px;">
            <h4 style="color:#5b8c00;font-size:16px;margin:0 0 10px;font-weight:600;">👥 人际建议</h4>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>适配类型：</strong>五行${useful.join('、')}旺的人，性格沉稳务实，能提供支持</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>需规避：</strong>五行${avoid.join('、') || '无明显忌神'}过旺的人，性格急躁或过于理想化，合作需谨慎</p>
        </div>
    `;
    
    // 风险提示
    const riskHtml = `
        <div style="margin:15px 0;padding:15px;background:#fff2f0;border-radius:12px;border-left:4px solid #ff4d4f;">
            <h4 style="color:#cf1322;font-size:16px;margin:0 0 10px;font-weight:600;">⚠️ 风险提示</h4>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>关键年份：</strong>未来5年中，${avoid.length > 0 ? '逢' + avoid.join('、') + '旺的流年需特别注意' : '无明显高风险年份'}</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>风险类型：</strong>投资破财、事业挫败、健康下滑、感情纠纷（需结合具体流年判断）</p>
            <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;"><strong>化解思路：</strong>宜静不宜动，深耕专业，强身健体，多学习（补印），减少不必要的社交与开销</p>
        </div>
    `;
    
    return directionHtml + itemsHtml + relationHtml + riskHtml;
}
