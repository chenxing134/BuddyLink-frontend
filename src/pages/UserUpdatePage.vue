<template>
    <div v-if="user">
        <van-cell title="昵称" is-link to='/user/edit' :value="user.username"
            @click="toEdit('username', '昵称', user.username)" />
        <van-cell title="账号" :value="user.userAccount" />
        <van-cell title="头像" is-link to='/user/edit'>
            <img style="height: 48px" :src="user.avatarUrl" />
        </van-cell>
        <van-cell title="性别" is-link to="/user/edit" :value="user.gender !== undefined && user.gender !== null ?
            (user.gender === 1 ? '男' : '女') : '未填写'" @click="toEdit('gender', '性别（0 女 1 男）', user.gender)" />
        <van-cell title="电话" is-link to="/user/edit" :value="user.phone ? user.phone : '未填写'"
            @click="toEdit('phone', '电话', user.phone)" />
        <van-cell title="邮箱" is-link to="/user/edit" :value="user?.email ? user.email : '未填写'"
            @click="toEdit('email', '邮箱', user.email)" />
        <van-cell title="标签" is-link to="/user/edit" :value="user?.tags ? '' : '未填写'"
            @click="toEditTags('tags', '标签', user.tags)">
            <template #right-icon v-if="user.tags && user.tags.length > 0">
                <van-tag plain color="#ffe1e1" text-color="#ad0000" style="margin: 5px;"
                    v-for="tag in JSON.parse(user.tags)">
                    {{ tag }}
                </van-tag>
            </template>
        </van-cell>
        <van-cell title="个人介绍" is-link to="/user/edit" :value="user?.profile ? user.profile : '未填写'"
            @click="toEdit('profile', '个人介绍', user.profile)" />
        <van-cell title="经度" is-link to="/user/edit" :value="user?.longitude ? user.longitude : '未填写'"
            @click="toEdit('longitude', '经度', user.longitude)" />
        <van-cell title="纬度" is-link to="/user/edit" :value="user?.dimension ? user.dimension : '未填写'"
            @click="toEdit('dimension', '纬度', user.dimension)" />
        <van-cell title="注册时间" :value="formatDateTime(user.createTime)" />
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
    }
});

const toEdit = (editKey: string, editName: string, currentValue: string) => {
    router.push({
        path: '/user/edit',
        query: {
            editKey,
            editName,
            currentValue,
        }
    })
};

const toEditTags = (editKey: string, editName: string, currentValue: string) => {
    router.push({
        path: '/user/registerTags',
        query: {
            type: 1,
            userId: user.value.id,
        }
    })
};

const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
</script>

<style scoped></style>