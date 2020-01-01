import gql from 'graphql-tag';

export default $store => ({
  me: {
    query: gql`query {
      me { id name email }
    }`,
    error(e) {
      const message = JSON.stringify(e.message);
      $store.commit('SET_APPLICATION_ERRORS', [message]);
    },
  },
});
