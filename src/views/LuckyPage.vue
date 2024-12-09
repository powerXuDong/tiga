<script setup lang="ts">
  import OSS from 'ali-oss';
  import { isOssCredentialsExpired } from '@/utils';
  import { getCurrentInstance, ref } from 'vue'

  interface OssSignInfo {
    AccessKeyId: string;
    AccessKeySecret: string;
    SecurityToken: string;
  };

  interface FormInfo {
    name: string;
    department: string;
    photoUrl: string;
  };

  const form = ref<FormInfo>({
    name: '',
    department: '',
    photoUrl: '',
  });

  const instance = getCurrentInstance();
  const http = instance?.appContext.config.globalProperties.$http;

  const ossSign = ref<OssSignInfo>();
  const file = ref<any>();
  const uploading = ref<boolean>();

  // 获取OSS签名
  const getOssSign = async () => {
    const res = await http({
      url: '获取OSS签名',
      method: 'GET',
    });

    if (res.success && res.data) {
      ossSign.value = res.data;
    };
  };

  getOssSign();

  const handleSubmit = async () => {
    if (!file.value) {
      alert('请上传照片');
      return;
    };

    if (isOssCredentialsExpired(ossSign.value)) {
      await getOssSign();
    };

    // 初始化 OSS 客户端
    const client = new OSS({
      bucket: 'chengxudong',
      region: 'oss-cn-hangzhou',
      accessKeyId: ossSign.value.AccessKeyId,
      accessKeySecret: ossSign.value.AccessKeySecret,
      stsToken: ossSign.value.SecurityToken,
    });

    const filename = `lucky/${Date.now()}-${file.value.name}`;
    
    try {
      uploading.value = true;

      // 上传文件到 OSS
      const result = await client.put(filename, file.value);
      const photoUrl = result.res.requestUrls[0];

      // 提交员工信息
      const employeeData = {
        ...form.value,
        photoUrl,
      };

      console.log('员工信息提交:', employeeData);
      alert('员工信息上传成功！');

      // 清空表单
      form.value.name = '';
      form.value.department = '';
      file.value = null;
      uploading.value = false;
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
      uploading.value = false;
    }
  }

  const handleFileChange = (event) => {
    const fileObj = event.target.files[0];
    if (fileObj) {
      file.value = fileObj;
    }
  }
</script>

<template>
  <div class="container">
    <h1>上传员工信息</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="photo">上传照片：</label>
        <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" required />
      </div>
      <div class="form-group">
        <label for="name">员工姓名：</label>
        <input type="text" v-model="form.name" placeholder="请输入姓名" required />
      </div>
      <div class="form-group">
        <label for="department">部门：</label>
        <select v-model="form.department" required>
          <option value="HR">HR</option>
          <option value="技术">技术</option>
          <option value="市场">市场</option>
        </select>
      </div>
      <button type="submit">提交</button>
      <div v-if="uploading" class="loading">上传中...</div>
    </form>
  </div>
</template>

<style scoped>
/* 页面全局样式 */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f1f5f8;
  margin: 0;
  padding: 0;
}

.container {
  width: 40%;
  margin: 50px auto;
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 30px;
}

/* 表单元素样式 */
.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
}

input, select {
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  color: #333;
  font-size: 16px;
  transition: border 0.3s ease;
}

input:focus, select:focus {
  border-color: #4CAF50;
  outline: none;
}

/* 上传按钮样式 */
button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}

button:active {
  background-color: #389e3c;
}

/* 文件上传按钮的额外样式 */
input[type="file"] {
  font-size: 16px;
  color: transparent;
  border: none;
  background-color: transparent;
}

input[type="file"] + label {
  display: inline-block;
  padding: 12px 20px;
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 8px;
  text-align: center;
  transition: background-color 0.3s ease;
}

input[type="file"]:hover + label {
  background-color: #45a049;
}

/* 自定义文件上传展示 */
input[type="file"]:focus + label {
  background-color: #389e3c;
}

.loading {
  text-align: center;
  color: #4CAF50;
  margin-top: 20px;
  font-size: 16px;
}
</style>
