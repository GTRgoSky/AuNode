module.exports = {

    

    // BUG的id
    Bugid : { type: Number, default: 0 },

    //Bug的名称
    BugName:{type:String,required:true},

    //Bug创建人
    BugCreat:{type:String,required:true},

    //Bug责任人
    BugUse:{type:String,required:true},

    //Bug等级
    BugType:{type:Number,default:3},

    //Bug状态
    BugFinish:{type:Number,default:3},
    
    //Bug有效
    BugIsValid:{type:Number,default:1},

    //Bug原因
    BugCont:{type:String}

};