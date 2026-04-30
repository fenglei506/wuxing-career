/**
 * 命理分析模块 - 专业版
 * 六维度分析：事业、财运、婚恋、子女、六亲、健康
 */

// 天干性格特质（详细版）
const STEM_PERSONALITY = {
    '甲': {
        trait: '开创型',
        desc: '直来直去、领导欲强、上进不服输',
        keywords: ['果断', '独立', '进取', '正直'],
        detail: '甲木如参天大树，正直刚毅，有领导气质，但易固执己见，不善变通。'
    },
    '乙': {
        trait: '细腻型',
        desc: '善于变通、配合度高、善于思考',
        keywords: ['灵活', '温和', '协调', '艺术'],
        detail: '乙木如花草藤蔓，柔韧善变，擅长协调配合，心思细腻，但易犹豫不决。'
    },
    '丙': {
        trait: '热烈型',
        desc: '执行力快、表面外向、需要认可',
        keywords: ['热情', '社交', '领导', '表达'],
        detail: '丙火如太阳，热情外向，感染力强，喜欢被关注，但易冲动急躁。'
    },
    '丁': {
        trait: '内敛型',
        desc: '观察力强、温和有主见、善于幕后',
        keywords: ['细腻', '洞察', '专注', '幕后'],
        detail: '丁火如烛光，温和细腻，洞察力强，适合幕后策划，但易多思多虑。'
    },
    '戊': {
        trait: '稳重型',
        desc: '踏实诚信、物质导向、抗压强',
        keywords: ['稳重', '可靠', '务实', '包容'],
        detail: '戊土如大地，稳重踏实，包容性强，重视物质，但易保守固执。'
    },
    '己': {
        trait: '包容型',
        desc: '善于协调、务实灵活、讨厌浮夸',
        keywords: ['包容', '细腻', '务实', '经营'],
        detail: '己土如田园，细腻务实，善于经营协调，讨厌浮夸，但易多愁善感。'
    },
    '庚': {
        trait: '刚烈型',
        desc: '果断决绝、原则性强、不绕弯子',
        keywords: ['果断', '正义', '执行', '原则'],
        detail: '庚金如刀剑，刚毅果断，原则性强，执行力强，但易刚愎自用。'
    },
    '辛': {
        trait: '精致型',
        desc: '审美敏锐、追求完美、善于表达',
        keywords: ['精致', '审美', '表达', '完美'],
        detail: '辛金如珠宝，精致细腻，审美敏锐，追求完美，但易挑剔苛求。'
    },
    '壬': {
        trait: '流动型',
        desc: '好奇心强、适应力强、喜欢自由',
        keywords: ['自由', '探索', '适应', '统筹'],
        detail: '壬水如江河，流动自由，好奇心强，适应力强，但易漂泊不定。'
    },
    '癸': {
        trait: '深沉型',
        desc: '直觉敏锐、善于洞察、内向安静',
        keywords: ['洞察', '思考', '直觉', '智慧'],
        detail: '癸水如雨露，深沉内敛，直觉敏锐，善于思考，但易多疑敏感。'
    }
};

