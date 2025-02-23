import { createApp } from 'vue'
import 'vant/lib/index.css';
import 'vant/es/toast/style';
import App from './App.vue'
import * as VueRouter from 'vue-router';
import routes from './config/route';
import { Button, Cell, CellGroup, Col, DatePicker, Dialog, Divider, Field, Form, Icon, NavBar, NoticeBar, PickerGroup, Row, Search, Stepper, Sticky, Tabbar, TabbarItem, Tag, TreeSelect } from 'vant';

const app = createApp(App);
app.use(Button);
app.use(NavBar);
app.use(Icon);
app.use(Tabbar);
app.use(TabbarItem);
app.use(Tag);
app.use(Divider);
app.use(TreeSelect);
app.use(Row);
app.use(Col);
app.use(Cell);
app.use(CellGroup);
app.use(Form);
app.use(Field);
app.use(Stepper);
app.use(DatePicker);
app.use(Search);
app.use(PickerGroup);
app.use(Dialog);
app.use(Sticky);
app.use(NoticeBar);



const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

app.use(router);
app.mount('#app');


