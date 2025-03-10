<template>
  <div id="teamAddPage">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="addTeamData.name" name="name" label="队伍名" placeholder="请输入队伍名"
          :rules="[{ required: true, message: '请输入队伍名' }]" />
        <van-field v-model="addTeamData.description" rows="4" autosize label="队伍描述" type="textarea"
          placeholder="请输入队伍描述" />
        <van-field is-link readonly name="datePicker" label="过期时间" :placeholder="formattedExpireTime || '点击选择过期时间'"
          @click="showPicker = true" />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-picker-group title="请选择过期时间" :tabs="['选择日期', '选择时间']" next-step-text="下一步" @confirm="onConfirm"
            @cancel="onCancel">
            <van-date-picker v-model="currentDate" :min-date="minDate" />
            <van-time-picker v-model="currentTime" />
          </van-picker-group>
        </van-popup>
        <van-field name="radio" label="队伍状态">
          <template #input>
            <van-radio-group v-model="addTeamData.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-if="Number(addTeamData.status) === 2" v-model="addTeamData.password" type="password"
          name="password" label="密码" placeholder="请输入队伍密码" :rules="[{ required: true, message: '请填写密码' }]" />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import myAxios from "../plugins/myAxios";
import { showFailToast, showSuccessToast } from "vant";

const router = useRouter();
const route = useRoute();

const showPicker = ref(false);
const currentDate = ref([new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]);
const currentTime = ref([new Date().getHours(), new Date().getMinutes()]);
const minDate = new Date();
const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5));

const id = route.query.id;

const addTeamData = ref({
  name: "",
  description: "",
  expireTime: null as string | null,
  password: "",
  status: 0,
});

const formattedExpireTime = computed(() => {
  if (addTeamData.value.expireTime) {
    const date = new Date(addTeamData.value.expireTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
  return '';
});

onMounted(async () => {
  if (id <= 0) {
    showFailToast('加载队伍失败');
    return;
  }
  const res = await myAxios.get("/team/get", {
    params: {
      id,
    }
  });
  if (res?.code === 0) {
    addTeamData.value = res.data;
    if (addTeamData.value.expireTime) {
      const date = new Date(addTeamData.value.expireTime);
      currentDate.value = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
      currentTime.value = [date.getHours(), date.getMinutes()];
    }
  } else {
    showFailToast('加载队伍失败，请刷新重试');
  }
});

const onConfirm = () => {
  const year = currentDate.value[0];
  const month = String(currentDate.value[1]).padStart(2, '0');
  const day = String(currentDate.value[2]).padStart(2, '0');
  const hour = String(currentTime.value[0]).padStart(2, '0');
  const minute = String(currentTime.value[1]).padStart(2, '0');
  addTeamData.value.expireTime = `${year}-${month}-${day} ${hour}:${minute}`;
  showPicker.value = false;
};

const onCancel = () => {
  showPicker.value = false;
};

const onSubmit = async () => {
  const postData = {
    ...addTeamData.value,
    status: Number(addTeamData.value.status),
    expireTime: addTeamData.value.expireTime ? new Date(addTeamData.value.expireTime).toISOString() : null,
  };
  const res = await myAxios.post("/team/update", postData);
  if (res?.code === 0 && res.data) {
    showSuccessToast('更新成功');
    router.push({
      path: '/team',
      replace: true,
    });
  } else {
    showFailToast('更新失败');
  }
};
</script>

<style scoped></style>