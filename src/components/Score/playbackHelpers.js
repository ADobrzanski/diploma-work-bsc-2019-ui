import * as R from 'ramda';
// eslint-disable-next-line import/prefer-default-export
export const mapOsmdToVerticalEntries = (osmd) => {
  const { cursor } = osmd;
  const verticalEntries = [];

  while (!cursor.Iterator.EndReached) {
    const newEntry = {
      timestamp: cursor.Iterator.CurrentSourceTimestamp.realValue * 4,
      longestNote: Math.max(...cursor.NotesUnderCursor()
        .filter(note => !note.isRest())
        .map(({ Length }) => Length.realValue * 4)),
      timeToNext: -1,
      notes: cursor.NotesUnderCursor()
        .filter(note => !note.isRest())
        .map(note => ({
          note: note.halfTone + 12,
          duration: note.Length.realValue * 4,
          ref: note,
        })),
    };

    const lastEntry = verticalEntries[verticalEntries.length - 1];
    if (lastEntry) {
      const timeToNewEntry = newEntry.timestamp - lastEntry.timestamp;
      verticalEntries[verticalEntries.length - 1].timeToNext = timeToNewEntry;
    }

    verticalEntries.push(newEntry);
    cursor.next();
  }

  return verticalEntries;
};

const getCursorTimestamp = R.path(['Iterator', 'CurrentSourceTimestamp', 'realValue']);
export const getAudacity = R.and(
  R.path(['voiceEntry', 'parentVoice', 'audible']),
  note => !note.isRest(),
);

export const mapOsmdToNotes = (osmd) => {
  const { cursor } = osmd;
  const notes = [];

  const lengthLens = R.lensPath(['length', 'realValue']);

  while (!cursor.Iterator.EndReached) {
    const timestamp = getCursorTimestamp(cursor);
    // eslint-disable-next-line no-loop-func
    R.chain(note => R.pipe(
      R.pick(['halfTone']),
      R.over(R.lensProp('halfTone'), R.add(12)),
      R.assoc('length', R.view(lengthLens)(note) * 4),
      R.assoc('timestamp', timestamp * 4),
      R.assoc('audible', getAudacity(note)),
      R.assoc('ref', note),
      (n) => { notes.push(n); },
    )(note))(cursor.NotesUnderCursor());

    cursor.next();
  }

  cursor.reset();
  return notes;
};

export const mapOsmdToEntryTiming = (osmd) => {
  const { cursor } = osmd;
  const timing = [];

  let id = 0;
  while (!cursor.Iterator.EndReached) {
    const timestamp = getCursorTimestamp(cursor) * 4;
    timing.push({ timestamp, id });
    id += 1;
    cursor.next();
  }

  cursor.reset();
  return timing;
};
