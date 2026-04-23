/**
 * 职业分析模块
 * 基于 fortune-career skill 的职业匹配规则
 */

// 天干五行对应（改用 var 避免重复声明）
var ELEMENTS = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
const STEM_PERSONALITY = {
    '甲': { trait: '开创型', desc: '直来直去 · 领导欲强 · 上进不服输', keywords: ['果断', '独立', '进取', '正直'] },
    '乙': { trait: '细腻型', desc: '善于变通 · 配合度高 · 善于思考', keywords: ['灵活', '温和', '协调', '艺术'] },
    '丙': { trait: '热烈型', desc: '执行力快 · 表面外向 · 需要认可', keywords: ['热情', '社交', '领导', '表达'] },
    '丁': { trait: '内敛型', desc: '观察力强 · 温和有主见 · 善于幕后', keywords: ['细腻', '洞察', '专注', '幕后'] },
    '戊': { trait: '稳重型', desc: '踏实诚信 · 物质导向 · 抗压强', keywords: ['稳重', '可靠', '务实', '包容'] },
    '己': { trait: '包容型', desc: '善于协调 · 务实灵活 · 讨厌浮夸', keywords: ['包容', '细腻', '务实', '经营'] },
    '庚': { trait: '刚烈型', desc: '果断决绝 · 原则性强 · 不绕弯子', keywords: ['果断', '正义', '执行', '原则'] },
    '辛': { trait: '精致型', desc: '审美敏锐 · 追求完美 · 善于表达', keywords: ['精致', '审美', '表达', '完美'] },
    '壬': { trait: '流动型', desc: '好奇心强 · 适应力强 · 喜欢自由', keywords: ['自由', '探索', '适应', '统筹'] },
    '癸': { trait: '深沉型', desc: '直觉敏锐 · 善于洞察 · 内向安静', keywords: ['洞察', '思考', '直觉', '智慧'] }
};

// 十神职业倾向
const TEN_GOD_JOBS = {
    '比': ['合伙人创业', '专业技术', '自由职业', '销售'],
    '劫': ['竞技体育', '执行型工作', '团队协作'],
    '食': ['创意设计', '餐饮美食', '教育培训', '咨询顾问'],
    '伤': ['技术创新', '艺术创作', '写作出版', '独立执业'],
    '财': ['企业管理', '财务金融', '商业运营', '销售'],
    '才': ['艺术设计', '品牌管理', '媒体传播', '审美相关'],
    '官': ['公务员', '企业管理', '法律合规', '组织管理'],
    '杀': ['司法公安', '军事', '高压执行', '挑战型'],
    '枭': ['学术研究', '医疗健康', '技术研发', '专业咨询'],
    '印': ['教育', '文化出版', '政府机构', '培训']
};

// 五行行业详细匹配
const ELEMENT_CAREERS = {
    '金': {
        industries: ['金融投资', '银行保险', '珠宝首饰', '五金机械', '汽车制造', '司法法律', '军警安保', '精密仪器', '外科医疗'],
        roles: ['财务分析师', '投资经理', '法官', '审计师', '工程师', '外科医生', '军警', '机械设计师'],
        traits: ['严谨', '精确', '执行力', '原则性强']
    },
    '水': {
        industries: ['贸易物流', '航运运输', '旅游酒店', '媒体传播', '广告公关', '饮品行业', '清洁环保', '渔业水产', '通讯信息'],
        roles: ['贸易商', '物流经理', '记者', '公关', '导游', '水运调度', '媒体运营', '信息分析师'],
        traits: ['灵活', '适应力', '沟通', '洞察']
    },
    '木': {
        industries: ['教育培训', '文化出版', '农林园艺', '医药健康', '家具木材', '纺织服装', '宗教慈善', '环保公益', '人力资源'],
        roles: ['教师', '医生', '编辑', '设计师', '园艺师', '培训师', 'HR', '公益工作者'],
        traits: ['仁慈', '成长', '创造力', '协调']
    },
    '火': {
        industries: ['互联网科技', '电子电器', '能源电力', '餐饮烹饪', '化妆品', '照明光学', '影视娱乐', '体育竞技', '心理咨询'],
        roles: ['程序员', '企业家', '厨师', '美容师', '演员', '运动员', '心理咨询师', '营销'],
        traits: ['热情', '表达', '感染力', '创造力']
    },
    '土': {
        industries: ['房地产', '建筑工程', '矿业采掘', '农业种植', '仓储物流', '政府机关', '陶瓷建材', '殡葬服务', '酒店管理'],
        roles: ['建筑师', '地产经理', '公务员', '仓储管理', '农业专家', '行政主管', '材料工程师'],
        traits: ['稳重', '可靠', '包容', '务实']
    }
};

