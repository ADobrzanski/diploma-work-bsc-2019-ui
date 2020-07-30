import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Welcome.vue';

Vue.use(VueRouter);

const Player = () => import('../views/MusicXmlPlayer.vue');

const routes = [
  {
    path: '/',
    redirect: '/home/all',
  },
  {
    name: 'home',
    path: '/home/:category',
    props: true,
    component: Home,
  },
  {
    name: 'song',
    path: '/song/:id',
    props: true,
    component: Player,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
