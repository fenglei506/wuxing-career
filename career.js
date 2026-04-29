/**
 * 命理分析模块 - 专业版
 * 六维度分析：事业、财运、婚恋、子女、六亲、健康
 * 包含大运流年趋势预测
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
    
    // 性格特质
    const personality = STEM_PERSONALITY[dayMaster];
    
    // 六维度分析
    const aspects = {
        career: analyzeCareer(bazi, strengthDetail, tenGods, usefulGod, gender),
        wealth: analyzeWealth(bazi, strengthDetail, tenGods, usefulGod),
        marriage: analyzeMarriage(bazi, strengthDetail, tenGods, gender),
        children: analyzeChildren(bazi, tenGods),
        family: analyzeFamily(bazi, tenGods),
        health: analyzeHealth(bazi, elements)
    };
    
    // 开运指南
    const fortuneGuide = generateFortuneGuide(usefulGod, dayElement);
    
    // 流年趋势（未来5年）
    const futureTrend = analyzeFutureTrend(bazi, usefulGod);
    
    // 综合建议
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
 * 事业分析
 */
function analyzeCareer(bazi, strengthDetail, tenGods, usefulGod, gender) {
    const strength = strengthDetail.strength;
    const dayElement = ELEMENTS[bazi.dayMaster];
    
    // 检查官杀印星情况
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
        // 按五行旺衰
        const dominantElement = Object.entries(bazi.elements).sort((a,b) => b[1]-a[1])[0][0];
        careerType = dominantElement + '旺主导型';
        const careerInfo = ELEMENT_CAREERS[dominantElement];
        suitableJobs = careerInfo.roles.slice(0, 5);
        careerDetail = `五行${dominantElement}旺，适合${careerInfo.industries.slice(0, 5).join('、')}等领域。`;
        advice = `宜发挥${careerInfo.traits.join('、')}特质，选择五行属${dominantElement}的行业。`;
    }
    
    // 身强弱调整
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
    
    // 身强弱影响
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
    
    // 婚姻宫（日支）分析
    let spouseTrait = '';
    let marriageAge = '';
    let marriageRisk = '';
    let advice = '';
    
    // 日支藏干看配偶特质
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
    
    // 婚姻年龄倾向
    if (tenGods.yearStem.includes('财') || tenGods.yearStem.includes('官')) {
        marriageAge = '早婚倾向（25岁前）';
    } else {
        marriageAge = '晚婚更利（28岁后），早婚易波折';
    }
    
    // 婚姻风险
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
        advice,
        warning: '【术语解释】婚姻宫：日支代表配偶位置；伤官：易挑剔不满；劫财：易有竞争干扰。'
    };
}

/**
 * 子女分析
 */
function analyzeChildren(bazi, tenGods) {
    const hasFoodGod = tenGods.yearStem.includes('食') || tenGods.monthStem.includes('食') || tenGods.hourStem.includes('食');
    const hasHurtOfficer = tenGods.yearStem.includes('伤') || tenGods.monthStem.includes('伤') || tenGods.hourStem.includes('伤');
    
    let childrenTendency = '';
    let firstChildGender = '';
    let parentingAdvice = '';
    
    if (hasFoodGod) {
        childrenTendency = '食神旺，与子女缘分深，子女性格温和';
        firstChildGender = '头胎生女概率较高';
        parentingAdvice = '宜宽松教育，培养子女才艺和兴趣';
    } else if (hasHurtOfficer) {
        childrenTendency = '伤官旺，子女聪明叛逆，需耐心教育';
        firstChildGender = '头胎生男概率较高';
        parentingAdvice = '宜引导而非压制，培养子女独立思考';
    } else {
        childrenTendency = '子女缘分需结合大运分析';
        firstChildGender = '不确定，需综合判断';
        parentingAdvice = '宜用心经营亲子关系';
    }
    
    return {
        tendency: childrenTendency,
        firstChildGender,
        parentingAdvice,
        warning: '【术语解释】食神：代表子女（女命）、温和才华；伤官：代表子女（男命）、叛逆创新。'
    };
}

/**
 * 六亲分析
 */
function analyzeFamily(bazi, tenGods) {
    const yearStem = tenGods.yearStem;
    const monthStem = tenGods.monthStem;
    
    let fatherRelation = '';
    let motherRelation = '';
    let siblingRelation = '';
    
    // 父亲（年柱偏财）
    if (yearStem.includes('才')) {
        fatherRelation = '年柱偏财，与父亲缘分一般，或父亲运势起伏较大';
    } else if (yearStem.includes('财')) {
        fatherRelation = '年柱正财，父亲务实稳重，关系较稳定';
    } else {
        fatherRelation = '年柱无明显财星，父亲缘分需综合分析';
    }
    
    // 母亲（月柱印星）
    if (monthStem.includes('印')) {
        motherRelation = '月柱印星，与母亲缘分深，能得母亲关爱和支持';
    } else if (monthStem.includes('枭')) {
        motherRelation = '月柱偏印，与母亲关系复杂，或母亲性格独特';
    } else {
        motherRelation = '月柱无明显印星，母亲缘分需综合分析';
    }
    
    // 兄弟姐妹（比劫）
    const hasBrother = Object.values(tenGods).some(t => t.includes('比') || t.includes('劫'));
    if (hasBrother) {
        siblingRelation = '命带比劫，有兄弟姐妹缘分，但需注意财物竞争';
    } else {
        siblingRelation = '比劫不明显，兄弟姐妹缘分较淡';
    }
    
    return {
        fatherRelation,
        motherRelation,
        siblingRelation,
        warning: '【术语解释】年柱：代表父母、祖辈；月柱：代表父母、兄弟；比劫：代表兄弟姐妹。'
    };
}

