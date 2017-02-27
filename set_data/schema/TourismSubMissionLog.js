module.exports = {
    // ID
    TSMLId: { type: Number, default: 0 },

    // 关联任务ID
    TSMLSubMissionId: { type: Number, required: true },

    // 日志内容
    TSMLContent: { type: String, required: true },

    // 创建者Num
    TSMLCreatorNum: { type: Number, required: true },

    // 创建者Name
    TSMLCreatorName: { type: String, required: true },

    // 创建时间
    TSMLCreateDate: { type: Date, default: Date.now() },

    // 主任务ID
    TSMLMissionId: { type: Number, required: true },
};