// 五行行业详细匹配
const ELEMENT_CAREERS = {
    '金': {
        industries: ['金融投资', '银行保险', '珠宝首饰', '五金机械', '汽车制造', '司法法律', '军警安保', '精密仪器', '外科医疗', '审计财务'],
        roles: ['财务分析师', '投资经理', '法官律师', '审计师', '工程师', '外科医生', '军警', '机械设计师', '珠宝鉴定师'],
        traits: ['严谨', '精确', '执行力', '原则性强'],
        color: '白色、金色',
        direction: '西方、西北'
    },
    '水': {
        industries: ['贸易物流', '航运运输', '旅游酒店', '媒体传播', '广告公关', '饮品行业', '清洁环保', '渔业水产', '通讯信息', '心理咨询'],
        roles: ['贸易商', '物流经理', '记者', '公关', '导游', '媒体运营', '信息分析师', '心理咨询师', '酒类销售'],
        traits: ['灵活', '适应力', '沟通', '洞察'],
        color: '黑色、蓝色',
        direction: '北方'
    },
    '木': {
        industries: ['教育培训', '文化出版', '农林园艺', '医药健康', '家具木材', '纺织服装', '宗教慈善', '环保公益', '人力资源', '图书档案'],
        roles: ['教师', '医生', '编辑', '设计师', '园艺师', '培训师', 'HR', '公益工作者', '图书管理员'],
        traits: ['仁慈', '成长', '创造力', '协调'],
        color: '绿色、青色',
        direction: '东方、东南'
    },
    '火': {
        industries: ['互联网科技', '电子电器', '能源电力', '餐饮烹饪', '化妆品', '照明光学', '影视娱乐', '体育竞技', '心理咨询', '美容美发'],
        roles: ['程序员', '企业家', '厨师', '美容师', '演员', '运动员', '心理咨询师', '营销策划', '电子工程师'],
        traits: ['热情', '表达', '感染力', '创造力'],
        color: '红色、紫色',
        direction: '南方'
    },
    '土': {
        industries: ['房地产', '建筑工程', '矿业采掘', '农业种植', '仓储物流', '政府机关', '陶瓷建材', '殡葬服务', '酒店管理', '土地规划'],
        roles: ['建筑师', '地产经理', '公务员', '仓储管理', '农业专家', '行政主管', '材料工程师', '城市规划师'],
        traits: ['稳重', '可靠', '包容', '务实'],
        color: '黄色、棕色',
        direction: '中央、西南、东北'
    }
};

// 十神与人生维度对应
const TEN_GOD_ASPECTS = {
    '事业': ['正官', '七杀', '正印', '偏印'],
    '财运': ['正财', '偏财'],
    '婚恋': ['正财（男命妻星）', '正官（女命夫星）', '偏财（情人）', '七杀（异性缘）'],
    '子女': ['食神', '伤官'],
    '六亲': ['正印（母）', '偏印（继母/长辈）', '比肩（兄弟姐妹）', '劫财（兄弟姐妹）'],
    '健康': ['五行平衡', '冲克情况']
};

/**
 * 综合命理分析（六维度）
 */
function analyzeDestiny(bazi, strengthDetail, elements, gender) {
    const dayMaster = bazi.dayMaster;
    const dayElement = ELEMENTS[dayMaster];
    const tenGods = bazi.tenGods;
    const pattern = bazi.pattern;
    const usefulGod = bazi.usefulGod;
    
    const personality = STEM_PERSONALITY[dayMaster];
    
    const aspects = {
        career: analyzeCareerAspect(bazi, strengthDetail, tenGods, usefulGod, gender),
        wealth: analyzeWealth(bazi, strengthDetail, tenGods, usefulGod),
        marriage: analyzeMarriage(bazi, strengthDetail, tenGods, gender),
        children: analyzeChildren(bazi, tenGods),
        family: analyzeFamily(bazi, tenGods),
        health: analyzeHealth(bazi, elements)
    };
    
    const fortuneGuide = generateFortuneGuide(usefulGod, dayElement);
    const futureTrend = analyzeFutureTrend(bazi, usefulGod);
    const suggestions = generateOverallSuggestions(bazi, strengthDetail, aspects, usefulGod);
    
    return {
        personality,
        pattern,
        aspects,
        fortuneGuide,
        futureTrend,
        suggestions,
        disclaimer: '本分析基于传统命理理论框架，仅供娱乐参考，不构成任何决策依据。'
    };
}

/**
 * 事业分析（六维度用）
 */
