import * as R from 'ramda';
// eslint-disable-next-line import/prefer-default-export
export const getScoreDetailsFromOsmd = (osmd) => {
  const { sheet } = osmd;
  const details = {
    composer: sheet.ComposerString,
    lyricist: sheet.LyricistString,
    title: sheet.TitleString,
    subtitle: sheet.SubtitleString,
  };

  return R.pipe(
    R.toPairs,
    R.filter(([, val]) => !R.isEmpty(val)),
    R.fromPairs,
  )(details);
};
