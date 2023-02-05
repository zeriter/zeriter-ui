<template>
  <el-form
    class="login-form"
    status-icon
    :rules="loginRules"
    ref="loginForm"
    :model="loginForm"
    label-width="0"
  >
    <el-form-item prop="username">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        v-model="loginForm.username"
        auto-complete="off"
        :placeholder="$t('login.username')"
      >
        <i slot="prefix" class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        :type="passwordType"
        v-model="loginForm.password"
        auto-complete="off"
        :placeholder="$t('login.password')"
      >
        <i
          class="el-icon-view el-input__icon"
          slot="suffix"
          @click="showPassword"
        ></i>
        <i slot="prefix" class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item v-if="loginForm.showCode" prop="code">
      <el-row :span="24">
        <el-col :span="16">
          <el-input
            size="small"
            @keyup.enter.native="handleLogin"
            v-model="loginForm.code"
            auto-complete="off"
            :placeholder="$t('login.code')"
          >
            <i slot="prefix" class="icon-yanzhengma" />
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img
              class="login-code-img"
              :src="loginForm.image"
              @click="refreshCode"
            />
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        @click.native.prevent="handleLogin"
        class="login-submit"
        >{{ $t("login.submit") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import website from "@/config/website";
import { loginByUsername, getCaptcha } from "@/api/user";
// import { getTopUrl } from "@/util/util";
// import { info } from "@/api/system/tenant";
import Cookies from "js-cookie";
import { decrypt } from "@/util/jsencrypt";

export default {
  name: "userlogin",
  data() {
    return {
      tenantMode: website.tenantMode,
      captchaMode: website.captchaMode,
      loginForm: {
        //是否显示验证码
        showCode: false,
        //流水ID
        uuid: "000000",
        //用户名
        username: "admin",
        //密码
        password: "admin123",
        //账户类型
        type: "account",
        //验证码的值
        code: "",
        //验证码的索引
        key: "",
        //预加载白色背景
        image:
          "data:image/jpg;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 1, message: "密码长度最少为6位", trigger: "blur" },
        ],
      },
      passwordType: "password",
    };
  },
  created() {
    this.refreshCode();
    this.getCookie();
  },
  mounted() {},
  computed: {
    ...mapGetters(["tagWel"]),
  },
  props: [],
  methods: {
    refreshCode() {
      getCaptcha().then((res) => {
        const data = res.data;
        this.loginForm.showCode = data.captchaEnabled;
        this.loginForm.key = data.key;
        this.loginForm.image = data.img;
        this.loginForm.uuid = data.uuid;
      });
    },
    showPassword() {
      this.passwordType === ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "登录中,请稍后。。。",
            spinner: "el-icon-loading",
          });
          //this.loginForm
          var datas = {
            uuid: this.loginForm.uuid,
            username: this.loginForm.username,
            password: this.loginForm.password,
            type: this.loginForm.type,
            key: this.loginForm.key,
            code: this.loginForm.code,
          };
          loginByUsername(datas)
            .then(() => {
              this.$router.push({ path: this.tagWel.value });
              loading.close();
            })
            .catch(() => {
              loading.close();
              if (this.loginForm.showCode) {
                this.refreshCode();
              }
            });
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      this.loginForm.username =
        username === undefined ? this.loginForm.username : username;
      this.loginForm.password =
        password === undefined ? this.loginForm.password : decrypt(password);
    },
  },
};
</script>

<style>
</style>
