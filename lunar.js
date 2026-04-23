/**
 * 农历转换模块 - 简化版
 * 直接调用 lunar-javascript 库
 */

// 农历月份名称
const LUNAR_MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAY_NAMES = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

// 天干地支（改用 var 避免重复声明）
var STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
var BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 阳历转农历
 */
function solarToLunar(year, month, day) {
    // 检查库是否加载
    if (typeof Solar === 'undefined') {
        console.error('Solar 未定义，lunar-lib.js 可能未加载');
        return { year, month, day, fullName: '农历(库未加载)', error: true };
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
function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap) {
    if (typeof Lunar === 'undefined') {
        return { year: lunarYear, month: lunarMonth, day: lunarDay, error: true };
    }
    
    try {
        const month = isLeap ? -lunarMonth : lunarMonth;
        const lunarObj = Lunar.fromYmd(lunarYear, month, lunarDay);
        const solar = lunarObj.getSolar();
        return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
    } catch (e) {
        return { year: lunarYear, month: lunarMonth, day: lunarDay, error: true };
    }
}

function formatSolarDate(year, month, day) {
    return `阳历${year}年${month}月${day}日`;
}

function getLunarYearGanZhi(lunarYear) {
    return STEMS[(lunarYear - 4) % 10] + BRANCHES[(lunarYear - 4) % 12];
}

function getLunarYearPillar(lunarYear) {
    const s = STEMS[(lunarYear - 4) % 10];
    const b = BRANCHES[(lunarYear - 4) % 12];
    return { stem: s, branch: b, name: s + b + '年' };
}

function getLunarMonthDays() { return 29; }
function getLeapMonth() { return 0; }

// 直接导出到 window（立即执行，不等待 DOM）
window.LunarConverter = {
    solarToLunar: solarToLunar,
    lunarToSolar: lunarToSolar,
    formatSolarDate: formatSolarDate,
    getLunarYearPillar: getLunarYearPillar,
    getLunarYearGanZhi: getLunarYearGanZhi,
    getLunarMonthDays: getLunarMonthDays,
    getLeapMonth: getLeapMonth,
    LUNAR_MONTH_NAMES: LUNAR_MONTH_NAMES,
    LUNAR_DAY_NAMES: LUNAR_DAY_NAMES
};

// 调试日志
console.log('lunar.js 已加载，Solar:', typeof Solar, 'LunarConverter:', typeof window.LunarConverter);