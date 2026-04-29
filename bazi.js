/**
 * 八字排盘核心算法 - 专业版
 * 包含：十神计算、格局判断、身强弱详细分析、喜用忌神推算
 */

// 天干地支基础数据
var STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
var BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 天干五行与阴阳
var ELEMENTS = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
const STEM_YIN_YANG = { '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳', '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴' };

// 地支五行
const BRANCH_ELEMENTS = { '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' };

// 地支藏干（主气、中气、余气）
const BRANCH_HIDDEN_STEMS = {
    '子': [{stem:'癸', ratio:1}],  // 全水
    '丑': [{stem:'己', ratio:0.6}, {stem:'癸', ratio:0.25}, {stem:'辛', ratio:0.15}],  // 土癸水辛金
    '寅': [{stem:'甲', ratio:0.6}, {stem:'丙', ratio:0.25}, {stem:'戊', ratio:0.15}],  // 甲木丙火戊土
    '卯': [{stem:'乙', ratio:1}],  // 全木
    '辰': [{stem:'戊', ratio:0.6}, {stem:'乙', ratio:0.25}, {stem:'癸', ratio:0.15}],  // 戊土乙木癸水
    '巳': [{stem:'丙', ratio:0.6}, {stem:'庚', ratio:0.25}, {stem:'戊', ratio:0.15}],  // 丙火庚金戊土
    '午': [{stem:'丁', ratio:0.7}, {stem:'己', ratio:0.3}],  // 丁火己土
    '未': [{stem:'己', ratio:0.6}, {stem:'丁', ratio:0.25}, {stem:'乙', ratio:0.15}],  // 己土丁火乙木
    '申': [{stem:'庚', ratio:0.6}, {stem:'壬', ratio:0.25}, {stem:'戊', ratio:0.15}],  // 庚金壬水戊土
    '酉': [{stem:'辛', ratio:1}],  // 全金
    '戌': [{stem:'戊', ratio:0.6}, {stem:'辛', ratio:0.25}, {stem:'丁', ratio:0.15}],  // 戊土辛金丁火
    '亥': [{stem:'壬', ratio:0.7}, {stem:'甲', ratio:0.3}]   // 壬水甲木
};

// 十神定义与解释
const TEN_GODS_INFO = {
    '比肩': { short: '比', desc: '同我者，代表自我意志、独立、兄弟朋友、合伙人', trait: '独立自主、竞争意识、同辈助力' },
    '劫财': { short: '劫', desc: '同我异性，代表竞争、争夺、兄弟朋友但易有矛盾', trait: '竞争激烈、财物易散、同辈牵绊' },
    '食神': { short: '食', desc: '我生同性，代表才华、口福、子女、创造力', trait: '温和仁慈、才华外露、享乐主义' },
    '伤官': { short: '伤', desc: '我生异性，代表叛逆、创新、口才、才艺', trait: '聪明傲气、创新突破、言辞犀利' },
    '正财': { short: '财', desc: '我克异性，代表正当收入、妻子、务实', trait: '勤劳务实、财源稳定、保守谨慎' },
    '偏财': { short: '才', desc: '我克同性，代表意外之财、情人、投资', trait: '慷慨豪爽、人缘广阔、财来财去' },
    '正官': { short: '官', desc: '克我异性，代表官职、上司、丈夫、名誉', trait: '正直守法、责任心强、传统保守' },
    '七杀': { short: '杀', desc: '克我同性，代表权威、压力、小人、挑战', trait: '果断刚烈、压力挑战、魄力非凡' },
    '正印': { short: '印', desc: '生我异性，代表母亲、学业、名誉、贵人', trait: '仁慈博学、贵人相助、学业有成' },
    '偏印': { short: '枭', desc: '生我同性，代表继母、偏门学问、孤独', trait: '机敏偏门、思想独特、多疑孤独' }
};

// 五虎遁年起月诀
const MONTH_STEM_START = {
    '甲': '丙', '己': '丙',
    '乙': '戊', '庚': '戊',
    '丙': '庚', '辛': '庚',
    '丁': '壬', '壬': '壬',
    '戊': '甲', '癸': '甲'
};

