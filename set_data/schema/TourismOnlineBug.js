module.exports = {

    // 线上BUGId
    TOBId: { type: Number, require: true },

    // 线上BUG标题
    TOBTitle: { type: String, require: true },

    // 线上BUG详情
    TOBDetail: { type: String, require: true },

    // 责任人Num
    TOBOperatorNum: { type: Number, require: true },

    // 责任人Name
    TOBOperatorName: { type: String, require: true },

    // 责任人所在组
    TOBOperatorTeam: { type: String, require: true },

    // 涉及站点
    TOBSite: { type: Array, require: true },

    // 处理状态(1、未处理 2、已处理 3、无效)
    TOBFlag: { type: Number, require: true },

    // 发布类型(3、固传 4、临传)
    TOBPubType: { type: Number, default: 0 },

    // 发布时间
    TOBPubDate: { type: Date, require: true },

    //
    // TOBDataFlag: { type: Number, require: true },

    // 创建者Num
    TOBCreatorNum: { type: Number, require: true },

    // 创建者Name
    TOBCreatorName: { type: String, require: true },

    // 创建时间
    TOBCreateDate: { type: Date, default: Date.now() },

    // 优先级 1、高 2、中 3、低
    TOBRank: { type: Number, require: true },

    // 申请时间
    TPMApplyDate: { type: Date, default: Date.now() },

};