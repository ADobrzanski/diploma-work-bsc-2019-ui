/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const currentUser = (() => ({
  query: gql`query {
    me { id name email }
  }`,
  update: data => data.me,
}))();

export const publicScores = () => ({
  query: gql`query {
    scores { id title subtitle composer lyricist link favourite }
  }`,
  update: data => data.scores,
  fetchPolicy: 'network-only',
});

export const searchScores = phrase => ({
  query: gql`query ($phrase: String!){
    scores (search: $phrase) { id title subtitle composer lyricist link favourite }
  }`,
  variables: {
    phrase,
  },
  fetchPolicy: 'network-only',
});

export const favouriteScores = searchPhrase => ({
  query: gql`query ($searchPhrase: String) {
    me { favourites(search: $searchPhrase) {
      id title subtitle composer lyricist link favourite
    } }
  }`,
  variables: { searchPhrase },
  update: data => data.me.favourites,
  fetchPolicy: 'no-cache',
});

export const personalScores = search => ({
  query: gql`query ($search: String) {
    me { uploads(search: $search) {
      id title subtitle composer lyricist link favourite
    } }
  }`,
  variables: { search },
  update: data => data.me.uploads,
  fetchPolicy: 'no-cache',
});

export const getLinkByScoreId = scoreId => ({
  query: gql`query ($scoreId: Int!) {
    score(scoreId: $scoreId) {
      id link
    } 
  }`,
  variables: { scoreId },
  update: data => data.score,
  fetchPolicy: 'no-cache',
});
