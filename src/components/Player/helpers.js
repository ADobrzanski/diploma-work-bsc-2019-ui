import * as R from 'ramda';

export const mapNotesToSchedulable = R.map(
  note => ({
    time: note.timestamp,
    note: note.halfTone,
    duration: note.length,
  }),
);

export const filterForScheduleReady = (scheduable, timestamp) => scheduable
  .slice(
    R.findIndex(R.propSatisfies(R.lte(timestamp), 'time'))(scheduable),
  );
