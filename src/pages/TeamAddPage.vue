<template>
    <div id="teamAddPage">
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="addTeamData.name" name="name" label="队伍名" placeholder="请输入队伍名"
                    :rules="[{ required: true, message: '请输入队伍名' }]" />
                <van-field v-model="addTeamData.description" rows="4" autosize label="队伍描述" type="textarea"
                    placeholder="请输入队伍描述" />
                <van-field is-link readonly name="datePicker" label="过期时间"
                    :placeholder="formattedExpireTime || '点击选择过期时间'"
                    @click="showPicker = true" />
                <van-popup v-model:show="showPicker" position="bottom">
                    <van-picker-group title="请选择过期时间" :tabs="['选择日期', '选择时间']" next-step-text="下一步"
                        @confirm="onConfirm" @cancel="onCancel">
                        <van-date-picker v-model="currentDate" :min-date="minDate" />
                        <van-time-picker v-model="currentTime" />
                    </van-picker-group>
                </van-popup>
                <van-field name="stepper" label="最大人数">
                    <template #input>
                        <van-stepper v-model="addTeamData.maxNum" max="10" min="3" />
                    </template>
                </van-field>
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
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import myAxios from "../plugins/myAxios";
import { showFailToast, showSuccessToast } from "vant";

const router = useRouter();

const showPicker = ref(false);
const currentDate = ref([new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]);
const currentTime = ref([new Date().getHours(), new Date().getMinutes()]);
const minDate = new Date();
const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5));

const addTeamData = ref({
    name: "",
    description: "",
    expireTime: null as string | null,
    maxNum: 3,
    password: "",
    status: 0,
});

const formattedExpireTime = computed(() => {
    if (addTeamData.value.expireTime) {
        return addTeamData.value.expireTime;
    }
    return '';
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
    const res = await myAxios.post("/team/add", postData);
    if (res?.code === 0 && res.data) {
        showSuccessToast('添加成功');
        router.push({
            path: '/team',
            replace: true,
        });
    } else {
        showFailToast('添加失败');
    }
}
</script>

<style scoped></style>