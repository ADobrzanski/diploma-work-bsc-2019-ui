/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const uploadScore = (scoreDetails, file) => ({
  mutation: gql`mutation ($scoreDetails: ScoreInput! $file: Upload!) {
    uploadScore(score: $scoreDetails file: $file) {
      id
      title
      link
      owner {
        id
        name
      }
    }
  }`,
  variables: {
    scoreDetails,
    file,
  },
});
