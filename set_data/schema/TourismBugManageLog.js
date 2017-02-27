module.exports = {

    // 缺陷日志id
    TBMLId: { type: Number, require: true },

    // 关联任务id
    TBMLMissionId: { type: Number, require: true },

    // 关联缺陷id
    TBMLBugId: { type: Number, require: true },

    // 日志内容
    TBMLContent: { type: String, require: true },

    // 创建者Num
    TBMLCreatorNum: { type: Number, require: true },

    // 创建者Name
    TBMLCreatorName: { type: String, require: true },

    // 创建日期
    TBMLCreateDate: { type: Date, default: Date.now() },
};