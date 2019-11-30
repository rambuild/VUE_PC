<template>
   <div class="login_container">
      <div class="login_box">
         <div class="img_box">
            <img src="@/assets/img/logo.png" />
         </div>
         <div class="form_box">
            <el-form label-width="0" :model="form" :rules="formRules" ref="loginBox">
               <el-form-item label='' prop="user">
                  <el-input prefix-icon="iconfont icon-user" v-model="form.user" type="text"></el-input>
               </el-form-item>
               <el-form-item label='' prop="pwd">
                  <el-input prefix-icon="iconfont icon-3702mima" v-model="form.pwd" type="password"></el-input>
               </el-form-item>
               <el-form-item class="btn_box">
                  <el-button type="primary" @click="login">登陆</el-button>
                  <el-button type="info" @click="reset">重置</el-button>
               </el-form-item>
            </el-form>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   data() {
      return {
         form: {
            user: "admin",
            pwd: "123456"
         },
         formRules: {
            user: [
               { required: true, message: "请输入用户名！", trigger: "blur" },
               {
                  min: 3,
                  max: 10,
                  message: "长度须在3到10之间",
                  trigger: "blur"
               }
            ],
            pwd: [{ required: true, message: "请输入密码！", trigger: "blur" }]
         }
      };
   },
   methods: {
      reset() {
         this.$refs.loginBox.resetFields();
      },
      login() {
         this.$refs.loginBox.validate(async valid => {
            if (valid) {
               const res = await this.$http.post("login", {
                  username: this.form.user,
                  password: this.form.pwd
               });
               if (res.data.meta.status == 200) {
                  this.$message.success({
                     message: "登陆成功！",
                     center: true
                  });
                  window.sessionStorage.setItem('token',res.data.data.token);
                  window.sessionStorage.setItem('username',res.data.data.username)
                  this.$router.push('/home')
               } else {
                  this.$message.error({
                     message: "账号或密码错误！",
                     center:true
                  });
               }
            }
         });
      }
   }
};
</script>

<style lang="scss" scoped>
.login_container {
   background: rgb(43, 75, 107);
   height: 100%;
   .login_box {
      width: 650px;
      height: 350px;
      background: #fff;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      .img_box {
         width: 160px;
         height: 160px;
         border-radius: 50%;
         box-shadow: 0 0 30px #333;
         overflow: hidden;
         position: absolute;
         left: 50%;
         transform: translate(-50%, -50%);
         background: #fff;
         img {
            width: 100%;
         }
      }
      .form_box {
         position: absolute;
         width: 100%;
         bottom: 10%;
         padding: 0 180px;
         box-sizing: border-box;
         .btn_box {
            display: flex;
            justify-content: flex-end;
         }
      }
   }
}
/deep/ .el-input__prefix {
   left: 10px;
}
</style>