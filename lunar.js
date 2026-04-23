/**
 * 农历转换模块
 * 使用 lunar-javascript（寿星天文历）权威库
 */

// 农历月份名称
const LUNAR_MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAY_NAMES = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

// 天干地支
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 检查 lunar-javascript 库是否加载
 */
function checkLunarLib() {
    if (typeof Solar === 'undefined' || typeof Lunar === 'undefined') {
        console.error('lunar-javascript 库未加载！请检查 lunar-lib.js');
        return false;
    }
    return true;
}

/**
 * 阳历转农历
 */
function solarToLunar(year, month, day) {
    if (!checkLunarLib()) {
        return { year, month, day, fullName: '农历转换失败', error: true };
    }
    
    try {
        const solar = Solar.fromYmd(year, month, day);
        const lunar = solar.getLunar();
        
        const lunarYear = lunar.getYear();
        const lunarMonth = lunar.getMonth();
        const lunarDay = lunar.getDay();
        const isLeap = lunarMonth < 0;
        
        const actualMonth = Math.abs(lunarMonth);
        const gzYear = lunar.getYearInGanZhi();
        
        const monthName = (isLeap ? '闰' : '') + LUNAR_MONTH_NAMES[actualMonth - 1] + '月';
        const dayName = LUNAR_DAY_NAMES[lunarDay - 1];
        
        return {
            year: lunarYear,
            month: actualMonth,
            day: lunarDay,
            isLeap: isLeap,
            monthName: monthName,
            dayName: dayName,
            fullName: `农历${gzYear}年${monthName}${dayName}`,
            shortName: `${LUNAR_MONTH_NAMES[actualMonth - 1]}月${dayName}`,
            ganZhiYear: gzYear
        };
    } catch (e) {
        console.error('农历转换错误:', e);
        return { year, month, day, fullName: '农历转换失败', error: true };
    }
}

/**
 * 农历转阳历
 */
function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap = false) {
    if (!checkLunarLib()) {
        return { year: lunarYear, month: lunarMonth, day: lunarDay, error: true };
    }
    
    try {
        const month = isLeap ? -lunarMonth : lunarMonth;
        const lunar = Lunar.fromYmd(lunarYear, month, lunarDay);
        const solar = lunar.getSolar();
        
        return {
            year: solar.getYear(),
            month: solar.getMonth(),
            day: solar.getDay()
        };
    } catch (e) {
        console.error('农历转阳历错误:', e);
        return { year: lunarYear, month: lunarMonth, day: lunarDay, error: true };
    }
}

/**
 * 格式化阳历日期
 */
function formatSolarDate(year, month, day) {
    return `阳历${year}年${month}月${day}日`;
}

/**
 * 获取农历年份的干支
 */
function getLunarYearGanZhi(lunarYear) {
    const stemIdx = (lunarYear - 4) % 10;
    const branchIdx = (lunarYear - 4) % 12;
    return STEMS[stemIdx] + BRANCHES[branchIdx];
}

/**
 * 获取农历年份的天干地支（返回对象）
 */
function getLunarYearPillar(lunarYear) {
    const stemIdx = (lunarYear - 4) % 10;
    const branchIdx = (lunarYear - 4) % 12;
    return {
        stem: STEMS[stemIdx],
        branch: BRANCHES[branchIdx],
        name: STEMS[stemIdx] + BRANCHES[branchIdx] + '年'
    };
}

/**
 * 获取农历月的天数
 */
function getLunarMonthDays(year, month) {
    return 29; // 简化处理
}

/**
 * 获取闰月月份
 */
function getLeapMonth(year) {
    return 0; // 简化处理
}

// 等待 DOM 加载完成后导出
window.LunarConverter = {
    solarToLunar,
    lunarToSolar,
    formatSolarDate,
    getLunarYearPillar,
    getLunarYearGanZhi,
    getLunarMonthDays,
    getLeapMonth,
    LUNAR_MONTH_NAMES,
    LUNAR_DAY_NAMES
};

console.log('LunarConverter 已加载:', typeof window.LunarConverter);