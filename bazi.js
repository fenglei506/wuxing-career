/**
 * 八字排盘核心算法
 * 基于 bazi-fortune skill 的计算规则
 */

// 天干地支基础数据（使用 var 允许重复声明）
var STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
var BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
var ELEMENTS = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
const BRANCH_ELEMENTS = { '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' };

// 地支藏干
const BRANCH_HIDDEN_STEMS = {
    '子': ['癸'],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙'],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '庚', '戊'],
    '午': ['丁', '己'],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛'],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲']
};

// 五虎遁年起月诀（年干 → 寅月天干）
const MONTH_STEM_START = {
    '甲': '丙', '己': '丙',
    '乙': '戊', '庚': '戊',
    '丙': '庚', '辛': '庚',
    '丁': '壬', '壬': '壬',
    '戊': '甲', '癸': '甲'
};

// 五鼠遁日起时诀（日干 → 子时天干）
const HOUR_STEM_START = {
    '甲': '甲', '己': '甲',
    '乙': '丙', '庚': '丙',
    '丙': '戊', '辛': '戊',
    '丁': '庚', '壬': '庚',
    '戊': '壬', '癸': '壬'
};

// 节气月支对应（简化版，实际需要精确节气判断）
const MONTH_BRANCH_MAP = {
    1: '丑', 2: '寅', 3: '卯', 4: '辰', 5: '巳', 6: '午',
    7: '未', 8: '申', 9: '酉', 10: '戌', 11: '亥', 12: '子'
};

// 节气分界日期（近似值，精确需要节气时刻）
// 每个月节气日之前属上月支，节气日之后属本月支
const SOLAR_TERM_DAYS = {
    1: 6,   // 小寒约1月6日（之后为丑月）
    2: 4,   // 立春约2月4日（之后为寅月）
    3: 6,   // 惊蛰约3月6日（之后为卯月）
    4: 5,   // 清明约4月5日（之后为辰月）
    5: 6,   // 立夏约5月6日（之后为巳月）
    6: 6,   // 芒种约6月6日（之后为午月）
    7: 7,   // 小暑约7月7日（之后为未月）
    8: 8,   // 立秋约8月8日（之后为申月）
    9: 8,   // 白露约9月8日（之后为酉月）
    10: 8,  // 寒露约10月8日（之后为戌月）
    11: 7,  // 立冬约11月7日（之后为亥月）
    12: 7,  // 大雪约12月7日（之后为子月）
};

/**
 * 计算年柱
 * 以立春为界，立春前属上年
 */
function getYearPillar(year, month, day) {
    // 立春前（2月4日前）属上年
    let actualYear = year;
    if (month < 2 || (month === 2 && day < 4)) {
        actualYear = year - 1;
    }
    
    const stemIdx = (actualYear - 4) % 10;
    const branchIdx = (actualYear - 4) % 12;
    
    return {
        stem: STEMS[stemIdx],
        branch: BRANCHES[branchIdx]
    };
}

/**
 * 计算月柱
 * 以节气为界
 */
function getMonthPillar(year, month, day, yearStem) {
    // 确定月支（以节气分界）
    let actualMonth = month;
    const termDay = SOLAR_TERM_DAYS[month] || 6;
    
    if (day < termDay) {
        actualMonth = month - 1;
        if (actualMonth === 0) actualMonth = 12;
    }
    
    const branchIdx = (actualMonth + 1) % 12; // 调整映射
    const monthBranch = MONTH_BRANCH_MAP[actualMonth];
    
    // 月干：五虎遁年起月诀
    const startStem = MONTH_STEM_START[yearStem];
    const startIdx = STEMS.indexOf(startStem);
    
    // 从寅月(2月)开始计数
    let monthOffset = actualMonth - 2;
    if (monthOffset < 0) monthOffset += 12;
    
    const stemIdx = (startIdx + monthOffset) % 10;
    
    return {
        stem: STEMS[stemIdx],
        branch: monthBranch
    };
}

/**
 * 计算日柱
 * 基准日：1900年1月1日 = 甲戌日
 */
function getDayPillar(year, month, day) {
    // 计算距基准日天数
    const baseDate = new Date(1900, 0, 1);
    const targetDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    
    // 基准日：甲(0)戌(10)
    const stemIdx = (0 + diffDays) % 10;
    const branchIdx = (10 + diffDays) % 12;
    
    return {
        stem: STEMS[stemIdx],
        branch: BRANCHES[branchIdx]
    };
}

/**
 * 计算时柱
 */
