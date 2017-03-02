module.exports = {

   // 用户ID
    UserId: { type: Number, default: 0},

    // 用户名
    UserName: { type: String, required: true },

    //用户密码
    UserPassWord:{type: String, required: true },

    //用户权限
    UserRoot:{type:Number,required:true}
};