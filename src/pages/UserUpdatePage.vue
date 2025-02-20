<template>
    <div v-if="user">
        <van-cell title="昵称" is-link to='/user/edit' :value="user.username"
            @click="toEdit('username', '昵称', user.username)" />
        <van-cell title="账号" :value="user.userAccount" />
        <van-cell title="头像" is-link to='/user/edit'>
            <img style="height: 48px" :src="user.avatarUrl" />
        </van-cell>
        <van-cell title="性别" is-link to='/user/edit' :value="user.gender"
            @click="toEdit('gender', '性别', user.gender)" />
        <van-cell title="电话" is-link to='/user/edit' :value="user.phone" @click="toEdit('phone', '电话', user.phone)" />
        <van-cell title="邮箱" is-link to='/user/edit' :value="user.email" @click="toEdit('email', '邮箱', user.email)" />
        <van-cell title="星球编号" :value="user.planetCode" />
        <van-cell title="注册时间" :value="user.createTime" />
    </div>
    <div v-else>
        加载中...
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getCurrentUser } from '../services/user';


const user = ref();
const router = useRouter();

onMounted(async () => {
    //获取用户信息
    const res = await getCurrentUser();
    if (res) {
        user.value = res;
    } else {
    }
})

const toEdit = (editKey: string, editName: string, currentValue: string) => {
    router.push({
        path: '/user/edit',
        query: {
            editKey,
            editName,
            currentValue,
        }
    })
}

</script>
<style scoped></style>