module.exports = {

    // 故障id
    TTMId: { type: Number, require: true },

    // 故障名称
    TTMTitle: { type: String, require: true },

    // 责任人Num
    TTOperatorNum: { type: Number, require: true },

    // 责任人Name
    TTOperatorName: { type: String, require: true },

    // 优先级 1、高 2、中 3、低
    TTMRank: { type: Number, require: true },

    // 影响开始时间
    TTMStartDate: { type: Date, require: true },

    // 影响结束时间
    TTMEndDate: { type: Date, require: true },

    // 涉及站点
    TTMStation: { type: Array, require: true },

    // 故障详情
    TTMContent: { type: String, require: true },

    // 创建者Num
    TTMCreatorNum: { type: Number, require: true },

    // 创建者Name
    TTMCreatorName: { type: String, require: true },

    // 创建日期
    TTMCreateDate: { type: Date, default: Date.now() },

    // 故障状态
    // TTMStatus: { type: Number, require: true },

    // 是否有效 1、有效 2、无效
    TTMIsValid: { type: Number, require: true },

    // 处理方式 1、临传 2、回滚 3、固传
    TTMHandleType: { type: Number, require: true },

    // 涉及小组
    TTMTeam: { type: Array, require: true },

    // 影响下单量
    TTMOrderCount: { type: Number, default: 0 }
};