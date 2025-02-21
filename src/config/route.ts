import Index from '@/pages/Index.vue';
import UserPage from '@/pages/UserPage.vue';
import UserLoginPage from '@/pages/UserLoginPage.vue';
import UserUpdatePage from '@/pages/UserUpdatePage.vue';
import UserEditPage from '@/pages/UserEditPage.vue';
import UserTeamJoinPage from '@/pages/UserTeamJoinPage.vue';
import UserTeamCreatePage from '@/pages/UserTeamCreatePage.vue';
import SearchPage from '@/pages/SearchPage.vue';
import SearchResultPage from '@/pages/SearchResultPage.vue';
import UserIntroPage from '@/pages/UserIntroPage.vue';
import TeamPage from '@/pages/TeamPage.vue';
import TeamAddPage from '@/pages/TeamAddPage.vue';
import TeamUpdatePage from '@/pages/TeamUpdatePage.vue';
import UserRegisterPage from '@/pages/UserRegisterPage.vue';
import RegisterTagsPage from '@/pages/RegisterTagsPage.vue';

const routes = [
    { path: '/', component: Index },
    { path: '/team', title: '找队伍', component: TeamPage },
    { path: '/team/add', title: '创建队伍', component: TeamAddPage },
    { path: '/team/update', title: '更新队伍', component: TeamUpdatePage },
    { path: '/user', title: '个人信息', component: UserPage },
    { path: '/user/update', title: '更新信息', component: UserUpdatePage },
    { path: '/search', title: '找伙伴', component: SearchPage },
    {path: '/user/intro/:id', title: '用户详情', component: UserIntroPage, meta: {layout: 'user-intro'}},
    { path: '/user/list', title: '用户列表', component: SearchResultPage },
    { path: '/user/edit', title: '编辑信息', component: UserEditPage },
    { path: '/user/login', title: '登录', component: UserLoginPage },
    {path: '/user/register', title: '注册', component: UserRegisterPage, meta: {layout: 'register'}},
    {path: '/user/registerTags', title: '选择标签', component: RegisterTagsPage, meta: {layout: 'register-tags'}},
    { path: '/user/team/join', title: '加入的队伍', component: UserTeamJoinPage },
    { path: '/user/team/create', title: '创建的队伍', component: UserTeamCreatePage },
]

export default routes;