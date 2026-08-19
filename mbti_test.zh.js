/**
 * MBTI 风格性格测试 — 中文题目与结果数据
 * Copyright (c) 2025 braindetox.kr
 * All rights reserved.
 *
 * 必须在 mbti_test.js 之前加载，用于覆盖韩文默认数据。
 * 题目数量、选项数量、维度键 (E/I, S/N, T/F, J/P) 以及 16 种类型的键
 * 必须与韩文数据完全一致，否则计分会出错。
 * 措辞采用「倾向」而非断言：这是供娱乐的自测问卷，并非官方 MBTI® 测评。
 */

window.MBTI_QUESTIONS = [
    {
        id: 1,
        question: "在聚会或聚餐场合，你通常会……",
        answers: [
            { text: "和很多人聊天，越聊越有精神", type: "E", score: 2 },
            { text: "和几位熟悉的朋友深入地聊", type: "I", score: 2 }
        ]
    },
    {
        id: 2,
        question: "接收新信息时，你会……",
        answers: [
            { text: "先关注具体的事实和细节", type: "S", score: 2 },
            { text: "先想整体的含义和往后的可能性", type: "N", score: 2 }
        ]
    },
    {
        id: 3,
        question: "做重要决定时，你更看重的是……",
        answers: [
            { text: "逻辑分析与客观事实", type: "T", score: 2 },
            { text: "相关的人的感受与价值观", type: "F", score: 2 }
        ]
    },
    {
        id: 4,
        question: "在日常生活中，你会……",
        answers: [
            { text: "先定好计划，按部就班地做", type: "J", score: 2 },
            { text: "随情况灵活调整着做", type: "P", score: 2 }
        ]
    },
    {
        id: 5,
        question: "遇到初次见面的人，你会……",
        answers: [
            { text: "主动走过去先开口", type: "E", score: 2 },
            { text: "等对方先来搭话", type: "I", score: 2 }
        ]
    },
    {
        id: 6,
        question: "解决问题时，你会……",
        answers: [
            { text: "用过往经验和已验证的方法", type: "S", score: 2 },
            { text: "尝试新想法和有创意的做法", type: "N", score: 2 }
        ]
    },
    {
        id: 7,
        question: "发生分歧时，你会……",
        answers: [
            { text: "依据事实、按逻辑把问题理清", type: "T", score: 2 },
            { text: "努力去理解彼此的心情", type: "F", score: 2 }
        ]
    },
    {
        id: 8,
        question: "安排假期时，你会……",
        answers: [
            { text: "提前把行程排得比较细", type: "J", score: 2 },
            { text: "只定个大概，到了再随性发挥", type: "P", score: 2 }
        ]
    },
    {
        id: 9,
        question: "你恢复精力的方式是……",
        answers: [
            { text: "和大家一起做点活动", type: "E", score: 2 },
            { text: "留出独处的安静时间", type: "I", score: 2 }
        ]
    },
    {
        id: 10,
        question: "学习新东西时，你更偏好……",
        answers: [
            { text: "一步一步扎实地学", type: "S", score: 2 },
            { text: "先把整体框架弄明白", type: "N", score: 2 }
        ]
    },
    {
        id: 11,
        question: "被批评的时候，你会……",
        answers: [
            { text: "客观分析，找出可以改进的地方", type: "T", score: 2 },
            { text: "虽然难过，但会试着理解对方的用意", type: "F", score: 2 }
        ]
    },
    {
        id: 12,
        question: "推进一个项目时，你会……",
        answers: [
            { text: "定下截止时间，照计划推进", type: "J", score: 2 },
            { text: "随情况灵活地调整节奏", type: "P", score: 2 }
        ]
    },
    {
        id: 13,
        question: "在讨论场合，你会……",
        answers: [
            { text: "比较主动地把想法说出来", type: "E", score: 2 },
            { text: "先想清楚再开口", type: "I", score: 2 }
        ]
    },
    {
        id: 14,
        question: "读书时，你更喜欢……",
        answers: [
            { text: "实用而具体的内容", type: "S", score: 2 },
            { text: "偏思辨、偏抽象的内容", type: "N", score: 2 }
        ]
    },
    {
        id: 15,
        question: "在团队协作中，你更关注……",
        answers: [
            { text: "效率与产出", type: "T", score: 2 },
            { text: "成员之间的融洽与配合", type: "F", score: 2 }
        ]
    },
    {
        id: 16,
        question: "购物的时候，你会……",
        answers: [
            { text: "只买计划中需要的东西", type: "J", score: 2 },
            { text: "逛着逛着看到喜欢的就当场买下", type: "P", score: 2 }
        ]
    },
    {
        id: 17,
        question: "压力大的时候，你会……",
        answers: [
            { text: "约朋友见面聊一聊", type: "E", score: 2 },
            { text: "自己待着，把思绪整理清楚", type: "I", score: 2 }
        ]
    },
    {
        id: 18,
        question: "你偏好的旅行方式是……",
        answers: [
            { text: "把知名景点和餐厅有条理地逛一遍", type: "S", score: 2 },
            { text: "体验当地文化，发现些没见过的东西", type: "N", score: 2 }
        ]
    },
    {
        id: 19,
        question: "需要做出关键判断时，你会……",
        answers: [
            { text: "依据数据和逻辑来判断", type: "T", score: 2 },
            { text: "依据直觉和自己的价值观来判断", type: "F", score: 2 }
        ]
    },
    {
        id: 20,
        question: "你偏好的工作环境是……",
        answers: [
            { text: "规则清晰、体系分明的环境", type: "J", score: 2 },
            { text: "自由而有弹性的环境", type: "P", score: 2 }
        ]
    }
];

