<template>
  <div id="teamCardList">
    <van-card v-for="team in props.teamList" :thumb="teamIcon" :desc="team.description" :title="`${team.name}`">
      <template #tags>
        <van-tag plain type="danger" style="margin-right: 8px; margin-top: 8px">
          {{
            teamStatusEnum[team.status]
          }}
        </van-tag>
      </template>
      <template #bottom>
        <div>
          {{ `队伍人数: ${team.hasJoinNum}/${team.maxNum}` }}
        </div>
        <div v-if="team.expireTime">
          {{ '过期时间: ' + formatDateTime(team.expireTime) }}
        </div>
        <div>
          {{ '创建时间: ' + formatDateTime(team.createTime) }}
        </div>
      </template>
      <template #footer>
        <van-button size="small" type="primary" v-if="team.userId !== currentUser?.id && !team.hasJoin" plain
          @click="preJoinTeam(team)">加入队伍
        </van-button>
        <van-button v-if="team.userId === currentUser?.id" size="small" plain @click="doUpdateTeam(team.id)">更新队伍
        </van-button>
        <!-- 仅加入队伍可见 -->
        <van-button v-if="team.userId !== currentUser?.id && team.hasJoin" size="small" plain
          @click="doQuitTeam(team.id)">退出队伍
        </van-button>
        <van-button v-if="team.userId === currentUser?.id" size="small" type="danger" plain
          @click="doDeleteTeam(team.id)">解散队伍
        </van-button>
      </template>
    </van-card>
    <van-dialog v-model:show="showPasswordDialog" title="请输入密码" show-cancel-button @confirm="doJoinTeam"
      @cancel="doJoinCancel">
      <van-field v-model="password" placeholder="请输入密码" />
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { TeamType } from "../models/team";
import { teamStatusEnum } from "../constants/team";
import teamIcon from '../assets/TeamIcon.png';
import myAxios from "../plugins/myAxios";
import { onMounted, ref } from "vue";
import { getCurrentUser } from "../services/user";
import { useRouter } from "vue-router";
import { showConfirmDialog, showFailToast, showSuccessToast } from "vant";

interface TeamCardListProps {
  teamList: TeamType[];
}

const props = withDefaults(defineProps<TeamCardListProps>(), {
  // @ts-ignore
  teamList: [] as TeamType[],
});

const showPasswordDialog = ref(false);
const password = ref('');
const joinTeamId = ref(0);
const currentUser = ref();

const router = useRouter();

onMounted(async () => {
  currentUser.value = await getCurrentUser();
})

const preJoinTeam = (team: TeamType) => {
  joinTeamId.value = team.id;
  if (team.status === 0) {
    doJoinTeam()
  } else {
    showPasswordDialog.value = true;
  }
}

const doJoinCancel = () => {
  joinTeamId.value = 0;
  password.value = '';
}

const doJoinTeam = async () => {
  if (!joinTeamId.value) {
    return;
  }
  showConfirmDialog({
    title: '确认操作',
    message: '确定要加入此队伍吗？',
  }).then(async () => {
    const res = await myAxios.post('/team/join', {
      teamId: joinTeamId.value,
      password: password.value
    });
    if (res?.code === 0) {
      showSuccessToast('加入成功');
      doJoinCancel();
    } else {
      showFailToast('加入失败');
    }
  }).catch(() => {
  });
}

const doUpdateTeam = (id: number) => {
  router.push({
    path: '/team/update',
    query: {
      id,
    }
  })
}

const doQuitTeam = async (id: number) => {
  showConfirmDialog({
    title: '确认操作',
    message: '确定要退出此队伍吗？',
  }).then(async () => {
    const res = await myAxios.post('/team/quit', {
      teamId: id
    });
    if (res?.code === 0) {
      showSuccessToast('退出成功');
    } else {
      showFailToast('退出失败');
    }
  }).catch(() => {
  });
}

const doDeleteTeam = async (id: number) => {
  showConfirmDialog({
    title: '确认操作',
    message: '确定要解散此队伍吗？',
  }).then(async () => {
    const res = await myAxios.post('/team/delete', {
      id,
    });
    if (res?.code === 0) {
      showSuccessToast('解散成功');
    } else {
      showFailToast('解散失败');
    }
  }).catch(() => {
  });
}

const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

</script>

<style scoped>
#teamCardList :deep(.van-image__img) {
  height: 128px;
  object-fit: unset;
}
</style>