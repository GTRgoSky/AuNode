module.exports = {

    // 发布id
    TPMId: { type: Number, require: true },

    // 关联任务站点
    TPMSite: { type: Array, require: true },

    // 关联任务组站点
    // TPMTeam: { type: Array, require: true },

    // 经办人Num
    TPMOperatorNum: { type: Array, require: true },

    // 经办人Name
    TPMOperatorName: { type: Array, require: true },

    // 状态 1、未处理 2、处理
    TPMFlag: { type: Number, require: true },

    // 发布类型 1、发布固传 2、发布临传 3、BUG固传 4、BUG临传
    TPMType: { type: Number, require: true },

    //
    // TPMRemark: { type: Number, require: true },

    // 创建者Num
    TPMCreatorNum: { type: Array, require: true },

    // 创建者Name
    TPMCreatorName: { type: Array, require: true },

    // 创建日期
    TPMCreateDate: { type: Date, default: Date.now() },

    // 发布有效性
    // TPMIsValid: { type: Number, require: true },

    // 所属任务Id
    TPMMissionId: { type: Array, require: true },

    // 所属任务名称
    TPMMissionName: { type: Array, require: true },

    // 发布时间
    TPMPublishDate: { type: Date, require: true },

    // 处理时间
    TPMManageDate: { type: Date, default: Date.now() },

    //
    // TPMReleaseCome: { type: Number, require: true },

    // 处理人Name
    TPMApproverNum:{ type: Array, require: true },

    // 处理人Name
    TPMApproverName:{ type: Array, require: true }

};