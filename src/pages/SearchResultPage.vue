<template>
    <div v-if="loading" class="loading-container">
        <van-loading size="24px" /> 正在为您搜索...
    </div>
    <user-card-list :user-list="userList" :loading="loading" />
</template>
<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import UserCardList from "../components/UserCardList.vue";

import myAxios from '../plugins/myAxios';
import qs from 'qs';


const route = useRoute();
const { tags } = route.query;

const userList = ref([]);
const loading = ref(true); // 控制加载状态

onMounted(async () => {
    loading.value = true; // 开始加载

    try {
        // 发起搜索请求，根据标签搜索用户
        const userListData = await myAxios.get('/user/search/tags', {
            params: {
                tagNameList: tags, // 传入标签列表
            },
            paramsSerializer: params => {
                // 使用qs.stringify确保参数正确格式化
                return qs.stringify(params, { indices: false });
            }
        });

        console.log('/user/search/tags succeed', userListData);

        if (userListData?.data) {
            // 如果返回的数据存在，处理标签数据
            userListData.data.forEach(user => {
                if (user.tags) {
                    user.tags = JSON.parse(user.tags); // 解析标签字符串
                }
            });

            // 更新用户列表
            userList.value = userListData.data;
        }
    } catch (error) {
        // 处理请求失败
        console.error('/user/search/tags error', error);
    } finally {
        loading.value = false; // 请求结束，关闭加载动画
    }
});
</script>

<style scoped>
.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #666;
    margin-top: 20px;
}

.loading-container van-loading {
    margin-right: 8px;
}
</style>