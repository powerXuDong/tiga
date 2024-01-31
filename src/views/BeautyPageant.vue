<script setup lang="ts">
  import { message } from 'ant-design-vue';
  import { getCurrentInstance, ref, watch } from 'vue'

  import UserLogin from '@/components/UserLogin.vue';

  import bgImg from '@/assets/images/bg.png';
  import myVote from '@/assets/images/myvote.png';
  import rule from '@/assets/images/rule.png';
  import champion from '@/assets/images/champion.png';

  interface ContestantInfo {
    age: number;
    name: string;
    biography: string;
    contestant_id: number;
    created_at: string;
    photo_url: string;
    total_votes: number;
  };

  interface UserInfo {
    created_at: string;
    name: string;
    password: string;
    voter_id: number;
  };

  const instance = getCurrentInstance();
  const http = instance?.appContext.config.globalProperties.$http;

  const loginOpen = ref(false);

  const userInfo = ref<UserInfo>();
  const contestantList = ref<ContestantInfo[]>([]);

  // 获取投票人信息
  const getUserInfo = async () => {
    const res = await http({
      url: '账户信息',
      method: 'GET',
    });

    if (res.code && res.code === 401) {
      changeOpen(true);
    };

    if (res.success && res.data) {
      userInfo.value = res.data;
    };
  };

  getUserInfo();

  // 获取选美列表
  const getContestantList = async () => {
    const res = await http({
      url: '选美列表',
      method: 'GET',
    });

    if (res.success && res.data) {
      contestantList.value = res.data;
    };
  };

  // 监听登录弹窗
  watch(loginOpen, (newValue, oldValue) => {
    // 这样的状态就说明刚登录成功
    if (!newValue && oldValue) {
      getUserInfo();
    };
  });

  // 监听账户信息
  watch(userInfo, (value) => {
    if (value && value.name) {
      getContestantList();
    };
  });

  const handleVoter = async (obj: ContestantInfo) => {
    const res = await http({
      url: '投票',
      method: 'GET',
      pathParams: {
        contestant_id: obj.contestant_id
      }
    });

    if (res.success && res.data) {
      message.destroy();
      message.success('投票成功');

      getContestantList();
    }
  };

  // 切换登录弹窗状态
  const changeOpen = (status: boolean) => {
    loginOpen.value = status;
  };
</script>

<template>
  <header>
    <img :src="bgImg" alt="">
    <div class="userInfo" v-if="userInfo">{{  userInfo.name  }}</div>
  </header>

  <nav>
    <div>
      <img :src="myVote" alt="">
      <span>我的投票</span>
    </div>
    <div>
      <img :src="rule" alt="">
      <span>活动规则</span>
    </div>
    <div>
      <img :src="champion" alt="">
      <span>最美女神</span>
    </div>
  </nav>
  
  <article>
    <div v-for="item in contestantList" :key="item.contestant_id">
      <img :src="item.photo_url" alt="">
      <span class="totalVote">{{ item.total_votes }}</span>
      <span class="voteButton" @click="handleVoter(item)">投票</span>
    </div>
  </article>

  <UserLogin :open="loginOpen" :changeopen="changeOpen" />
</template>

<style scope>
  header {
    display: flex;
    
    img {
      width: 100%;
    }

    .userInfo {
      position: fixed;
      top: 10px;
      right: 10px;
      color: #ffffff;
    }
  }

  nav {
    padding: 0 10%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(to bottom, #14223d, #ffffff);

    div {
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 100px;
      }

      span {
        color: #000000;
      }
    }
  }

  article {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    div {
      position: relative;
      width: 25%;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 100%;
      }

      .totalVote {
        position: absolute;
        top: 10px;
        left: 20px;
        color: #000000;
      }

      .voteButton {
        width: 100%;
        display: flex;
        justify-content: center;
        text-align: center;
        color: #ffffff;
        line-height: 30px;
        background: red;
        cursor: pointer;
        user-select: none;
      }
    }
  }
</style>
