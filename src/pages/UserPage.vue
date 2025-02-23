<template>
    <div v-if="user">
        <div v-if="user" class="user-top">
            <div class="user-profile-top">
                <van-image round width="5.5rem" height="5.5rem" :src="user.avatarUrl"
                    style="margin-top: 15px; margin-left: 15px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);" />
                <div class="user-profile">
                    <h3>{{ user.username }}</h3>
                    <van-space wrap v-for="tag in JSON.parse(user.tags)">
                        <van-tag color="#ffe1e1" text-color="#ad0000" style="margin-right: 4px">
                            {{ tag }}
                        </van-tag>
                    </van-space>
                </div>
            </div>
        </div>
        <van-cell title="修改信息" is-link to="/user/update" />
        <van-cell title="我创建的队伍" is-link to="/user/team/create" />
        <van-cell title="我加入的队伍" is-link to="/user/team/join" />
        <van-button class="logout-button-container" type="primary" @click="userLogout">退出登录</van-button>
    </div>
    <div v-else>
        加载中...
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import myAxios from "../plugins/myAxios";
import { getCurrentUser } from '../services/user';
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant';


const user = ref();
const router = useRouter();

onMounted(async () => {
    user.value = await getCurrentUser();
})

const userLogout = async () => {
    showConfirmDialog({
        title: '确认操作',
        message: '确定要退出登录吗？',
    }).then(async () => {
        const res: any = await myAxios.post('/user/logout');
        if (res?.code === 0) {
            showSuccessToast("退出成功");
            router.push({
                path: '/user/login'
            })
        } else {
            showFailToast("退出失败");
        }
    }).catch(() => {
    });
};
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
<style scoped>
.user-top {
    width: 90%;
    height: 180px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding-bottom: 20px;
}

.user-profile-top {
    display: flex;
}

.user-profile {
    margin-top: 10px;
    margin-left: 10px;
    background: white;
    width: 216px;
    height: 100px;
}

.logout-button-container {
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: 320px;
    height: 50px;
    text-align: center;
}
</style>