window.MBTI_RESULTS = {
    "ENFP": {
        title: "热情洋溢的自由灵魂",
        nickname: "竞选者",
        description: "这一类型常被描述为热情、有想象力且乐于交往，倾向于总能找到值得一笑的事和值得期待的方向。",
        strengths: ["表达与沟通顺畅", "热情容易感染他人", "想法有创意、不落俗套", "好奇心强、心态开放"],
        weaknesses: ["注意力容易分散", "不太擅长制定和坚持计划", "压力之下容易变得敏感", "对重复性事务容易厌倦"],
        careers: ["市场营销", "心理咨询师", "记者", "作家", "演艺工作者", "教师"],
        compatibility: ["INFJ (提倡者)", "INTJ (建筑师)"]
    },
    "ENFJ": {
        title: "富有感召力的理想主义者",
        nickname: "主人公",
        description: "这一类型常被描述为天生的引路人，倾向于用温度和信念给身边的人指出可以努力的方向。",
        strengths: ["带领团队的能力", "对他人有深切共情", "有说服力的表达", "热忱且有存在感"],
        weaknesses: ["习惯把他人放在自己之前", "把批评看得太重", "偏向追求完美", "容易忽略自己的情绪"],
        careers: ["教师", "心理咨询师", "公共事务工作者", "人力资源", "教练", "社会工作者"],
        compatibility: ["INFP (调停者)", "ISFP (探险家)"]
    },
    "ENTP": {
        title: "乐于思辨的创新者",
        nickname: "辩论家",
        description: "这一类型常被描述为享受智力挑战的革新者，倾向于反复琢磨新点子和各种可能性。",
        strengths: ["思路新、敢于革新", "善于组织论点", "反应快、机敏", "上手学习速度快"],
        weaknesses: ["对重复性事务容易厌倦", "细节容易被忽略", "更看重逻辑而非情绪", "偏爱开头胜过收尾"],
        careers: ["产品开发", "律师", "顾问", "创业者", "科研人员", "记者"],
        compatibility: ["INFJ (提倡者)", "INTJ (建筑师)"]
    },
    "ENTJ": {
        title: "果敢的统帅",
        nickname: "指挥官",
        description: "这一类型常被描述为目标明确、敢下决断，倾向于朝目标推进的同时把其他人也带上路。",
        strengths: ["有决断力的领导", "战略性思考", "目标导向明确", "追求效率"],
        weaknesses: ["容易忽略他人的感受", "批评有时偏严厉", "耐心不容易维持", "有时显得独断"],
        careers: ["企业高管", "管理者", "律师", "投资人", "顾问", "公共事务工作者"],
        compatibility: ["INFP (调停者)", "INTP (逻辑学家)"]
    },
    "INFP": {
        title: "珍视信念的理想主义者",
        nickname: "调停者",
        description: "这一类型常被描述为理想主义且忠于内心，倾向于把自己的价值观和信念看作值得守护的东西。",
        strengths: ["价值观稳定、信念清晰", "富有创造力与想象力", "对他人有深切共情", "独立、能自己拿主意"],
        weaknesses: ["期待容易跑在现实前面", "对自己要求过于苛刻", "对压力比较敏感", "倾向回避正面冲突"],
        careers: ["作家", "心理咨询师", "艺术工作者", "社会工作者", "心理学研究", "编辑"],
        compatibility: ["ENFJ (主人公)", "ENTJ (指挥官)"]
    },
    "INFJ": {
        title: "富有洞察力的倡导者",
        nickname: "提倡者",
        description: "这一类型常被描述为有理想、讲原则，倾向于对「什么才重要」有一套自己笃定的判断。",
        strengths: ["看人看事的洞察力", "直觉敏锐", "对他人细致体贴", "想法有创意、不落俗套"],
        weaknesses: ["偏向追求完美", "过于敏感而容易耗神", "期待容易跑在现实前面", "认定之后不太容易改口"],
        careers: ["心理咨询师", "作家", "教师", "研究人员", "艺术工作者", "心理学研究"],
        compatibility: ["ENFP (竞选者)", "ENTP (辩论家)"]
    },
    "INTP": {
        title: "好奇的思考者",
        nickname: "逻辑学家",
        description: "这一类型常被描述为求知欲强、习惯理论思考，倾向于被需要慢慢拆解的复杂问题吸引。",
        strengths: ["逻辑推理能力强", "解决问题的思路有创意", "独立而客观", "上手学习速度快"],
        weaknesses: ["不容易把情绪讲出口", "想法常快过执行", "社交场合会有些别扭", "对日常事务性工作兴趣不高"],
        careers: ["研究员", "科学家", "程序员", "大学教师", "分析师", "哲学研究"],
        compatibility: ["ENTJ (指挥官)", "ESTJ (总经理)"]
    },
    "INTJ": {
        title: "深谋远虑的战略家",
        nickname: "建筑师",
        description: "这一类型常被描述为独立而擅长布局，倾向于按自己的构想持续推进，直到做成为止。",
        strengths: ["搭建战略的能力", "独立、自我驱动", "拿定主意后行动果断", "有条理且讲究效率"],
        weaknesses: ["社交场合会有些别扭", "批评有时偏严厉", "不太表露情绪", "完美主义带来额外压力"],
        careers: ["战略规划", "研究员", "建筑师", "投资人", "企业高管", "顾问"],
        compatibility: ["ENFP (竞选者)", "ENTP (辩论家)"]
    },
    "ESFP": {
        title: "活力四射的表演者",
        nickname: "表演者",
        description: "这一类型常被描述为有活力、不受拘束，倾向于在有人相伴、有事发生的场合最为自在。",
        strengths: ["善于与人相处", "心态积极乐观", "灵活、适应得快", "务实、脚踏实地"],
        weaknesses: ["觉得做计划比较麻烦", "注意力不容易持久", "倾向回避正面冲突", "对压力比较敏感"],
        careers: ["演艺工作者", "销售", "活动策划", "设计师", "厨师", "运动员"],
        compatibility: ["ISFJ (守卫者)", "ISTJ (物流师)"]
    },
    "ESFJ": {
        title: "体贴周到的社交者",
        nickname: "执政官",
        description: "这一类型常被描述为亲和而外向，倾向于照顾身边的人，并让气氛保持融洽。",
        strengths: ["善于与人相处", "体贴且愿意配合", "责任心强", "做事有条理"],
        weaknesses: ["把批评看得太重", "倾向回避正面冲突", "对变动有些抗拒", "容易把自己的需要往后排"],
        careers: ["护士", "教师", "人力资源", "社会工作者", "行政助理", "销售"],
        compatibility: ["ISFP (探险家)", "ISTP (鉴赏家)"]
    },
    "ESTP": {
        title: "敢于冒险的行动派",
        nickname: "企业家",
        description: "这一类型常被描述为现实而行动力强，倾向于在需要当场解决问题时发挥得最好。",
        strengths: ["执行到底的行动力", "临场应变时沉得住气", "外向而活跃", "对情势的判断敏锐"],
        weaknesses: ["长期规划相对薄弱", "容易凭一时冲动行事", "容易忽略情绪层面", "对重复性工作容易厌倦"],
        careers: ["销售", "运动员", "创业者", "警察", "消防员", "急救人员"],
        compatibility: ["ISFJ (守卫者)", "ISTJ (物流师)"]
    },
    "ESTJ": {
        title: "讲求秩序的管理者",
        nickname: "总经理",
        description: "这一类型常被描述为有条理且务实，倾向于看重秩序与既有经验，把事情安排到能跑得动为止。",
        strengths: ["有决断力的领导", "有条理、组织性强", "责任心强", "现实而讲求实用"],
        weaknesses: ["不太懂得变通", "容易忽略情绪层面", "对变动有些抗拒", "有时把控得过紧"],
        careers: ["管理者", "公务员", "会计师", "银行从业者", "军官", "法官"],
        compatibility: ["ISFP (探险家)", "INTP (逻辑学家)"]
    },
    "ISFP": {
        title: "感受细腻的艺术家",
        nickname: "探险家",
        description: "这一类型常被描述为温和而好接近，倾向于带着艺术气质，安静地守着自己在意的价值。",
        strengths: ["审美感觉敏锐", "对他人有深切共情", "灵活而开放", "谦和、不张扬"],
        weaknesses: ["不太主动表达主张", "觉得做计划比较麻烦", "对压力比较敏感", "偶尔想从现实里躲开"],
        careers: ["艺术工作者", "设计师", "心理咨询师", "音乐人", "作家", "摄影师"],
        compatibility: ["ENFJ (主人公)", "ESFJ (执政官)"]
    },
    "ISFJ": {
        title: "温暖可靠的守护者",
        nickname: "守卫者",
        description: "这一类型常被描述为温厚而可靠，倾向于主动去照看和帮助身边的人。",
        strengths: ["责任心强", "对他人细致体贴", "始终如一的可靠", "务实、脚踏实地"],
        weaknesses: ["不太主动表达主张", "对变动有些抗拒", "习惯把压力憋在心里", "有时付出得超过自己的余力"],
        careers: ["护士", "教师", "心理咨询师", "社会工作者", "行政助理", "图书馆员"],
        compatibility: ["ESFP (表演者)", "ESTP (企业家)"]
    },
    "ISTP": {
        title: "动手能力强的解决者",
        nickname: "鉴赏家",
        description: "这一类型常被描述为安静、不多话，但真到了要修要解的时候，倾向于显出很强的实操本事。",
        strengths: ["实操解决问题的能力", "务实、脚踏实地", "灵活、适应得快", "独立、不受拘束"],
        weaknesses: ["不太表露情绪", "长期计划不太做得起来", "社交场合会有些别扭", "有时显得对人淡淡的"],
        careers: ["技术员", "维修技师", "工程师", "飞行员", "外科医生", "建筑师"],
        compatibility: ["ESFJ (执政官)", "ESTJ (总经理)"]
    },
    "ISTJ": {
        title: "踏实稳健的现实主义者",
        nickname: "物流师",
        description: "这一类型常被描述为慎重而按部就班，倾向于看重秩序，也看重事情有没有做到位。",
        strengths: ["责任心强", "交给他能放心的稳妥", "有条理、组织性强", "对情势的判断敏锐"],
        weaknesses: ["不太懂得变通", "对变动有些抗拒", "不太表露情绪", "偏向追求完美"],
        careers: ["会计师", "公务员", "银行从业者", "法务人员", "医生", "管理者"],
        compatibility: ["ESFP (表演者)", "ESTP (企业家)"]
    }
};
