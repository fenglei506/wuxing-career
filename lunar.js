/**
 * 农历转换模块
 */

// 使用 var 声明所有变量，避免 const 冲突
var LUNAR_MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
var LUNAR_DAY_NAMES = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

function solarToLunar(year, month, day) {
    if (typeof Solar === 'undefined') {
        console.error('Solar 未加载');
        return { year: year, month: month, day: day, fullName: '农历(库未加载)' };
    }
    try {
        var solar = Solar.fromYmd(year, month, day);
        var lunar = solar.getLunar();
        var lunarYear = lunar.getYear();
        var lunarMonth = lunar.getMonth();
        var lunarDay = lunar.getDay();
        var isLeap = lunarMonth < 0;
        var actualMonth = Math.abs(lunarMonth);
        var gzYear = lunar.getYearInGanZhi();
        var monthName = (isLeap ? '闰' : '') + LUNAR_MONTH_NAMES[actualMonth - 1] + '月';
        var dayName = LUNAR_DAY_NAMES[lunarDay - 1];
        return {
            year: lunarYear,
            month: actualMonth,
            day: lunarDay,
            isLeap: isLeap,
            monthName: monthName,
            dayName: dayName,
            fullName: '农历' + gzYear + '年' + monthName + dayName
        };
    } catch (e) {
        console.error('转换错误:', e);
        return { year: year, month: month, day: day, fullName: '转换失败' };
    }
}

function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap) {
    if (typeof Lunar === 'undefined') {
        return { year: lunarYear, month: lunarMonth, day: lunarDay };
    }
    try {
        var month = isLeap ? -lunarMonth : lunarMonth;
        var lunarObj = Lunar.fromYmd(lunarYear, month, lunarDay);
        var solar = lunarObj.getSolar();
        return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
    } catch (e) {
        return { year: lunarYear, month: lunarMonth, day: lunarDay };
    }
}

function formatSolarDate(year, month, day) {
    return '阳历' + year + '年' + month + '月' + day + '日';
}

function getLunarYearGanZhi(year) {
    var STEMS_LOCAL = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    var BRANCHES_LOCAL = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    return STEMS_LOCAL[(year - 4) % 10] + BRANCHES_LOCAL[(year - 4) % 12];
}

function getLunarYearPillar(year) {
    var STEMS_LOCAL = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    var BRANCHES_LOCAL = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    var s = STEMS_LOCAL[(year - 4) % 10];
    var b = BRANCHES_LOCAL[(year - 4) % 12];
    return { stem: s, branch: b, name: s + b + '年' };
}

function getLunarMonthDays() { return 29; }
function getLeapMonth() { return 0; }

// 立即导出
var LunarConverter = {
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

// 强制赋值到 window
window.LunarConverter = LunarConverter;

console.log('lunar.js 加载完成 - Solar:', typeof Solar, 'LunarConverter:', typeof window.LunarConverter);