// 职业方向建议模板
const CAREER_TEMPLATES = {
    '身强': {
        direction: '主动出击型',
        advice: '适合开创性、竞争性、独立性强的工作，可尝试创业或担任领导角色',
        avoid: '不宜过于被动配合，宜主动掌握话语权'
    },
    '身弱': {
        direction: '稳中求进型',
        advice: '适合配合型、稳定型、有支持体系的工作，在团队中发挥所长',
        avoid: '不宜单打独斗，宜选择有良好平台和团队的环境'
    },
    '中和': {
        direction: '进退自如型',
        advice: '适应面广，可根据兴趣和环境灵活选择',
        avoid: '注意平衡，不宜过于极端'
    }
};

/**
 * 综合职业分析
 */
function analyzeCareer(bazi, strength, elements) {
    const dayMaster = bazi.dayMaster;
    const personality = STEM_PERSONALITY[dayMaster];
    const dayElement = ELEMENTS[dayMaster];
    
    // 找出最旺五行
    const dominantElement = Object.entries(elements)
        .sort((a, b) => b[1] - a[1])[0][0];
    
    // 找出最弱五行
    const weakestElement = Object.entries(elements)
        .sort((a, b) => a[1] - b[1])[0][0];
    
    // 获取职业建议
    const careerInfo = ELEMENT_CAREERS[dominantElement];
    const template = CAREER_TEMPLATES[strength.strength];
    
    // 根据身强弱调整建议
    let adjustedCareers = [...careerInfo.industries.slice(0, 5)];
    
    // 如果身弱，加入稳定型行业
    if (strength.strength === '身弱') {
        adjustedCareers = adjustedCareers.filter(c => 
            !['创业', '投资', '竞技'].some(r => c.includes(r))
        );
        adjustedCareers.push('教育培训', '政府机关');
    }
    
    // 如果身强，加入挑战型行业
    if (strength.strength === '身强') {
        adjustedCareers.push('创业投资', '企业管理');
    }
    
    // 综合建议
    const suggestions = generateSuggestions(bazi, strength, dominantElement, weakestElement);
    
    return {
        personality: personality,
        dominantElement: dominantElement,
        weakestElement: weakestElement,
        careerInfo: careerInfo,
        adjustedCareers: adjustedCareers,
        template: template,
        suggestions: suggestions,
        dayElement: dayElement
    };
}

/**
 * 生成综合建议
 */
function generateSuggestions(bazi, strength, dominant, weakest) {
    const suggestions = [];
    const dayElement = ELEMENTS[bazi.dayMaster];
    
    // 身强弱建议
    suggestions.push(`【性格特质】${STEM_PERSONALITY[bazi.dayMaster].trait}型，${STEM_PERSONALITY[bazi.dayMaster].desc}`);
    
    // 五行建议
    suggestions.push(`【五行旺衰】${dominant}旺(${strength.score > 3 ? '利于发挥' : '需要平衡'})，${weakest}弱(需补充)`);
    
    // 行业方向
    const careers = ELEMENT_CAREERS[dominant];
    suggestions.push(`【适合行业】${careers.industries.slice(0, 5).join('、')}`);
    
    // 典型角色
    suggestions.push(`【典型职位】${careers.roles.slice(0, 4).join('、')}`);
    
    // 发展建议
    const template = CAREER_TEMPLATES[strength.strength];
    suggestions.push(`【发展方向】${template.direction}，${template.advice}`);
    
    // 注意事项
    suggestions.push(`【注意事项】${template.avoid}`);
    
    // 环境建议
    const directions = getElementDirection(dominant);
    suggestions.push(`【有利方位】${directions}`);
    
    // 颜色建议
    const colors = getElementColor(dominant);
    suggestions.push(`【助力颜色】${colors}`);
    
    return suggestions;
}

/**
 * 五行方位
 */
function getElementDirection(element) {
    const directions = {
        '金': '西方、西北',
        '水': '北方',
        '木': '东方、东南',
        '火': '南方',
        '土': '中央、西南、东北'
    };
    return directions[element];
}

/**
 * 五行颜色
 */
function getElementColor(element) {
    const colors = {
        '金': '白色、金色、银色',
        '水': '黑色、蓝色',
        '木': '绿色、青色',
        '火': '红色、紫色、橙色',
        '土': '黄色、棕色、咖啡色'
    };
    return colors[element];
}

/**
 * 导出
 */
window.CareerEngine = {
    analyzeCareer,
    STEM_PERSONALITY,
    ELEMENT_CAREERS,
    CAREER_TEMPLATES
};