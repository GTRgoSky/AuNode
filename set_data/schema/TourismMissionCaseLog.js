module.exports = {

    // id
    TMCLId:{ type: Number, require: true },

    // 关联任务id
    TMCLMissionId:{ type: Number, require: true },

    // 日志内容
    TMCLContent:{ type: String, require: true },

    // 创建者Num
    TMCLCreatorNum:{ type: Number, require: true },

    // 创建者Name
    TMCLCreatorName:{ type: String, require: true },

    // 创建时间
    TMCLCreateDate:{ type: Date, default: Date.now() },

    // 关联任务用例id
    TMCLMissionCaseId:{ type: Number, require: true },
};