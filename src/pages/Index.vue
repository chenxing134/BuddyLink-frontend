<template>
    <van-notice-bar left-icon="volume-o" background="#ECF9FF" color="#1989FA"
        text="富强 民主 文明 和谐 自由 平等 公正 法制 爱国 敬业 诚信 友善" />
    <van-search v-model="searchText" placeholder="搜索附近用户(输入0-10000内整数)" @search="onSearch(searchText)"
        @clear="handleClear" />
    <van-cell center title="心动模式">
        <template #right-icon>
            <van-switch v-model="isMatchMode" size="24" @change="onMatchModeChange" />
        </template>
    </van-cell>
    <user-card-list :user-list="userList" :loading="loading" />
    <van-back-top right="15vw" bottom="10vh" />
    <div style="display: flex; justify-content: center;">
        <infinite-loading :identifier="infiniteId" @infinite="loadMore" v-if="!isMatchMode" />
    </div>
    <van-empty v-if="!userList || userList.length < 1" description="数据为空" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import myAxios from "../plugins/myAxios";
import UserCardList from "../components/UserCardList.vue";
import { UserType } from "../models/user";
import InfiniteLoading from "v3-infinite-loading";
import { showFailToast, showSuccessToast } from 'vant';

const route = useRoute();
const { tags } = route.query;
const searchText = ref('');
const isMatchMode = ref<boolean>(false);

const userList = ref<UserType[]>([]);
const loading = ref(true);
const infiniteId = 'infinite-loading-id';

let pageNum = 1;
let hasMoreData = ref(true);

onMounted(() => {
    loadData();
});

const loadData = async () => {
    let userListData;
    loading.value = true;

    if (isMatchMode.value) {
        const num = 10;
        try {
            const response = await myAxios.get('/user/match', { params: { num } });
            showSuccessToast('匹配成功');
            userListData = response.data;
        } catch (error) {
            console.error('/user/match error', error);
            showFailToast('匹配失败');
        }
    } else {
        try {
            const response = await myAxios.get('/user/recommend', { params: { pageSize: 8, pageNum } });
            userListData = response.data;
        } catch (error) {
            console.log('/user/recommend error', error);
        }
    }

    if (userListData) {
        userListData.forEach((user: UserType) => {
            if (user.tags) {
                user.tags = JSON.parse(user.tags);
            }
        });

        if (pageNum === 1) {
            userList.value = userListData;
        } else {
            userList.value = [...userList.value, ...userListData];
        }

        hasMoreData.value = userListData.length > 0;
    }

    loading.value = false;
};

const onMatchModeChange = () => {
    userList.value = [];
    pageNum = 1;
    hasMoreData.value = true;
    loadData();
};

const onSearch = async (searchText: string) => {
    let userListData;
    loading.value = true;

    try {
        const res = await myAxios.get('/user/searchNearby', { params: { radius: searchText } });
        if (res.code === 0) {
            userListData = res.data;
            if (userListData) {
                userListData.forEach((user: UserType) => {
                    if (user.tags) {
                        user.tags = JSON.parse(user.tags);
                    }
                });
                userList.value = userListData;
            }
        } else {
            showFailToast('搜索失败');
        }
    } catch (error) {
        console.error('/user/searchNearby error', error);
        showFailToast('搜索失败');
    }

    loading.value = false;
};

const loadMore = () => {
    if (hasMoreData.value) {
        pageNum++;
        loadData();
    }
};

const handleClear = () => {
    searchText.value = '';
    isMatchMode.value = false;
    pageNum = 1;
    hasMoreData.value = true;
    loadData();
};
</script>

<style scoped></style>