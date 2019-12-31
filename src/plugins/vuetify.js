import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const opts = {
  theme: {
    themes: {
      light: {
        primary: '#5CDB95',
        primaryLight: '8EE4AF',
        primaryDark: '379683',
        secondary: 'EDF5E1',
      },
    },
  },
};

export default new Vuetify(opts);