function analyzeCareerAspect(bazi, strengthDetail, tenGods, usefulGod, gender) {
    const strength = strengthDetail.strength;
    const dayElement = ELEMENTS[bazi.dayMaster];
    
    const hasOfficer = tenGods.yearStem.includes('官') || tenGods.monthStem.includes('官') || tenGods.hourStem.includes('官');
    const hasSeal = tenGods.yearStem.includes('印') || tenGods.monthStem.includes('印') || tenGods.hourStem.includes('印');
    
    let careerType = '';
    let careerDetail = '';
    let suitableJobs = [];
    let advice = '';
    
    if (hasOfficer && hasSeal) {
        careerType = '官印相生型';
        careerDetail = '适合仕途、管理、公务员、国企等稳定平台，有晋升潜力。';
        suitableJobs = ['公务员', '企业管理', '国企员工', '事业单位', '法律合规', '行政管理'];
        advice = '宜选择有制度保障的平台，不宜频繁跳槽，耐心积累资历。';
    } else if (hasOfficer) {
        careerType = '官星主导型';
        careerDetail = '有管理才能，适合组织管理、中层干部、项目负责人。';
        suitableJobs = ['项目经理', '部门主管', '中层管理', '组织协调类'];
        advice = '适合在组织中发挥领导力，宜稳健发展。';
    } else if (tenGods.monthStem.includes('食') || tenGods.hourStem.includes('食')) {
        careerType = '食神生财型';
        careerDetail = '有才华技艺，适合专业技术、创意设计、咨询教育等领域。';
        suitableJobs = ['设计师', '咨询师', '教师', '技术专家', '策划', '创作者'];
        advice = '宜深耕专业技能，靠实力吃饭，不宜过度追逐名利。';
    } else if (tenGods.monthStem.includes('伤')) {
        careerType = '伤官见官型（需谨慎）';
        careerDetail = '叛逆创新，有突破精神，适合创业、技术创新、艺术创作。';
        suitableJobs = ['创业者', '技术创新', '艺术家', '自由职业', '独立执业'];
        advice = '需控制情绪，避免与权威冲突，宜选择灵活性高的工作。';
    } else {
        const dominantElement = Object.entries(bazi.elements).sort((a,b) => b[1]-a[1])[0][0];
        careerType = dominantElement + '旺主导型';
        const careerInfo = ELEMENT_CAREERS[dominantElement];
        suitableJobs = careerInfo.roles.slice(0, 5);
        careerDetail = `五行${dominantElement}旺，适合${careerInfo.industries.slice(0, 5).join('、')}等领域。`;
        advice = `宜发挥${careerInfo.traits.join('、')}特质，选择五行属${dominantElement}的行业。`;
    }
    
    if (strength === '身弱') {
        advice += ' 身弱不宜单打独斗，宜选择有团队支持的平台。';
        suitableJobs = suitableJobs.filter(j => !j.includes('创业'));
    } else if (strength === '身强') {
        advice += ' 身强可尝试创业或担任领导角色。';
        suitableJobs.push('创业者', '合伙人');
    }
    
    return {
        type: careerType,
        detail: careerDetail,
        suitableJobs,
        advice,
        warning: '【术语解释】官星：代表管理、职位；印星：代表贵人、学历；食神：代表才华技艺。'
    };
}

/**
 * 财运分析
 */
function analyzeWealth(bazi, strengthDetail, tenGods, usefulGod) {
    const strength = strengthDetail.strength;
    const hasDirectWealth = tenGods.yearStem.includes('财') || tenGods.monthStem.includes('财');
    const hasIndirectWealth = tenGods.yearStem.includes('才') || tenGods.monthStem.includes('才');
    
    let wealthLevel = '';
    let wealthSource = '';
    let wealthTrait = '';
    let advice = '';
    
    if (hasDirectWealth && hasIndirectWealth) {
        wealthLevel = '中等偏上';
        wealthSource = '正财+偏财，有稳定收入也有投资机遇';
        wealthTrait = '财运较全面，但需控制投机欲望';
        advice = '宜稳健理财，适度投资，不宜贪大求全。';
    } else if (hasDirectWealth) {
        wealthLevel = '稳定型';
        wealthSource = '正财为主，靠努力工作获取';
        wealthTrait = '勤劳务实，财源稳定但增长较慢';
        advice = '宜深耕主业，积累技能和资历，稳步提升收入。';
    } else if (hasIndirectWealth) {
        wealthLevel = '起伏型';
        wealthSource = '偏财为主，有投资、意外之财机遇';
        wealthTrait = '财运起伏大，来财快但易散财';
        advice = '宜控制风险，不宜过度投机，注意留存积蓄。';
    } else {
        wealthLevel = '平民型';
        wealthSource = '需靠专业技能或勤劳获取';
        wealthTrait = '财运平平，需踏实积累';
        advice = '宜专注提升技能，靠实力求财，不宜投机。';
    }
    
    if (strength === '身弱') {
        wealthLevel += '（身弱难担财）';
        advice += ' 身弱不宜追求大财，宜稳健为主，待运势帮扶再求进取。';
    } else if (strength === '身强') {
        wealthLevel += '（身强可担财）';
        advice += ' 身强可积极求财，有机会把握投资机遇。';
    }
    
    return {
        level: wealthLevel,
        source: wealthSource,
        trait: wealthTrait,
        advice,
        warning: '【术语解释】正财：稳定收入、工资；偏财：意外之财、投资收益；身弱难担财：财多反而压力大。'
    };
}

