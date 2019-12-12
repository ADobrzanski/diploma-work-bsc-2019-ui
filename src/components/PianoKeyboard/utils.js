import * as R from 'ramda';

export const KEY_WHITE = 'white-keyboard-key';
export const KEY_BLACK = 'black-keyboard-key';

export const keyboardMap = [
  { key: 'C', type: KEY_WHITE, midiOffset: 12 },
  { key: 'C#', type: KEY_BLACK, midiOffset: 13 },
  { key: 'D', type: KEY_WHITE, midiOffset: 14 },
  { key: 'D#', type: KEY_BLACK, midiOffset: 15 },
  { key: 'E', type: KEY_WHITE, midiOffset: 16 },
  { key: 'F', type: KEY_WHITE, midiOffset: 17 },
  { key: 'F#', type: KEY_BLACK, midiOffset: 18 },
  { key: 'G', type: KEY_WHITE, midiOffset: 19 },
  { key: 'G#', type: KEY_BLACK, midiOffset: 20 },
  { key: 'A', type: KEY_WHITE, midiOffset: 21 },
  { key: 'A#', type: KEY_BLACK, midiOffset: 22 },
  { key: 'B', type: KEY_WHITE, midiOffset: 23 },
];

export const getMidiOffsetByKeyName = keyName => R.pipe(
  R.find(R.propEq('key', keyName)),
  R.prop('midiOffset'),
)(keyboardMap);

export const getMidiCodeFromKey = (key) => {
  // eslint-disable-next-line
  let [keyName, octave] = R.splitAt(-1, key);
  octave = parseInt(octave, 10);
  const midiOffset = getMidiOffsetByKeyName(keyName);

  return midiOffset + 12 * octave;
};

export const getKeyTypeFromMidiCode = (code) => {
  const keyNumInOctave = code % 12;
  return keyboardMap[keyNumInOctave].type;
};
