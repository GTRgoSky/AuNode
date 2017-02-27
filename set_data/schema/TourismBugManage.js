module.exports = {

    // 缺陷id
    TBMId: { type: Number, require: true },

    // 关联任务id
    TBMMissionId: { type: Number, require: true },

    // 缺陷标题
    TBMTitle: { type: String, require: true },

    // 缺陷测试时间
    TBMTestDate: { type: Date, default: Date.now() },

    // 编辑者Num
    TBMCommitorNum: { type: Number, require: true },

    // 编辑者Name
    TBMCommitorName: { type: String, require: true },

    // 任务优先级 1、高 2、中 3、低
    TBMRank: { type: Number, default: 1 },

    // 经办人Num
    TBMDealorNum: { type: Number, require: true },

    // 经办人Name
    TBMDealorName: { type: String, require: true },

    // 缺陷测试轮数 1、第1轮 2、第2轮 3、第3轮
    TBMVersion: { type: Number, default: 1 },

    // 是否可重现 1、可以 2、不可以
    TBMReappear: { type: Number, default: 1 },

    // 所属小组
    TBMProject: { type: String, require: true },

    // 涉及平台
    TBMPlat: { type: Array, require: true },

    // 缺陷状态 1、New 2、Open 3、Fixed 4、Reopen 5、Closed 6、Rejected 7、Delay
    TBMStatus: { type: Number, default: 1 },

    // 缺陷描述
    TBMDescription: { type: String, require: true },

    // 缺陷备注
    TBMRemark: { type: String, default: '' },

    // 创建者Num
    TBMCreatorNum: { type: Number, default: 1 },

    // 创建者Name
    TBMCreatorName: { type: String, require: true },

    // 创建时间
    TBMCreateDate: { type: Date, default: Date.now() },

    // 是否是优化建议 1、是 2、否
    TBMOptimizationTips: { type: Number, default: 1 },

    // 有效性 1、有效 2、无效
    TBMIsValid: { type: Number, default: 1 },

    // 更新时间
    TBMUpdateDate: { type: Date, default: Date.now() }
};