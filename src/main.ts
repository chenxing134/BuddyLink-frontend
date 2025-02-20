import { createApp } from 'vue'
import 'vant/lib/index.css';
import '../global.css'
import App from './App.vue'
import * as VueRouter from 'vue-router';
import routes from './config/route';
import Vant from 'vant';

const app = createApp(App);
app.use(Vant);



const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

app.use(router);
app.mount('#app');


