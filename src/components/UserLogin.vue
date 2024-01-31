<script setup lang="ts">
  import { message } from 'ant-design-vue';
  import { reactive, ref, computed, getCurrentInstance } from 'vue';

  const instance = getCurrentInstance();
  const http = instance?.appContext.config.globalProperties.$http;

  const props = defineProps<{
    open: boolean;
    changeopen: (val: boolean) => void;
  }>();

  interface FormState {
    username: string;
    password: string;
  };

  const loginType = ref('login');

  const curLoginTypeTip = computed(() => {
    return loginType.value === 'login' ? '注册账户' : '登录账户';
  });

  const changeLoginType = () => {
    if (loginType.value === 'login') {
      loginType.value = 'register';
    } else {
      loginType.value = 'login';
    }
  };

  const formState = reactive<FormState>({
    username: '',
    password: '',
  });

  const onFinish = async (values: any) => {
    if (loginType.value === 'login') {
      const res = await http({
        url: '登录',
        method: 'POST',
        body: values
      });

      if (res.code === 200 && res.data && res.data.token) {
        localStorage.setItem('beauty_token', res.data.token);

        props.changeopen(false);

        message.success('登录成功');
      };
    } else {
      const res = await http({
        url: '注册账户',
        method: 'POST',
        body: values,
      });

      if (res.code === 200 && res.data && res.data.token) {
        localStorage.setItem('beauty_token', res.data.token);

        props.changeopen(false);

        message.success('登录成功');
      };
    }
  };
</script>

<template>
  <a-modal
    :open="open"
    title="账户登录"
    :footer="null"
    :closable="false"
    wrapClassName="loginModal"
  >
    <a-form
      :model="formState"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 21 }"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-form-item
        label="账户"
        name="username"
        :rules="[{ required: true, message: '账户不能为空' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '密码不能为空' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item v-if="loginType === 'login'">
        <a-button type="primary" html-type="submit">登录</a-button>
      </a-form-item>

      <a-form-item v-if="loginType === 'register'">
        <a-button type="primary" html-type="submit">注册</a-button>
      </a-form-item>
    </a-form>

    <div class="registerWrap">
      <a-button type="link" @click="changeLoginType">{{ curLoginTypeTip }}</a-button>
    </div>
  </a-modal>
</template>

<style scope>
  .registerWrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
<style>
  .loginModal {
    .ant-modal-header {
      margin-bottom: 24px;
    };

    .ant-modal-body {
      .ant-form {
        .ant-form-item {
          &:last-child {
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .ant-form-item-label {
          text-align: left!important;
        }
      }
    }
  }
</style>
