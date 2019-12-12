// eslint-disable-next-line import/prefer-default-export
export const mapOsmdToVerticalEntries = (osmd) => {
  const { cursor } = osmd;
  const verticalEntries = [];

  while (!cursor.Iterator.EndReached) {
    const newEntry = {
      timestamp: cursor.Iterator.CurrentSourceTimestamp.realValue * 1000 * 4,
      longestNote: Math.max(...cursor.NotesUnderCursor()
        .filter(note => !note.isRest())
        .map(({ Length }) => Length.realValue * 1000 * 4)),
      timeToNext: -1,
      notes: cursor.NotesUnderCursor()
        .filter(note => !note.isRest())
        .map(note => ({
          note: note.halfTone + 12,
          duration: note.Length.realValue * 1000 * 4,
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
