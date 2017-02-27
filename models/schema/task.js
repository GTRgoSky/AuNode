module.exports = {

    // 任务id (使用自带的objectId，暂时未实现自增id，之后想办法)
    TMId: { type: Number, default: 0},

    // 任务名称
    TMTitle: { type: String, required: true },

    // 任务组别
    TMTeam: { type: Array, required: true },

    // 任务优先级 1、高 2、中 3、低
    TMRank: { type: Number, required: true },

    // 任务描述
    TMDescription: { type: String, required: true },

    // 任务有效性 1、有效 2、无效
    TMIsValid: { type: Number, default: 1 },

    // 创建时间（不使用objectId的时间，不想再让服务端做过多运算，直接存数据库）
    TMCreateTime: { type: Date, default: Date.now() },

    // 编辑时间 
    TMEditTime: { type: Date, default: Date.now() },

    // 删除时间 
    TMDelTime: { type: Date },

    //创建人ID
    TMUserId:{type:Number},

    //完成状态
    TMIsFinish:{type:String},

    //经办人名称
    TMDoUser:{type:Array},
};