function getHourPillar(dayStem, hour) {
    const branch = BRANCHES[hour];
    
    // 时干：五鼠遁日起时诀
    const startStem = HOUR_STEM_START[dayStem];
    const startIdx = STEMS.indexOf(startStem);
    const stemIdx = (startIdx + hour) % 10;
    
    return {
        stem: STEMS[stemIdx],
        branch: branch
    };
}

/**
 * 完整八字排盘
 */
function getFullBazi(year, month, day, hour) {
    const yearPillar = getYearPillar(year, month, day);
    const monthPillar = getMonthPillar(year, month, day, yearPillar.stem);
    const dayPillar = getDayPillar(year, month, day);
    const hourPillar = getHourPillar(dayPillar.stem, hour);
    
    return {
        year: yearPillar,
        month: monthPillar,
        day: dayPillar,
        hour: hourPillar,
        dayMaster: dayPillar.stem,
        dayMasterElement: ELEMENTS[dayPillar.stem]
    };
}

/**
 * 统计五行分布
 */
function countElements(bazi) {
    const elements = { '金': 0, '水': 0, '木': 0, '火': 0, '土': 0 };
    
    // 天干五行
    elements[ELEMENTS[bazi.year.stem]]++;
    elements[ELEMENTS[bazi.month.stem]]++;
    elements[ELEMENTS[bazi.day.stem]]++;
    elements[ELEMENTS[bazi.hour.stem]]++;
    
    // 地支本气五行
    elements[BRANCH_ELEMENTS[bazi.year.branch]]++;
    elements[BRANCH_ELEMENTS[bazi.month.branch]]++;
    elements[BRANCH_ELEMENTS[bazi.day.branch]]++;
    elements[BRANCH_ELEMENTS[bazi.hour.branch]]++;
    
    return elements;
}

/**
 * 判断日主强弱（简化版）
 * 基于月令、地支根气、天干帮扶
 */
function analyzeStrength(bazi, elements) {
    const dayMaster = bazi.dayMaster;
    const dayElement = ELEMENTS[dayMaster];
    const monthElement = BRANCH_ELEMENTS[bazi.month.branch];
    
    // 得月令判断
    const getsSeason = (dayElement === monthElement);
    
    // 地支有根（同五行）
    const hasRoot = [bazi.year.branch, bazi.month.branch, bazi.day.branch, bazi.hour.branch]
        .some(b => BRANCH_ELEMENTS[b] === dayElement);
    
    // 天干帮扶（同五行或生我）
    const supportCount = [bazi.year.stem, bazi.month.stem, bazi.hour.stem]
        .filter(s => {
            const e = ELEMENTS[s];
            return e === dayElement || isGenerating(e, dayElement);
        }).length;
    
    // 综合判断
    let strength = '中和';
    let score = 0;
    
    if (getsSeason) score += 3;
    if (hasRoot) score += 2;
    score += supportCount;
    
    if (score >= 5) strength = '身强';
    else if (score <= 2) strength = '身弱';
    
    return {
        strength,
        getsSeason,
        hasRoot,
        supportCount,
        score
    };
}

/**
 * 五行相生判断
 */
function isGenerating(from, to) {
    const generating = {
        '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
    };
    return generating[from] === to;
}

/**
 * 取用神（简化版）
 */
function getUsefulGod(bazi, strength) {
    const dayElement = ELEMENTS[bazi.dayMaster];
    
    // 扶抑法
    if (strength.strength === '身强') {
        // 喜克泄：克我、我生、我克
        const elements = ['金', '水', '木', '火', '土'];
        const克制者 = elements.find(e => {
            const克 = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };
            return克[e] === dayElement;
        });
        const我生 = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }[dayElement];
        const我克 = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' }[dayElement];
        return { useful: [克制者, 我生, 我克], avoid: [dayElement, getGeneratingMe(dayElement)] };
    } else if (strength.strength === '身弱') {
        // 喜生扶：生我、同我
        const生我 = getGeneratingMe(dayElement);
        return { useful: [dayElement, 生我], avoid: getOpposing(dayElement) };
    } else {
        // 中和：调候或通关
        return { useful: [dayElement], avoid: [] };
    }
}

function getGeneratingMe(element) {
    const generatedBy = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
    return generatedBy[element];
}

function getOpposing(element) {
    const opposing = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };
    return [opposing[element], opposing[opposing[element]]];
}

/**
 * 导出
 */
window.BaziEngine = {
    getFullBazi,
    countElements,
    analyzeStrength,
    getUsefulGod,
    STEMS,
    BRANCHES,
    ELEMENTS,
    BRANCH_ELEMENTS
};