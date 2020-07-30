<script>
import * as R from 'ramda';
// import gql from 'graphql-tag';

import {
  publicScores,
  favouriteScores,
  searchScores,
  personalScores,
} from '../../api/queries';
import { setFavourite } from '../../api/mutations';

export default {
  render() {
    return this.$scopedSlots.default({
      items: this.scores,
      toggleFavourite: this.toggleFavourite,
    });
  },
  data() { return { scores: [] }; },
  props: ['category', 'searchPhrase'],
  watch: {
    category: {
      handler() {
        if (this.fetch) {
          const search = this.searchPhrase || '';
          this.fetch(search)
            .then((data) => { this.scores = data; })
            .catch((err) => {
              console.error(err);
              this.scores = [];
            });
        }
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
          category: 'all',
          fetch: this.fetchAllScores,
          search: this.searchAllScores,
        },
        {
          category: 'favourite',
          fetch: this.fetchFavourites,
          search: this.fetchFavourites,
        },
        {
          category: 'private',
          fetch: this.fetchPersonalScores,
          search: this.fetchPersonalScores,
        },
      ];
    },
    fetch() {
      const { config, category, searchPhrase } = this;
      const { fetch, search } = R.find(R.propEq('category', category))(config);

      return R.isEmpty(searchPhrase)
        ? fetch
        : search;
    },
  },
  methods: {
    fetchAllScores() {
      return this.$apollo.query(publicScores())
        .then(({ data }) => data.scores);
    },
    searchAllScores(phrase) {
      return this.$apollo.query(searchScores(phrase))
        .then(({ data }) => data.scores);
    },
    fetchFavourites(phrase) {
      return this.$apollo.query(favouriteScores(phrase))
        // eslint-disable-next-line arrow-body-style
        .then(({ data }) => {
          return data.me
            ? data.me.favourites
            : [];
        }).catch(console.err);
    },
    toggleFavourite(score) {
      this.$apollo
        .mutate(setFavourite(Number(score.id), !score.favourite))
        .then(() => {
          this.scores = [...R.reject(R.equals(score), this.scores)];

          if (this.category !== 'favourite') {
            const updatedScore = { ...score, favourite: !score.favourite };
            this.scores = [...this.scores, updatedScore];
          }
        }).catch(e => console.error(e));
    },
    fetchPersonalScores(phrase) {
      return this.$apollo.query(personalScores(phrase))
        // eslint-disable-next-line arrow-body-style
        .then(({ data }) => {
          return data.me
            ? data.me.uploads
            : [];
        }).catch(console.err);
    },
  },
};
</script>
