<template>
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
import { ref, watchEffect } from 'vue';
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

const userList = ref([]);
const loading = ref(true);
const infiniteId = 'infinite-loading-id';

let pageNum = 1;
let hasMoreData = ref(true);
const loadData = async () => {
    let userListData;
    loading.value = true;
    // 心动模式，根据标签匹配用户
    if (isMatchMode.value) {
        const num = 10;
        userListData = await myAxios.get('/user/match', {
            params: {
                num,
            },
        }).then(function (response) {
            showSuccessToast('请求成功');
            return response?.data;
        }).catch(function (error) {
            console.error('/user/match error', error);
            showFailToast('请求失败');
        });

        if (userListData) {
            userListData.forEach((user: UserType) => {
                if (user.tags) {
                    user.tags = JSON.parse(user.tags);
                }
            });
        }

        userList.value = userListData || [];
        loading.value = false;
        hasMoreData.value = false;
    } else {
        // 普通模式
        userListData = await myAxios.get('/user/recommend', {
            params: {
                pageSize: 8,
                pageNum,
            },
        }).then(response => {
            return response?.data;
        }).catch(error => {
            console.log('/user/recommend error', error);
        });

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
    }
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

    const res: any = await myAxios.get('/user/searchNearby', {
        params: { radius: searchText }
    });

    if (res?.code === 0) {
        userListData = res?.data;

        if (userListData) {
            userListData.forEach((user: UserType) => {
                if (user.tags) {
                    user.tags = JSON.parse(user.tags);
                }
            });

            userList.value = userListData;
        }

        loading.value = false;

    } else {
        showFailToast('搜索失败' + (res.description ? `，${res.description}` : ''));
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

watchEffect(() => {
    loadData();
});

</script>

<style scoped></style>
