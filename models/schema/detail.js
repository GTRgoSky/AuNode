module.exports = {

    

    // 经办人用户名
    UserName: { type: String, required: true },

    //主任务ID
    TMId: { type: Number, default: 0},

    //子任务名词 
    TMTitle: { type: String, required: true },

    //排期时间
    TMTime:{ type: String,  },

    //状态
    TMIsFinish:{type:String},
};