// 五鼠遁日起时诀
const HOUR_STEM_START = {
    '甲': '甲', '己': '甲',
    '乙': '丙', '庚': '丙',
    '丙': '戊', '辛': '戊',
    '丁': '庚', '壬': '庚',
    '戊': '壬', '癸': '壬'
};

// 节气月支对应
const MONTH_BRANCH_MAP = {
    1: '丑', 2: '寅', 3: '卯', 4: '辰', 5: '巳', 6: '午',
    7: '未', 8: '申', 9: '酉', 10: '戌', 11: '亥', 12: '子'
};

// 节气分界日期（近似值）
const SOLAR_TERM_DAYS = {
    1: 6, 2: 4, 3: 6, 4: 5, 5: 6, 6: 6,
    7: 7, 8: 8, 9: 8, 10: 8, 11: 7, 12: 7
};

// 五行生克关系
const FIVE_ELEMENT_RELATIONS = {
    // 我生（泄耗）
    generate: { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' },
    // 生我（印星）
    generatedBy: { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' },
    // 我克（财星）
    conquer: { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' },
    // 克我（官杀）
    conqueredBy: { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' }
};

/**
 * 计算年柱（以立春为界）
 */
function getYearPillar(year, month, day) {
    let actualYear = year;
    if (month < 2 || (month === 2 && day < 4)) {
        actualYear = year - 1;
    }
    const stemIdx = (actualYear - 4) % 10;
    const branchIdx = (actualYear - 4) % 12;
    return { stem: STEMS[stemIdx], branch: BRANCHES[branchIdx] };
}

/**
 * 计算月柱（以节气为界）
 */
function getMonthPillar(year, month, day, yearStem) {
    let actualMonth = month;
    const termDay = SOLAR_TERM_DAYS[month] || 6;
    if (day < termDay) {
        actualMonth = month - 1;
        if (actualMonth === 0) actualMonth = 12;
    }
    const monthBranch = MONTH_BRANCH_MAP[actualMonth];
    const startStem = MONTH_STEM_START[yearStem];
    const startIdx = STEMS.indexOf(startStem);
    let monthOffset = actualMonth - 2;
    if (monthOffset < 0) monthOffset += 12;
    const stemIdx = (startIdx + monthOffset) % 10;
    return { stem: STEMS[stemIdx], branch: monthBranch };
}

/**
 * 计算日柱
 */
function getDayPillar(year, month, day) {
    const baseDate = new Date(1900, 0, 1);
    const targetDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    const stemIdx = (0 + diffDays) % 10;
    const branchIdx = (10 + diffDays) % 12;
    return { stem: STEMS[stemIdx], branch: BRANCHES[branchIdx] };
}

/**
 * 计算时柱
 */
function getHourPillar(dayStem, hour) {
    const branch = BRANCHES[hour];
    const startStem = HOUR_STEM_START[dayStem];
    const startIdx = STEMS.indexOf(startStem);
    const stemIdx = (startIdx + hour) % 10;
    return { stem: STEMS[stemIdx], branch: branch };
}

/**
 * 计算十神（某天干相对于日主的十神）
 * @param dayMaster 日主天干
 * @param targetStem 要计算的天干
 * @returns 十神名称
 */
function getTenGod(dayMaster, targetStem) {
    const dayElement = ELEMENTS[dayMaster];
    const targetElement = ELEMENTS[targetStem];
    const dayYinYang = STEM_YIN_YANG[dayMaster];
    const targetYinYang = STEM_YIN_YANG[targetStem];
    const sameYinYang = (dayYinYang === targetYinYang);
    
    // 同我（比肩/劫财）
    if (dayElement === targetElement) {
        return sameYinYang ? '比肩' : '劫财';
    }
    
    // 生我（印星）
    if (FIVE_ELEMENT_RELATIONS.generatedBy[dayElement] === targetElement) {
        return sameYinYang ? '偏印' : '正印';
    }
    
    // 我生（食伤）
    if (FIVE_ELEMENT_RELATIONS.generate[dayElement] === targetElement) {
        return sameYinYang ? '食神' : '伤官';
    }
    
    // 我克（财星）
    if (FIVE_ELEMENT_RELATIONS.conquer[dayElement] === targetElement) {
        return sameYinYang ? '偏财' : '正财';
    }
    
    // 克我（官杀）
    if (FIVE_ELEMENT_RELATIONS.conqueredBy[dayElement] === targetElement) {
        return sameYinYang ? '七杀' : '正官';
    }
    
    return '未知';
}

/**
 * 计算四柱十神
 */
function calculateTenGods(bazi) {
    const dayMaster = bazi.day.stem;
    return {
        yearStem: getTenGod(dayMaster, bazi.year.stem),
        monthStem: getTenGod(dayMaster, bazi.month.stem),
        hourStem: getTenGod(dayMaster, bazi.hour.stem),
        // 地支藏干十神（主气）
        yearBranch: getTenGod(dayMaster, BRANCH_HIDDEN_STEMS[bazi.year.branch][0].stem),
        monthBranch: getTenGod(dayMaster, BRANCH_HIDDEN_STEMS[bazi.month.branch][0].stem),
        dayBranch: getTenGod(dayMaster, BRANCH_HIDDEN_STEMS[bazi.day.branch][0].stem),
        hourBranch: getTenGod(dayMaster, BRANCH_HIDDEN_STEMS[bazi.hour.branch][0].stem)
    };
}

/**
 * 判断格局（月令取格）
 */
function determinePattern(bazi, tenGods) {
    const monthBranch = bazi.month.branch;
    const monthStem = bazi.month.stem;
    const monthTenGod = tenGods.monthStem;
    const dayMaster = bazi.day.stem;
    
    // 月令藏干主气
    const monthMainHidden = BRANCH_HIDDEN_STEMS[monthBranch][0].stem;
    const monthMainTenGod = getTenGod(dayMaster, monthMainHidden);
    
    // 格局判断逻辑
    let pattern = '';
    let patternDesc = '';
    
    // 优先看月干是否透出月令主气
    const isMonthStemFromBranch = BRANCH_HIDDEN_STEMS[monthBranch].some(h => h.stem === monthStem);
    
    if (isMonthStemFromBranch) {
        // 月干透出月令藏干，取此十神为格
        pattern = monthTenGod + '格';
    } else {
        // 月干不透，取月令主气为格
        pattern = monthMainTenGod + '格';
    }
    
    // 格局描述
    const patternInfo = {
        '比肩格': '建禄格，身强需克泄，身弱需帮扶',
        '劫财格': '月劫格，竞争激烈，需官杀制劫',
        '食神格': '食神当令，才华外露，宜技艺创作',
        '伤官格': '伤官当令，叛逆创新，需印星制约',
        '正财格': '财星当令，务实求财，身强可担',
        '偏财格': '偏财当令，人缘广阔，财来财去',
        '正官格': '官星当令，正直守法，宜仕途管理',
        '七杀格': '杀星当令，魄力非凡，需食神制杀或印星化杀',
        '正印格': '印星当令，贵人相助，学业有成',
        '偏印格': '枭神当令，思想独特，偏门技艺'
    };
    
    patternDesc = patternInfo[pattern] || '常规格局';
    
    // 特殊格局判断（从格）
    const dayElement = ELEMENTS[dayMaster];
    const allElements = countElements(bazi);
    const dayElementCount = allElements[dayElement];
    const supportingElement = FIVE_ELEMENT_RELATIONS.generatedBy[dayElement];
    const supportCount = allElements[supportingElement];
    
    // 如果日主五行极少且无帮扶，可能是从格
    if (dayElementCount <= 1 && supportCount <= 1) {
        // 找出最旺五行
        const dominantElement = Object.entries(allElements).sort((a,b) => b[1]-a[1])[0][0];
        if (dominantElement !== dayElement && dominantElement !== supportingElement) {
            pattern = '从' + dominantElement + '格';
            patternDesc = '日主极弱，顺从' + dominantElement + '势，喜' + dominantElement + '忌帮扶';
        }
    }
    
    return { name: pattern, desc: patternDesc };
}

/**
 * 统计五行分布（含藏干力量）
 */
function countElements(bazi) {
    const elements = { '金': 0, '水': 0, '木': 0, '火': 0, '土': 0 };
    
    // 天干五行（完整力量）
    elements[ELEMENTS[bazi.year.stem]] += 1;
    elements[ELEMENTS[bazi.month.stem]] += 1;
    elements[ELEMENTS[bazi.day.stem]] += 1;
    elements[ELEMENTS[bazi.hour.stem]] += 1;
    
    // 地支藏干五行（按力量比例）
    [bazi.year.branch, bazi.month.branch, bazi.day.branch, bazi.hour.branch].forEach(branch => {
        BRANCH_HIDDEN_STEMS[branch].forEach(hidden => {
            elements[ELEMENTS[hidden.stem]] += hidden.ratio;
        });
    });
    
    return elements;
}

/**
 * 详细分析日主强弱
 */
function analyzeStrengthDetail(bazi, elements) {
    const dayMaster = bazi.day.stem;
    const dayElement = ELEMENTS[dayMaster];
    const monthElement = BRANCH_ELEMENTS[bazi.month.branch];
    
    // 1. 得令（月令判断）- 最重要
    let lingScore = 0;
    let lingDetail = '';
    const seasonRelations = {
        '木': { strong: ['寅', '卯', '辰'], weak: ['申', '酉', '戌'] },
        '火': { strong: ['巳', '午', '未'], weak: ['亥', '子', '丑'] },
        '土': { strong: ['辰', '戌', '丑', '未'], weak: ['寅', '卯'] },
        '金': { strong: ['申', '酉', '戌'], weak: ['巳', '午', '未'] },
        '水': { strong: ['亥', '子', '丑'], weak: ['辰', '戌', '未'] }
    };
    
    const monthBranch = bazi.month.branch;
    if (seasonRelations[dayElement].strong.includes(monthBranch)) {
        lingScore = 40;
        lingDetail = '得月令，日主当令有力';
    } else if (seasonRelations[dayElement].weak.includes(monthBranch)) {
        lingScore = -20;
        lingDetail = '失月令，日主休囚无力';
    } else {
        lingScore = 10;
        lingDetail = '月令平和，日主力量中等';
    }
    
    // 2. 得地（地支根气）
    let diScore = 0;
    let diDetail = '';
    const rootBranches = [bazi.year.branch, bazi.month.branch, bazi.day.branch, bazi.hour.branch];
    let rootCount = 0;
    rootBranches.forEach(branch => {
        BRANCH_HIDDEN_STEMS[branch].forEach(hidden => {
            if (ELEMENTS[hidden.stem] === dayElement) {
                rootCount += hidden.ratio;
            }
        });
    });
    
    if (rootCount >= 1) {
        diScore = 30;
        diDetail = '地支有根，根基稳固';
    } else if (rootCount >= 0.5) {
        diScore = 15;
        diDetail = '地支微根，根基一般';
    } else {
        diScore = -10;
        diDetail = '地支无根，根基不稳';
    }
    
    // 3. 得势（天干帮扶）
    let shiScore = 0;
    let shiDetail = '';
    const supportingElement = FIVE_ELEMENT_RELATIONS.generatedBy[dayElement]; // 印星五行
    const otherStems = [bazi.year.stem, bazi.month.stem, bazi.hour.stem];
    let supportCount = 0;
    otherStems.forEach(stem => {
        const stemElement = ELEMENTS[stem];
        if (stemElement === dayElement) { // 比劫
            supportCount += 1;
        } else if (stemElement === supportingElement) { // 印星
            supportCount += 0.8;
        }
    });
    
    if (supportCount >= 2) {
        shiScore = 20;
        shiDetail = '天干多帮扶，助力充足';
    } else if (supportCount >= 1) {
        shiScore = 10;
        shiDetail = '天干有帮扶，助力一般';
    } else {
        shiScore = -10;
        shiDetail = '天干无助，孤立无援';
    }
    
    // 综合评分
    const totalScore = lingScore + diScore + shiScore;
    let strength = '';
    let strengthDesc = '';
    
    if (totalScore >= 60) {
        strength = '身强';
        strengthDesc = '日主力量充沛，可担财官，喜克泄耗';
    } else if (totalScore >= 30) {
        strength = '偏强';
        strengthDesc = '日主力量较足，略喜克泄';
    } else if (totalScore >= 0) {
        strength = '中和';
        strengthDesc = '日主力量平衡，喜用灵活';
    } else if (totalScore >= -30) {
        strength = '偏弱';
        strengthDesc = '日主力量不足，略喜帮扶';
    } else {
        strength = '身弱';
        strengthDesc = '日主力量虚弱，需印比帮扶';
    }
    
    return {
        strength,
        strengthDesc,
        totalScore,
        lingScore,
        lingDetail,
        diScore,
        diDetail,
        shiScore,
        shiDetail,
        rootCount,
        supportCount
    };
}

/**
 * 取喜用忌神
 */
function calculateUsefulGod(bazi, strengthDetail) {
    const dayElement = ELEMENTS[bazi.day.stem];
    const strength = strengthDetail.strength;
    
    let useful = [];
    let avoid = [];
    let usefulDesc = '';
    let avoidDesc = '';
    
    // 根据身强弱取用
    if (strength === '身强' || strength === '偏强') {
        // 喜克泄耗：官杀、食伤、财星
        useful = [
            FIVE_ELEMENT_RELATIONS.conqueredBy[dayElement], // 克我（官杀）
            FIVE_ELEMENT_RELATIONS.generate[dayElement],    // 我生（食伤）
            FIVE_ELEMENT_RELATIONS.conquer[dayElement]      // 我克（财星）
        ];
        avoid = [dayElement, FIVE_ELEMENT_RELATIONS.generatedBy[dayElement]]; // 同我、生我
        usefulDesc = '喜官杀（克制）、食伤（泄秀）、财星（耗力）';
        avoidDesc = '忌比劫（帮扶）、印星（生扶），以免过强失衡';
    } else if (strength === '身弱' || strength === '偏弱') {
        // 喜帮扶：印星、比劫
        useful = [
            FIVE_ELEMENT_RELATIONS.generatedBy[dayElement], // 生我（印星）
            dayElement                                        // 同我（比劫）
        ];
        avoid = [
            FIVE_ELEMENT_RELATIONS.conqueredBy[dayElement],  // 克我（官杀）
            FIVE_ELEMENT_RELATIONS.generate[dayElement],     // 我生（食伤）
            FIVE_ELEMENT_RELATIONS.conquer[dayElement]       // 我克（财星）
        ];
        usefulDesc = '喜印星（生扶）、比劫（帮扶），增强日主力量';
        avoidDesc = '忌官杀（克制）、食伤（泄耗）、财星（耗力），以免雪上加霜';
    } else {
        // 中和，看调候或通关
        useful = [dayElement];
        avoid = [];
        usefulDesc = '中和格局，可调候或通关取用';
        avoidDesc = '无明显忌神，注意平衡';
    }
    
    // 去重
    useful = [...new Set(useful)];
    avoid = [...new Set(avoid)];
    
    return { useful, avoid, usefulDesc, avoidDesc };
}

/**
 * 完整八字排盘与分析
 */
function getFullBazi(year, month, day, hour) {
    const yearPillar = getYearPillar(year, month, day);
    const monthPillar = getMonthPillar(year, month, day, yearPillar.stem);
    const dayPillar = getDayPillar(year, month, day);
    const hourPillar = getHourPillar(dayPillar.stem, hour);
    
    const bazi = {
        year: yearPillar,
        month: monthPillar,
        day: dayPillar,
        hour: hourPillar,
        dayMaster: dayPillar.stem,
        dayMasterElement: ELEMENTS[dayPillar.stem]
    };
    
    // 计算十神
    const tenGods = calculateTenGods(bazi);
    
    // 计算五行
    const elements = countElements(bazi);
    
    // 分析身强弱
    const strengthDetail = analyzeStrengthDetail(bazi, elements);
    
    // 判断格局
    const pattern = determinePattern(bazi, tenGods);
    
    // 取喜用忌神
    const usefulGod = calculateUsefulGod(bazi, strengthDetail);
    
    return {
        ...bazi,
        tenGods,
        elements,
        strengthDetail,
        pattern,
        usefulGod
    };
}

/**
 * 计算大运（使用 lunar-javascript 库）
 * @param {Object} bazi - 八字数据
 * @param {number} year - 出生年份
 * @param {number} month - 出生月份
 * @param {number} day - 出生日期
 * @param {number} hour - 出生时辰（0-11对应子-亥）
 * @param {string} gender - 性别 'male' 或 'female'
 * @returns {Array} 大运列表
 */
function calculateDaYun(bazi, year, month, day, hour, gender) {
    try {
        // 使用 lunar-javascript 库计算
        const Solar = window.Solar;
        const Lunar = window.Lunar;
        
        if (!Solar || !Lunar) {
            return getDefaultDaYun(bazi);
        }
        
        // 创建阳历日期
        const solarDate = Solar.fromDate(new Date(year, month - 1, day, hour * 2, 0, 0));
        const lunarDate = solarDate.getLunar();
        
        // 获取八字（用于大运起运年龄计算）
        const baziObj = lunarDate.getBazi();
        
        // 获取大运（男命顺行，女命逆行）
        const yun = baziObj.getYun(gender === 'male' || gender === '男' ? 1 : 0);
        const daYunList = yun.getDaYun();
        
        // 格式化大运数据
        const result = daYunList.slice(0, 8).map((dy, index) => {
            const startAge = dy.getStartAge();
            const endAge = dy.getEndAge();
            const gz = dy.getGanZhi();
            const stem = gz.charAt(0);
            const branch = gz.charAt(1);
            const stemElement = ELEMENTS[stem];
            const branchElement = BRANCH_ELEMENTS[branch];
            
            // 判断该大运五行是否为喜用
            const usefulGod = bazi.usefulGod;
            const isUseful = usefulGod.useful.includes(stemElement) || usefulGod.useful.includes(branchElement);
            const isAvoid = usefulGod.avoid.includes(stemElement) || usefulGod.avoid.includes(branchElement);
            
            // 十神（大运天干对日主）
            const tenGod = getTenGod(bazi.dayMaster, stem);
            
            return {
                index: index + 1,
                ganZhi: gz,
                stem,
                branch,
                stemElement,
                branchElement,
                tenGod,
                startAge,
                endAge,
                isUseful,
                isAvoid,
                rating: isUseful ? '有利' : (isAvoid ? '不利' : '平稳'),
                desc: `${gz}大运 (${startAge}-${endAge}岁)：天干${stem}属${stemElement}（${tenGod}），${isUseful ? '为喜用五行，运势向好' : (isAvoid ? '为忌神五行，需谨慎' : '运势平稳')}`
            };
        });
        
        return result;
    } catch (e) {
        console.error('大运计算失败:', e);
        return getDefaultDaYun(bazi);
    }
}

/**
 * 默认大运（当库加载失败时使用）
 */
function getDefaultDaYun(bazi) {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - 30; // 假设30岁
    const result = [];
    
    for (let i = 0; i < 8; i++) {
        const startAge = i * 10 + 1;
        const endAge = startAge + 9;
        const yearOffset = Math.floor((currentYear - birthYear) / 10) * 10 + i * 10;
        const stemIdx = (birthYear + yearOffset - 4) % 10;
        const branchIdx = (birthYear + yearOffset - 4) % 12;
        const stem = STEMS[stemIdx];
        const branch = BRANCHES[branchIdx];
        
        result.push({
            index: i + 1,
            ganZhi: stem + branch,
            stem,
            branch,
            stemElement: ELEMENTS[stem],
            branchElement: BRANCH_ELEMENTS[branch],
            tenGod: getTenGod(bazi.dayMaster, stem),
            startAge,
            endAge,
            isUseful: false,
            isAvoid: false,
            rating: '平稳',
            desc: `${stem}${branch}大运 (${startAge}-${endAge}岁)`
        });
    }
    
    return result;
}

/**
 * 导出
 */
window.BaziEngine = {
    getFullBazi,
    countElements,
    analyzeStrength: (bazi, elements) => {
        // 兼容旧接口
        const detail = analyzeStrengthDetail(bazi, elements);
        return {
            strength: detail.strength,
            getsSeason: detail.lingScore > 0,
            hasRoot: detail.rootCount > 0,
            supportCount: detail.supportCount,
            score: detail.totalScore,
            detail: detail
        };
    },
    getUsefulGod: (bazi, strength) => calculateUsefulGod(bazi, strength.detail || strength),
    getTenGod,
    calculateTenGods,
    determinePattern,
    calculateDaYun,
    STEMS,
    BRANCHES,
    ELEMENTS,
    BRANCH_ELEMENTS,
    BRANCH_HIDDEN_STEMS,
    TEN_GODS_INFO,
    FIVE_ELEMENT_RELATIONS
};