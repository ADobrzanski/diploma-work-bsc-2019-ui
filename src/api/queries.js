/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const currentUser = (() => ({
  query: gql`query {
    me { id name email }
  }`,
  update: data => data.me,
}))();

export const publicScores = (() => ({
  query: gql`query {
    publicScores { id title subtitle composer lyricist link }
  }`,
  update: data => data.publicScores,
}))();
