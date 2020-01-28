/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const currentUser = (() => ({
  query: gql`query {
    me { id name email }
  }`,
  update: data => data.me,
}))();

export const publicScores = (destination = 'publicScores') => ({
  query: gql`query {
    publicScores { id title subtitle composer lyricist link favourite }
  }`,
  update: data => data[destination],
});

export const searchScores = phrase => ({
  query: gql`query ($phrase: String!){
    searchScores(phrase: $phrase) { id title subtitle composer lyricist link favourite }
  }`,
  variables: {
    phrase,
  },
});
