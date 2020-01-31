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

export const setFavourite = (scoreId, favourite) => ({
  mutation: gql`mutation ($scoreId: Int! $favourite: Boolean!) {
    setFavourite(scoreId: $scoreId, favourite: $favourite) {
      id
      title
      favourite
    }
  }`,
  variables: { scoreId, favourite },
});
