/**
 * 农历转换模块
 * 支持1900-2100年农历阳历互转
 */

// 农历数据表（1900-2100年）
// 每年用16位表示：
// 前12位：1-12月大小月（1大0小）
// 第13位：闰月大小月
// 第14-16位：闰月月份（0表示无闰月）
const LUNAR_INFO = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b0, 0x025d0, 0x092d2, 0x0d2b0, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x051b0, 0x0a4a0,
    0x0a6a0, 0x0a4b0, 0x0ab50, 0x04b60, 0x0aab0, 0x055d0, 0x04970, 0x0a570, 0x0a4b0, 0x0aa50,
    0x1b255, 0x06d20, 0x0ada0, 0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50,
    0x06b20, 0x1a6c0, 0x0a4b0, 0x0aa50, 0x0b2a0, 0x0b550, 0x06ca0, 0x0b550, 0x15355, 0x04da0,
    0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4,
    0x0a570, 0x05260, 0x0f263, 0x0d950, 0x051b0, 0x0a4a0, 0x0a6a0, 0x0a4b0, 0x0ab50, 0x04b60,
    0x0aab0, 0x055d0, 0x04970, 0x0a570, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63,
    0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c0, 0x0a4b0, 0x0aa50,
    0x0b2a0, 0x0b550, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8,
    0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950,
    0x051b0, 0x0a4a0, 0x0a6a0, 0x0a4b0, 0x0ab50, 0x04b60, 0x0aab0, 0x055d0, 0x04970, 0x0a570,
    0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0,
    0x168a6, 0x0ea50, 0x06b20, 0x1a6c0, 0x0a4b0, 0x0aa50, 0x0b2a0, 0x0b550, 0x06ca0, 0x0b550,
    0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50,
    0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x051b0, 0x0a4a0, 0x0a6a0, 0x0a4b0,
    0x0ab50, 0x04b60, 0x0aab0, 0x055d0, 0x04970, 0x0a570, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20,
];

// 农历月份名称
const LUNAR_MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAY_NAMES = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

/**
 * 获取农历年的总天数
 */
function getLunarYearDays(year) {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
        sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
    }
    return sum + getLeapMonthDays(year);
}

/**
 * 获取闰月的天数
 */
function getLeapMonthDays(year) {
    if (getLeapMonth(year)) {
        return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
}

/**
 * 获取闰月的月份（0表示无闰月）
 */
function getLeapMonth(year) {
    return LUNAR_INFO[year - 1900] & 0xf;
}

/**
 * 获取农历月的天数
 */
function getLunarMonthDays(year, month) {
    return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

/**
 * 阳历转农历
 */
function solarToLunar(year, month, day) {
    // 基准日期：1900年1月31日（农历1900年正月初一）
    const baseDate = new Date(1900, 0, 31);
    const targetDate = new Date(year, month - 1, day);
    let offset = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    
    // 计算农历年
    let lunarYear = 1900;
    let temp = 0;
    while (lunarYear < 2100 && offset > 0) {
        temp = getLunarYearDays(lunarYear);
        offset -= temp;
        lunarYear++;
    }
    if (offset < 0) {
        offset += temp;
        lunarYear--;
    }
    
    // 计算农历月
    let lunarMonth = 1;
    let leap = getLeapMonth(lunarYear);
    let isLeap = false;
    
    while (lunarMonth < 13 && offset > 0) {
        if (leap > 0 && lunarMonth === leap && !isLeap) {
            isLeap = true;
            temp = getLeapMonthDays(lunarYear);
        } else {
            temp = getLunarMonthDays(lunarYear, lunarMonth);
        }
        
        if (isLeap && lunarMonth === leap + 1) {
            isLeap = false;
        }
        
        offset -= temp;
        if (!isLeap) {
            lunarMonth++;
        }
    }
    
    if (offset < 0) {
        offset += temp;
        lunarMonth--;
        if (leap > 0 && lunarMonth === leap && !isLeap) {
            isLeap = true;
        }
        if (isLeap && lunarMonth === leap + 1) {
            isLeap = false;
        }
    }
    
    // 计算农历日
    let lunarDay = offset + 1;
    
    return {
        year: lunarYear,
        month: lunarMonth,
        day: lunarDay,
        isLeap: isLeap,
        monthName: (isLeap ? '闰' : '') + LUNAR_MONTH_NAMES[lunarMonth - 1] + '月',
        dayName: LUNAR_DAY_NAMES[lunarDay - 1],
        fullName: `农历${lunarYear}年${(isLeap ? '闰' : '')}${LUNAR_MONTH_NAMES[lunarMonth - 1]}月${LUNAR_DAY_NAMES[lunarDay - 1]}`,
        shortName: `${LUNAR_MONTH_NAMES[lunarMonth - 1]}月${LUNAR_DAY_NAMES[lunarDay - 1]}`
    };
}

/**
 * 农历转阳历
 */
function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap = false) {
    // 基准日期：1900年1月31日
    let offset = 0;
    
    // 计算年份偏移
    for (let y = 1900; y < lunarYear; y++) {
        offset += getLunarYearDays(y);
    }
    
    // 计算月份偏移
    let leap = getLeapMonth(lunarYear);
    for (let m = 1; m < lunarMonth; m++) {
        if (leap > 0 && m === leap && !isLeap) {
            // 需要加闰月天数
            offset += getLeapMonthDays(lunarYear);
        }
        offset += getLunarMonthDays(lunarYear, m);
    }
    
    // 如果是闰月
    if (isLeap) {
        offset += getLunarMonthDays(lunarYear, lunarMonth);
    }
    
    // 加上日期偏移
    offset += lunarDay - 1;
    
    // 转换为阳历
    const baseDate = new Date(1900, 0, 31);
    const resultDate = new Date(baseDate.getTime() + offset * 24 * 60 * 60 * 1000);
    
    return {
        year: resultDate.getFullYear(),
        month: resultDate.getMonth() + 1,
        day: resultDate.getDate()
    };
}

/**
 * 格式化阳历日期
 */
function formatSolarDate(year, month, day) {
    return `阳历${year}年${month}月${day}日`;
}

/**
 * 获取农历年份的天干地支
 */
function getLunarYearPillar(lunarYear) {
    const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 农历年份干支（立春后才换年干支，这里简化处理）
    const stemIdx = (lunarYear - 4) % 10;
    const branchIdx = (lunarYear - 4) % 12;
    
    return {
        stem: STEMS[stemIdx],
        branch: BRANCHES[branchIdx],
        name: STEMS[stemIdx] + BRANCHES[branchIdx] + '年'
    };
}

/**
 * 导出
 */
window.LunarConverter = {
    solarToLunar,
    lunarToSolar,
    formatSolarDate,
    getLunarYearPillar,
    LUNAR_MONTH_NAMES,
    LUNAR_DAY_NAMES
};