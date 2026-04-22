/**
 * 主应用逻辑
 * 五行八卦职业命理分析网页
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化下拉选项
    initSelectOptions();
    
    // 监听表单变化
    listenFormChanges();
    
    // 绑定事件
    bindEvents();
});

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
function getMaxDayOfMonth(month, year) {
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
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    const hour = parseInt(document.getElementById('birthHour').value);
    const gender = document.getElementById('gender').value;
    
    // 显示加载
    showLoading();
    
    // 执行计算
    setTimeout(() => {
        try {
            // 八字排盘
            const bazi = BaziEngine.getFullBazi(year, month, day, hour);
            
            // 五行统计
            const elements = BaziEngine.countElements(bazi);
            
            // 身强弱分析
            const strength = BaziEngine.analyzeStrength(bazi, elements);
            
            // 职业分析
            const career = CareerEngine.analyzeCareer(bazi, strength, elements);
            
            // 渲染结果
            renderResults(bazi, elements, strength, career);
            
            // 显示结果区域
            document.getElementById('inputSection').style.display = 'none';
            document.getElementById('resultSection').style.display = 'block';
            document.getElementById('paymentSection').style.display = 'block';
            
        } catch (error) {
            alert('分析出错，请检查输入信息');
            console.error(error);
        }
    }, 500);
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
function renderResults(bazi, elements, strength, career) {
    // 恢复结果区域结构
    const resultSection = document.getElementById('resultSection');
    resultSection.innerHTML = `
        <h2>命理分析结果</h2>
        
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
 */
function showFullReport() {
    hidePaymentModal();
    
    // 隐藏支付按钮，显示完整报告
    document.getElementById('paymentSection').style.display = 'none';
    
    // 获取当前分析数据
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    const hour = parseInt(document.getElementById('birthHour').value);
    const gender = document.getElementById('gender').value;
    
    // 计算完整分析
    const bazi = BaziEngine.getFullBazi(year, month, day, hour);
    const elements = BaziEngine.countElements(bazi);
    const strength = BaziEngine.analyzeStrength(bazi, elements);
    const career = CareerEngine.analyzeCareer(bazi, strength, elements);
    
    // 生成详细报告数据
    const detailedReport = generateDetailedReport(career, bazi, elements);
    
    // 添加完整报告卡片
    const resultSection = document.getElementById('resultSection');
    
    // 添加详细职业分析
    const detailedCard = document.createElement('div');
    detailedCard.className = 'result-card highlight-card';
    detailedCard.innerHTML = `
        <h3>🎯 详细职业分析报告</h3>
        <div class="detailed-analysis">
            <h4>最佳职业匹配 TOP 5</h4>
            <ul style="list-style:none;padding:0;">
                ${detailedReport.topJobs.map((job, i) => `<li style="margin:10px 0;padding:10px;background:#f6f8fa;border-radius:8px;">
                    <strong style="color:#1890ff;">${i+1}. ${job.name}</strong>
                    <p style="margin:5px 0;color:#666;">匹配度：${job.score}%</p>
                    <p style="margin:5px 0;color:#888;font-size:0.9em;">${job.reason}</p>
                </li>`).join('')}
            </ul>
            
            <h4 style="margin-top:20px;">💡 职业发展建议</h4>
            <p style="color:#666;line-height:1.8;">${detailedReport.developmentAdvice}</p>
            
            <h4 style="margin-top:20px;">⚠️ 需注意的行业</h4>
            <p style="color:#e74c3c;line-height:1.8;">${detailedReport.avoidIndustries}</p>
            
            <h4 style="margin-top:20px;">📅 未来3年运势走向</h4>
            <p style="color:#666;line-height:1.8;">${detailedReport.futureTrend}</p>
        </div>
    `;
    resultSection.appendChild(detailedCard);
    
    // 显示成功提示
    const successTip = document.createElement('div');
    successTip.className = 'result-card';
    successTip.style.background = '#f6ffed';
    successTip.style.border = '1px solid #b7eb8f';
    successTip.innerHTML = '<p style="color:#52c41a;text-align:center;font-size:18px;">✅ 支付成功！完整报告已解锁</p>';
    resultSection.insertBefore(successTip, resultSection.firstChild);
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