/**
 * 婚恋分析
 */
function analyzeMarriage(bazi, strengthDetail, tenGods, gender) {
    const dayBranch = bazi.day.branch;
    const dayBranchHidden = BRANCH_HIDDEN_STEMS[dayBranch];
    
    let spouseTrait = '';
    let marriageAge = '';
    let marriageRisk = '';
    let advice = '';
    
    const spouseTenGod = getTenGod(bazi.dayMaster, dayBranchHidden[0].stem);
    if (spouseTenGod.includes('食')) {
        spouseTrait = '配偶温和、有才艺、喜欢享受，相貌清秀';
    } else if (spouseTenGod.includes('官') || spouseTenGod.includes('杀')) {
        spouseTrait = '配偶有管理气质、正直或强势';
    } else if (spouseTenGod.includes('财')) {
        spouseTrait = '配偶务实、重视物质、善于理财';
    } else if (spouseTenGod.includes('印')) {
        spouseTrait = '配偶温和、善解人意、有学历或长辈缘分';
    } else if (spouseTenGod.includes('比') || spouseTenGod.includes('劫')) {
        spouseTrait = '配偶独立、性格相似、既是伴侣也是伙伴';
    } else {
        spouseTrait = '配偶特质需结合整体命盘分析';
    }
    
    if (tenGods.yearStem.includes('财') || tenGods.yearStem.includes('官')) {
        marriageAge = '早婚倾向（25岁前）';
    } else {
        marriageAge = '晚婚更利（28岁后），早婚易波折';
    }
    
    if (tenGods.hourStem.includes('伤')) {
        marriageRisk = '伤官透出，易有感情波折，需注意沟通';
    } else if (tenGods.yearStem.includes('劫')) {
        marriageRisk = '劫财透出，易有竞争或第三者干扰';
    } else {
        marriageRisk = '无明显婚姻风险信号';
    }
    
    advice = '婚恋需缘分配合，不宜强求，宜选择性格互补、价值观相近的对象。';
    
    return {
        spouseTrait,
        marriageAge,
        marriageRisk,
        advice
    };
}

/**
 * 子女分析
 */
function analyzeChildren(bazi, tenGods) {
    const hasShi = tenGods.monthStem.includes('食') || tenGods.hourStem.includes('食');
    const hasShang = tenGods.monthStem.includes('伤') || tenGods.hourStem.includes('伤');
    
    let childrenInfo = '';
    let childrenRelation = '';
    let advice = '';
    
    if (hasShi && hasShang) {
        childrenInfo = '食伤双显，子女缘分浓厚，子女聪明有才华';
        childrenRelation = '与子女关系良好，子女能带来成就感';
        advice = '注意培养子女独立性，不宜过度宠溺。';
    } else if (hasShi) {
        childrenInfo = '食神显，子女温和听话，有才艺天赋';
        childrenRelation = '与子女关系融洽，子女性格温和';
        advice = '宜培养子女的艺术或技术特长。';
    } else if (hasShang) {
        childrenInfo = '伤官显，子女聪明叛逆，有创新精神';
        childrenRelation = '与子女沟通需注意方式，子女个性较强';
        advice = '宜尊重子女个性，引导而非控制。';
    } else {
        childrenInfo = '食伤不明显，子女缘分需看运势';
        childrenRelation = '子女关系需后天培养';
        advice = '可多行善积德，增进子女缘分。';
    }
    
    return {
        info: childrenInfo,
        relation: childrenRelation,
        advice,
        warning: '【术语解释】食神、伤官：代表子女星，食神温和，伤官叛逆。'
    };
}

/**
 * 六亲分析
 */
