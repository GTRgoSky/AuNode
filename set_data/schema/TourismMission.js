module.exports = {

    // 任务id (使用自带的objectId，暂时未实现自增id，之后想办法)
    TMId: { type: Number, default: 0 },

    // 任务名称
    TMTitle: { type: String, required: true },

    // 任务平台
    TMPlat: { type: Array, required: true },

    // 任务组别
    TMTeam: { type: Array, required: true },

    // 任务描述
    TMDescription: { type: String, required: true },

    // 任务优先级 1、高 2、中 3、低
    TMRank: { type: Number, required: true },

    // PMNum
    TMPmUserNum: { type: Number, required: true },

    // PMName
    TMPmUserName: { type: String, default: '' },

    // 备注
    TMRemark: { type: String, default: '' },

    // 创建者Num
    TMCreatorNum: { type: Number, required: true },

    // 创建者Name
    TMCreatorName: { type: String, required: true },

    // 创建时间（不使用objectId的时间，不想再让服务端做过多运算，直接存数据库）
    TMCreateTime: { type: Date, default: Date.now() },

    // 任务等级说明
    TMRankDescription: { type: String, default: '' },

    // 任务状态 1、进行中 2、通过（待结案或待发布） 3、待发布 4、待结案 5、结案 6、无效
    TMStatus: { type: Number, default: 1 },

    // 是否需要测试 1、需要 2、不需要
    TMIsNeedTest: { type: Number, default: 1 },

    // 是否需要发布 1、需要 2、不需要
    TMIsRelease: { type: Number, default: 1 },

    // 是否需要创建附件 1、需要 2、不需要
    TMIsCreateFolder: { type: Number, default: 1 },

    // 依赖需求ID 0、非需求转来
    TMDemandId: { type: Number, default: 0 },

    // 编辑时间 
    TMEditTime: { type: Date, default: Date.now() },

    // 删除时间 
    TMDelTime: { type: Date },

    // 发布时间
    TMPubTime: { type: Date },

    // 申请发布时间
    TMApplyPubTime: { type: Date },

    // 发布类型 0、为选择发布类型 1、固传 2、临传
    TMPubType: { type: Number, default: 0 }
};