module.exports = {

    // 任务用例id
    TMCId: { type: Number, require: true },

    // 用例名称
    TMCTestTitle: { type: String, require: true },

    // 关联主任务id
    TMCMissionId: { type: Number, require: true },

    // 用例id
    TMCTestCaseId: { type: Number, require: true },

    // 用例状态 1、未开始 2、通过 3、失败 4、无法测试 5、有遗留问题
    TMCStatus: { type: Number, require: true },

    // 创建者Num
    TMCCreatorNum: { type: Number, require: true },

    // 创建者Name
    TMCCreatorName: { type: String, require: true },

    // 创建时间
    TMCCreateDate: { type: Date, default: Date.now() },

    // 假删除标志位 1、有效 2、无效
    TMCIsValid: { type: String, require: true },

    // 测试轮数
    TMTimes: { type: Number, default: 1 },

    // 用例既定编号
    TMCCode: { type: String, require: true }
};