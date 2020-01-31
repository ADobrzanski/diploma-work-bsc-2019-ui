<script>
import * as R from 'ramda';
// import gql from 'graphql-tag';

import { publicScores, favouriteScores, searchScores } from '../../api/queries';
import { setFavourite } from '../../api/mutations';

export default {
  render() {
    return this.$scopedSlots.default({
      items: this.scores,
      toggleFavourite: this.toggleFavourite,
    });
  },
  data() { return { scores: [] }; },
  props: ['option', 'searchPhrase'],
  watch: {
    option: {
      handler() {
        this.fetch(this.searchPhrase)
          .then((data) => { this.scores = data; })
          .catch(err => console.error(err));
      },
      immediate: true,
    },
    searchPhrase() {
      const search = this.searchPhrase || '';
      this.fetch(search)
        .then((data) => { this.scores = data; })
        .catch(err => console.error(err));
    },
  },
  computed: {
    config() {
      return [
        {
          option: 'home',
          fetch: this.fetchAllScores,
          search: this.searchAllScores,
        },
        {
          option: 'favourite',
          fetch: this.fetchFavourites,
          search: this.fetchFavourites,
        },
      ];
    },
    fetch() {
      const { option, searchPhrase } = this;
      const config = this.config.find(item => item.option === option);

      return R.isEmpty(searchPhrase)
        ? config.fetch
        : config.search;
    },
  },
  methods: {
    fetchAllScores() {
      return this.$apollo.query(publicScores())
        .then(({ data }) => data.publicScores);
    },
    searchAllScores(phrase) {
      return this.$apollo.query(searchScores(phrase))
        .then(({ data }) => data.searchScores);
    },
    fetchFavourites(phrase) {
      return this.$apollo.query(favouriteScores(phrase))
        .then(({ data }) => data.me.favourites);
    },
    toggleFavourite(score) {
      this.$apollo
        .mutate(setFavourite(Number(score.id), !score.favourite))
        .then(() => {
          this.scores = [...R.reject(R.equals(score), this.scores)];

          if (this.option !== 'favourite') {
            const updatedScore = { ...score, favourite: !score.favourite };
            this.scores = [...this.scores, updatedScore];
          }
        }).catch(e => console.error(e));
    },
  },
};
</script>
