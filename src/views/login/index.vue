<template>
<div class="login-container">
  <el-row class="login-box" type="flex" align="middle">
    <div class="login-logo">
      <img class="logo-img"  src="/static/image/logo.png">
    </div>
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="username">
      <span class="svg-container"><icon-svg icon-class="username"></icon-svg></span>
      <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="账户"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <span class="svg-container"><icon-svg icon-class="mima"></icon-svg></span>
      <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
        登录
      </el-button>
    </el-form-item>
  </el-form>
  </el-row>
  <el-dialog title="第三方验证" :visible.sync="showDialog">
    邮箱登录成功,请选择第三方验证
    <social-sign></social-sign>
  </el-dialog>

</div>
</template>

<script>
import socialSign from './socialsignin';

export default {
  components: {
    socialSign
  },
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [{
          required: true,
          message: '账户不能为空',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePass
        }]
      },
      loading: false,
      showDialog: false
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
            this.loading = false;
            this.$router.push({
              path: '/'
            });
            // this.showDialog = true;
          }).catch(() => {
            this.loading = false;
          });
          // this.$http.post('/oauth/token', {
          //   username: this.loginForm.username,
          //   password: this.loginForm.password
          // }, {
          //   headers: {
          //     Authorization: 'Basic enV1bDp6dXVs'
          //   },
          //   emulateJSON: true,
          //   emulateHTTP: true
          // }).then(function(response) {
          //   if (response.status === 200) {
          //     this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
          //       this.loading = false;
          //       this.$router.push({
          //         path: '/'
          //       });
          //       // this.showDialog = true;
          //     }).catch(() => {
          //       this.loading = false;
          //     });
          //   } else {
          //     this.loading = false;
          //     return false;
          //   }
          // }, function(error) {
          //   console.log('server error!!');
          //   this.loading = false;
          //   return false;
          // });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1);
      // const hashObj = getQueryObject(hash);
      // const originUrl = window.location.origin;
      // history.replaceState({}, '', originUrl);
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // };
      // const codeName = hashObj[codeMap[this.auth_type]];
      // if (!codeName) {
      //   alert('第三方登录失败');
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' });
      //   });
      // }
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan);
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan);
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
.tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 5px;
}

.login-container {
    display: flex;
    justify-content: center;
    padding-top: 280px;
    height: 100vh;
    color: rgb(74, 74, 74);
    background-image: url('/static/image/login.jpg');
    background-size: 100%;
    background-repeat: no-repeat;
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
        -webkit-text-fill-color: #fff !important;
    }
    input {
        background: #fff;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        height: 47px;
    }
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
    }
    .svg-container {
        padding: 6px 5px 6px 15px;
        font-size: 20px;
        color: rgb(74, 74, 74);
    }
    .title {
        font-size: 26px;
        font-weight: 400;
        margin: 0 auto 40px;
        text-align: center;
        font-weight: bold;
    }
    .login-box {
        height: 450px;
        width: 950px;
        padding: 75px 100px;
        background-color: white;
        box-shadow:0px 3px 30px #333333;
    }

    .logo-img {
      width: 300px;
      height: 300px;
    }
    .login-form {
      border-left: 1px rgba(74, 74, 74, 0.3) solid;
      margin-left: 50px;
      padding-left: 50px;
      height: 300px;
      width: 450px;
    }
    .el-form-item {
        border: 1px solid rgba(74, 74, 74, 0.3);
        background: #fff;
        border-radius: 5px;
        color: #454545;
    }
    .forget-pwd {
        color: #fff;
    }
}
</style>