function analyzeFamily(bazi, tenGods) {
    const hasZhengYin = tenGods.yearStem.includes('印') || tenGods.monthStem.includes('印');
    const hasPianYin = tenGods.yearStem.includes('枭') || tenGods.monthStem.includes('枭');
    const hasBiJian = tenGods.yearStem.includes('比') || tenGods.hourStem.includes('比');
    const hasJieCai = tenGods.yearStem.includes('劫') || tenGods.hourStem.includes('劫');
    
    let motherInfo = '';
    let siblingInfo = '';
    let advice = '';
    
    if (hasZhengYin) {
        motherInfo = '正印显，母亲缘分好，母亲为贵人';
    } else if (hasPianYin) {
        motherInfo = '偏印显，母亲关系需磨合，或有继母长辈';
    } else {
        motherInfo = '印星不显，母亲缘分需后天培养';
    }
    
    if (hasBiJian && hasJieCai) {
        siblingInfo = '比劫双显，兄弟姐妹多，有竞争也有互助';
    } else if (hasBiJian) {
        siblingInfo = '比肩显，兄弟姐妹关系平等互助';
    } else if (hasJieCai) {
        siblingInfo = '劫财显，兄弟姐妹有竞争，财物需注意';
    } else {
        siblingInfo = '比劫不显，兄弟姐妹缘分一般';
    }
    
    advice = '六亲缘分各有不同，宜珍惜亲情，和睦相处。';
    
    return {
        mother: motherInfo,
        siblings: siblingInfo,
        advice,
        warning: '【术语解释】正印：母亲；偏印：继母或长辈；比肩：兄弟姐妹（互助）；劫财：兄弟姐妹（竞争）。'
    };
}

/**
 * 健康分析
 */
function analyzeHealth(bazi, elements) {
    const sortedElements = Object.entries(elements).sort((a,b) => b[1]-a[1]);
    const dominant = sortedElements[0][0];
    const weakest = sortedElements[sortedElements.length - 1][0];
    
    let healthRisk = '';
    let healthAdvice = '';
    
    const elementHealth = {
        '木': { organ: '肝胆、筋骨、眼睛', risk: '易有肝胆不适、视力问题、关节疼痛' },
        '火': { organ: '心脏、小肠、血脉', risk: '易有心血管问题、失眠、焦虑' },
        '土': { organ: '脾胃、肌肉、消化', risk: '易有消化不良、胃病、肌肉酸痛' },
        '金': { organ: '肺、大肠、皮肤', risk: '易有呼吸道问题、皮肤过敏、便秘' },
        '水': { organ: '肾、膀胱、耳', risk: '易有泌尿问题、耳鸣、腰膝酸软' }
    };
    
    healthRisk = `${dominant}旺：需注意${elementHealth[dominant].organ}，${elementHealth[dominant].risk}。`;
    if (weakest !== dominant) {
        healthRisk += ` ${weakest}弱：需补充${elementHealth[weakest].organ}养护。`;
    }
    
    healthAdvice = '注意作息规律，适度运动，保持心情舒畅。';
    
    return {
        risk: healthRisk,
        advice: healthAdvice,
        warning: '【术语解释】五行对应脏腑：木-肝、火-心、土-脾、金-肺、水-肾。'
    };
}

/**
 * 开运指南
 */
function generateFortuneGuide(usefulGod, dayElement) {
    const useful = usefulGod.useful[0] || dayElement;
    const careerInfo = ELEMENT_CAREERS[useful];
    
    return {
        element: useful,
        direction: careerInfo.direction,
        color: careerInfo.color,
        industries: careerInfo.industries.slice(0, 3),
        traits: careerInfo.traits
    };
}

/**
 * 流年趋势（未来5年）
 */
