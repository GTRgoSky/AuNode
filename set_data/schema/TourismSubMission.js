module.exports = {
    // 子任务ID
    TSMId: { type: Number, default: 0 },

    // 所属任务ID
    TSMMissionId: { type: Number, default: 0 },

    // 子任务title
    TSMTitle: { type: String, required: true },

    // 经办人工号
    TSMOperatorNum: { type: Number, default: 0 },

    // 经办人所在组（暂时不做处理）
    TSMOperatorTeam: { type: Number, default: 0 },

    // 经办人姓名
    TSMOperatorName: { type: String, required: true },

    // 排期开始时间
    TSMStartDate: { type: Date },

    // 排期结束时间
    TSMEndDate: { type: Date },

    // 进度
    TSMPace: { type: Number, default: 0 },

    // TSMFlag: { },

    // 创建人工号
    TSMCreatorNum: { type: Number, default: 0 },

    // 创建人姓名
    TSMCreatorName: { type: String, required: true },

    // 创建日期
    TSMCreateDate: { type: Date, default: Date.now() },

    // 有效性  1、有效 2、无效
    TSMIsValid: { type: Number, default: 1 },

    // 站点
    TSMSite: { type: Array, required: true },

    // 备注
    TSMRemark: { type: String, default: '' }
};