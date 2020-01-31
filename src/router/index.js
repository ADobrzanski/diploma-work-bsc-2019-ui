import Vue from 'vue';
import VueRouter from 'vue-router';
import MxmlPlayer from '../views/MusicXmlPlayer.vue';
import Welcome from '../views/Welcome.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: MxmlPlayer, // TODO: lazy-load player screen
  },
  {
    path: '/welcome',
    redirect: '/welcome/home',
  },
  {
    path: '/welcome/:option',
    props: true,
    component: Welcome,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