function analyzeFutureTrend(bazi, usefulGod) {
    const currentYear = new Date().getFullYear();
    const useful = usefulGod.useful;
    const avoid = usefulGod.avoid;
    
    const trends = [];
    
    for (let i = 0; i < 5; i++) {
        const year = currentYear + i;
        const stemIdx = (year - 4) % 10;
        const branchIdx = (year - 4) % 12;
        const stem = STEMS[stemIdx];
        const branch = BRANCHES[branchIdx];
        const stemElement = ELEMENTS[stem];
        const branchElement = BRANCH_ELEMENTS[branch];
        
        const isUseful = useful.includes(stemElement) || useful.includes(branchElement);
        const isAvoid = avoid.includes(stemElement) || avoid.includes(branchElement);
        
        let rating = '';
        let ratingStars = 0;
        let advice = '';
        
        if (isUseful && !isAvoid) {
            rating = '有利年份';
            ratingStars = 4;
            advice = `天干${stem}属${stemElement}，地支${branch}属${branchElement}，为喜用五行，运势向好。`;
        } else if (isAvoid && !isUseful) {
            rating = '需谨慎年份';
            ratingStars = 2;
            advice = `天干${stem}属${stemElement}，地支${branch}属${branchElement}，为忌神五行，需保守应对。`;
        } else {
            rating = '平稳年份';
            ratingStars = 3;
            advice = `流年五行平和，运势稳定，宜稳中求进。`;
        }
        
        trends.push({
            year,
            ganzhi: stem + branch,
            element: stemElement,
            rating,
            ratingStars,
            advice
        });
    }
    
    return {
        trends,
        explanation: '【流年分析】根据喜用忌神判断每年五行属性，预测运势趋势。'
    };
}

/**
 * 综合建议
 */
function generateOverallSuggestions(bazi, strengthDetail, aspects, usefulGod) {
    const strength = strengthDetail.strength;
    const useful = usefulGod.useful.join('、');
    const avoid = usefulGod.avoid.join('、');
    
    const suggestions = [];
    
    suggestions.push(`【命盘格局】${bazi.pattern.name}，${bazi.pattern.desc}`);
    suggestions.push(`【身强弱】${strength}（评分：${strengthDetail.totalScore}），${strengthDetail.strengthDesc}`);
    suggestions.push(`【喜用神】喜${useful}，${usefulGod.usefulDesc}`);
    suggestions.push(`【忌神】忌${avoid || '无明显忌神'}，${usefulGod.avoidDesc}`);
    suggestions.push(`【事业方向】${aspects.career.type}，${aspects.career.advice}`);
    suggestions.push(`【财运建议】${aspects.wealth.advice}`);
    suggestions.push(`【健康提醒】${aspects.health.advice}`);
    
    const fortuneGuide = generateFortuneGuide(usefulGod, ELEMENTS[bazi.dayMaster]);
    suggestions.push(`【有利方位】${fortuneGuide.direction}，助力颜色${fortuneGuide.color}`);
    
    return suggestions;
}

/**
 * 兼容旧接口的职业分析（用于基础分析）
 */
function analyzeCareerBasic(bazi, strength, elements) {
    const dayMaster = bazi.dayMaster;
    const personality = STEM_PERSONALITY[dayMaster];
    const dayElement = ELEMENTS[dayMaster];
    
    const dominantElement = Object.entries(elements)
        .sort((a, b) => b[1] - a[1])[0][0];
    
    const careerInfo = ELEMENT_CAREERS[dominantElement];
    
    let adjustedCareers = [...careerInfo.industries.slice(0, 5)];
    
    if (strength.strength === '身弱') {
        adjustedCareers = adjustedCareers.filter(c => !['创业', '投资', '竞技'].some(r => c.includes(r)));
        adjustedCareers.push('教育培训', '政府机关');
    }
    
    if (strength.strength === '身强') {
        adjustedCareers.push('创业投资', '企业管理');
    }
    
    const suggestions = [];
    suggestions.push(`【性格特质】${personality.trait}型，${personality.desc}`);
    suggestions.push(`【适合行业】${careerInfo.industries.slice(0, 5).join('、')}`);
    suggestions.push(`【典型职位】${careerInfo.roles.slice(0, 4).join('、')}`);
    
    return {
        personality,
        dominantElement,
        careerInfo,
        adjustedCareers,
        suggestions,
        dayElement
    };
}

/**
 * 导出
 */
window.CareerEngine = {
    analyzeDestiny,
    analyzeCareer: analyzeCareerBasic,  // 兼容旧接口
    analyzeCareerAspect,                 // 六维度用
    STEM_PERSONALITY,
    ELEMENT_CAREERS,
    TEN_GOD_ASPECTS
};