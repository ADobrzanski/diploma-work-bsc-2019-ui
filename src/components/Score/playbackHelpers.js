import EventBus from '../../event-bus/event-bus';
import { SCORE_PLAY_NOTE } from './events';
// eslint-disable-next-line import/prefer-default-export
export const mapOsmdToVerticalEntries = (osmd) => {
  const { cursor } = osmd;
  const verticalEntries = [];

  while (!cursor.Iterator.EndReached) {
    const newEntry = {
      timestamp: cursor.Iterator.CurrentSourceTimestamp.realValue * 1000 * 4,
      timeToNext: -1,
      notes: cursor.NotesUnderCursor()
        .map(({ halfTone, Length }) => ({
          note: halfTone + 12,
          duration: Length.realValue * 1000 * 4,
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

export const playVerticalEntry = (entry) => {
  entry.notes.forEach((note) => {
    EventBus.$emit(SCORE_PLAY_NOTE, note);
  });
};
