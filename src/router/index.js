import Vue from 'vue';
import VueRouter from 'vue-router';
import MxmlPlayer from '../views/MusicXmlPlayer.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: MxmlPlayer, // TODO: lazy-load player screen
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
