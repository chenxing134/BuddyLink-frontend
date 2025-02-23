<template>
  <form action="/public">
    <van-search v-model="searchText" show-action placeholder="请输入要搜索的标签" @search="onSearch" @cancel="onCancel" />
  </form>
  <van-divider content-position="left">已选标签</van-divider>
  <div v-if="activeIds.length === 0">请选择您的标签</div>
  <van-row gutter="16" style="padding: 0 16px">
    <van-col>
      <van-tag v-for="tag in activeIds" closeable size="medium" type="primary" @close="doClose(tag)">
        {{ tag }}
      </van-tag>
    </van-col>
  </van-row>
  <van-divider content-position="left">选择标签</van-divider>
  <van-tree-select v-model:active-id="activeIds" v-model:main-active-index="activeIndex" :items="tagList" />
  <div style="display: flex; align-items: center">
    <van-button block type="primary" style="margin: 12px" @click="doSearchResult" v-if="!isShow">注册</van-button>
    <van-button block type="primary" style="margin: 12px" @click="editUserTags" v-if="isShow">修改</van-button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import myAxios from "../plugins/myAxios.ts";
import { showFailToast, showSuccessToast } from 'vant';

const router = useRouter();
const route = useRoute();

const { type } = route.query;
const { userId } = route.query;

const isShow = ref(false);

onMounted(() => {
  console.log(type);
  if (parseInt(type) === 1) {
    isShow.value = true;
  } else {
    isShow.value = false;
  }
});

const searchText = ref('');
let originTagList = [
  {
    text: '性别',
    children: [
      { text: '男', id: '男' },
      { text: '女', id: '女' },
    ],
  },
  {
    text: '年级',
    children: [
      { text: '大一', id: '大一' },
      { text: '大二', id: '大二' },
      { text: '大三', id: '大三' },
      { text: '大四', id: '大四' },
      { text: '研一', id: '研一' },
      { text: '研二', id: '研二' },
      { text: '研三', id: '研三' },
    ]
  },
  {
    text: '方向',
    children: [
      { text: 'Java', id: 'java' },
      { text: 'C++', id: 'c++' },
      { text: 'Go', id: 'go' },
      { text: '嵌入式', id: '嵌入式' },
      { text: 'Python', id: 'python' },
    ],
  },
  {
    text: '状态',
    children: [
      { text: '单身', id: '单身' },
      { text: '有对象', id: '有对象' },
      { text: '已婚', id: '已婚' },
      { text: 'emo', id: 'emo' },
      { text: '内卷', id: '内卷' },
    ],
  },
  {
    text: '爱好',
    children: [
      { text: '编程', id: '编程' },
      { text: '电影', id: '电影' },
      { text: '音乐', id: '音乐' },
      { text: '绘画', id: '绘画' },
      { text: '足球', id: '足球' },
      { text: '篮球', id: '篮球' },
      { text: '乒乓球', id: '乒乓球' },
    ],
  },
];
let tagList = ref(originTagList);
const onSearch = () => {
  tagList.value = originTagList.map(parentTag => {
    if (Array.isArray(parentTag.children) && parentTag.children.length > 0) {
      const tempChildren = parentTag.children.filter(item => item.text.includes(searchText.value));
      const tempParentTag = { ...parentTag };
      tempParentTag.children = tempChildren;
      return tempParentTag;
    }
    return parentTag;
  });
};

const onCancel = () => {
  searchText.value = '';
  tagList.value = originTagList;
}

// 已选中的标签
const activeIds = ref([]);
const activeIndex = ref(0);

// 移除标签
function doClose(tag) {
  activeIds.value = activeIds.value.filter(item => {
    return item !== tag
  });
}

const { registerUser } = route.query;

const doSearchResult = async () => {
  if (activeIds.value.length > 0) {
    const registerUserParam = JSON.parse(registerUser);
    const res = await myAxios.post('/user/register', {
      userAccount: registerUserParam.userAccount,
      userPassword: registerUserParam.userPassword,
      checkPassword: registerUserParam.checkPassword,
      /*
          gender: registerUserParam.gender,
          avatarUrl: registerUserParam.avatarUrl,*/
      username: registerUserParam.username,
      /*    phone: registerUserParam.phone,*/
      tagNameList: activeIds.value,
      longitude: registerUserParam.longitude,
      dimension: registerUserParam.dimension,
    });
    if (res?.code === 0) {
      showSuccessToast('注册成功');
      router.push({
        path: '/user/login'
      })
    } else {
      showFailToast('注册失败');
    }
  } else {
    showFailToast('请至少选择一个标签');
  }
};

const editUserTags = async () => {
  if (activeIds.value.length > 0) {
    const res = await myAxios.post('/user/update', {
      tags: activeIds.value,
      id: parseInt(userId),
    });
    if (res?.code === 0) {
      showSuccessToast('修改成功');
      router.back();
    } else {
      showFailToast('修改失败');
    }
  } else {
    showFailToast('请至少选择一个标签');
  }

};

const onClickLeft = () => {
  router.back();
}
</script>

<style scoped></style>