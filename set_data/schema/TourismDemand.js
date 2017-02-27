module.exports = {

    // 需求Id
    TDId : { type: Number, require: true },

    // 需求名称
    TDDemandTitle : { type: String, require: true },

    // 需求PMNum
    TDDemandPMNum : { type: Number, require: true },

    // 需求PMName
    TDDemandPMName : { type: String, require: true },

    // 需求方提出部门
    TDDemandBranch : { type: Array, require: true },

    // 需求方提出人Num
    // TDDemandMakerNum : { type: Number, require: true },

    // 需求方提出人Name
    TDDemandMakerName : { type: String, require: true },

    // 是否采纳 1、采纳 2、不采纳
    TDDemandIsDeal : { type: Number, require: true },

    // 需求类型 1、专项 2、常规 3、BUG 4、协助 5、插入
    TDDemandType : { type: Number, require: true },

    // 所属小组
    TDDemandTeam : { type: Array, require: true },

    // 需求状态 1、未开始 2、进行中 3、已完成 4、需求已实
    TDDemandStatus : { type: Number, require: true },

    // 需求描述
    TDDemandDes : { type: String, require: true },

    // 需求优先级 1、高 2、中 3、低
    TDDemandRank : { type: Number, require: true },

    // 需求涉及平台
    TDDemandPlat : { type: Array, require: true },

    // 需求跟进内容
    TDDemandDCText : { type: String, require: true },

    // 开发开始时间
    TDDemandDCStartTime : { type: Date },

    // 预计上线时间
    TDDemandDCPubExpeTime : { type: Date },

    // 确认上线时间
    TDDemandDCPubConfTime : { type: Date },

    // 需求有效性 1、有效 2、无效
    TDDemandDataFlag : { type: Number, require: true },

    // 分析状态  1、未开始 2、分析中 3、分析完成 4、延期
    TDDemandAnalysisSta : { type: Number, require: true },

    // 备注
    TDDemandRemark : { type: String, require: true },

    // 需求提出时间
    // TDDemandRequestTime : { type: Date, require: true },

    // 需求是否已经转为任务 1、是 2、否
    TDDemandTurnMission : { type: Number, default: 2 },

    // 关联任务id
    TDDemandMissionId : { type: Number, default: 0 },

    // 需求创建时间
    TDDemandCreateTime : { type: Date, default: Date.now() }
};