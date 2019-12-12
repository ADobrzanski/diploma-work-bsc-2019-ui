/* eslint-disable no-underscore-dangle */
import * as R from 'ramda';
import {
  getKeyTypeFromMidiCode,
  KEY_WHITE,
} from '../PianoKeyboard/utils';

export const keyWidthByMidiCode = whiteKeyWidth => code => (
  getKeyTypeFromMidiCode(code) === KEY_WHITE
    ? whiteKeyWidth
    : whiteKeyWidth * 0.5
);

export const whiteKeyCount = keyCodes => R.pipe(
  R.map(getKeyTypeFromMidiCode),
  R.filter(R.equals(KEY_WHITE)),
)(keyCodes).length;

export const appendType = R.map(
  droplet => R.assoc('type', getKeyTypeFromMidiCode(droplet.code))(droplet),
);

export const appendWidth = whiteKeyWidth => R.map(
  droplet => R.assoc('width', keyWidthByMidiCode(whiteKeyWidth)(droplet.code))(droplet),
);

const mapIndexed = R.addIndex(R.map);
const sumWidthOfAllWhitesToIndex = idx => droplets => R.pipe(
  R.slice(0, idx),
  R.filter(({ code }) => getKeyTypeFromMidiCode(code) === KEY_WHITE),
  array => array.reduce(((acc, droplet) => acc + droplet.width), 0),
)(droplets);

export const appendOffset = mapIndexed(
  (droplet, idx, allDroplets) => R.assoc(
    'offset',
    R.ifElse(R.equals(0),
      R.always(0),
      () => (
        getKeyTypeFromMidiCode(droplet.code) === KEY_WHITE
          ? sumWidthOfAllWhitesToIndex(idx)(allDroplets)
          : sumWidthOfAllWhitesToIndex(idx)(allDroplets) - (droplet.width / 2)
      ))(idx),
  )(droplet),
);

export const zipAll = lists => (R.isEmpty(lists)
  ? []
  : R.map(
    R.pluck(R.__, lists),
    R.range(0, R.length(R.head(lists))),
  )
);
