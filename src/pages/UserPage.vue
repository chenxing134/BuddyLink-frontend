<template>
    <div v-if="user">
        <van-cell title="当前用户" :value="user?.username" />
        <van-cell title="修改信息" is-link to="/user/update" />
        <van-cell title="我创建的队伍" is-link to="/user/team/create" />
        <van-cell title="我加入的队伍" is-link to="/user/team/join" />
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
    user.value = await getCurrentUser();
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