/**
 * 健康分析
 */
function analyzeHealth(bazi, elements) {
    const dominant = Object.entries(elements).sort((a,b) => b[1]-a[1])[0][0];
    const weakest = Object.entries(elements).sort((a,b) => a[1]-b[1])[0][0];
    
    // 五行与健康对应
    const healthMap = {
        '木': { organs: '肝胆、筋骨、眼睛', diseases: '肝病、胆结石、筋骨酸痛、近视' },
        '火': { organs: '心脏、血液、小肠', diseases: '心血管问题、失眠、血压不稳' },
        '土': { organs: '脾胃、消化系统', diseases: '胃病、消化不良、糖尿病' },
        '金': { organs: '肺、大肠、皮肤', diseases: '呼吸系统问题、皮肤病、便秘' },
        '水': { organs: '肾、膀胱、泌尿系统', diseases: '肾虚、泌尿问题、腰痛' }
    };
    
    const weakHealth = healthMap[weakest];
    const strongHealth = healthMap[dominant];
    
    return {
        weakOrgans: weakHealth.organs,
        potentialDiseases: weakHealth.diseases,
        advice: `五行${weakest}弱，需重点关注${weakHealth.organs}健康。建议定期体检，注意${weakHealth.diseases.split(',')[0]}的预防。`,
        warning: '【术语解释】五行旺衰：某五行过弱，对应脏腑易有问题；过旺也可能导致失衡。'
    };
}

/**
 * 开运指南
 */
function generateFortuneGuide(usefulGod, dayElement) {
    const useful = usefulGod.useful;
    const mainUseful = useful[0] || dayElement;
    
    const guide = {
        '金': { direction: '西方、西北方', color: '白色、金色、银色', number: '4、9', item: '金银首饰、金属饰品', season: '秋季' },
        '水': { direction: '北方', color: '黑色、蓝色', number: '1、6', item: '水晶、珍珠、水景', season: '冬季' },
        '木': { direction: '东方、东南方', color: '绿色、青色', number: '3、8', item: '木质手串、绿植', season: '春季' },
        '火': { direction: '南方', color: '红色、紫色、橙色', number: '2、7', item: '红宝石、电子设备', season: '夏季' },
        '土': { direction: '中央、西南、东北', color: '黄色、棕色、咖啡色', number: '5、10', item: '玉石、陶瓷', season: '四季之交' }
    };
    
    const g = guide[mainUseful];
    
    return {
        element: mainUseful,
        direction: g.direction,
        color: g.color,
        number: g.number,
        item: g.item,
        season: g.season,
        explanation: `【开运原理】喜用神为${mainUseful}，通过方位、颜色、数字等五行属性增强运势。`
    };
}

/**
 * 流年趋势分析（未来5年）
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
        
        // 判断流年五行是否喜用
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
    
    // 基于身强弱
    suggestions.push(`【命盘格局】${bazi.pattern.name}，${bazi.pattern.desc}`);
    suggestions.push(`【身强弱】${strength}（评分：${strengthDetail.totalScore}），${strengthDetail.strengthDesc}`);
    suggestions.push(`【喜用神】喜${useful}，${usefulGod.usefulDesc}`);
    suggestions.push(`【忌神】忌${avoid || '无明显忌神'}，${usefulGod.avoidDesc}`);
    
    // 事业建议
    suggestions.push(`【事业方向】${aspects.career.type}，${aspects.career.advice}`);
    
    // 财运建议
    suggestions.push(`【财运建议】${aspects.wealth.advice}`);
    
    // 健康建议
    suggestions.push(`【健康提醒】${aspects.health.advice}`);
    
    // 发展方向
    const fortuneGuide = generateFortuneGuide(usefulGod, ELEMENTS[bazi.dayMaster]);
    suggestions.push(`【有利方位】${fortuneGuide.direction}，助力颜色${fortuneGuide.color}`);
    
    return suggestions;
}

/**
 * 兼容旧接口的职业分析
 */
function analyzeCareer(bazi, strength, elements) {
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
    analyzeCareer,
    STEM_PERSONALITY,
    ELEMENT_CAREERS,
    TEN_GOD_ASPECTS
};