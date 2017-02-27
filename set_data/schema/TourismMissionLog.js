module.exports = {

    // 任务日志id
    TMLId: { type: Number, default: 0 },

    // 关联任务id
    TMLMissionId: { type: Number, required: true },

    // 日志内容
    TMLContent: { type: String, required: true },

    // 创建者Num
    TMLCreatorNum: { type: Number, required: true },

    // 创建者Name
    TMLCreatorName: { type: String, required: true },

    // 创建时间
    TMLCreateDate: { type: Date, default: Date.now() }

};