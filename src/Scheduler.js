/* eslint-disable class-methods-use-this */
import cuid from 'cuid';
import * as R from 'ramda';

class Scheduler {
  constructor() {
    this.animation = requestAnimationFrame(() => this.loop());
    this.timelines = [
      {
        name: 'realtime',
        active: true,
        start: performance.now(),
        localTime: 0,
        callbacks: [],
      },
    ];
    this.everyTick = [];
  }

  register({ arr, ...callbackDetails }) {
    const uuid = cuid();
    arr.push({ uuid, ...callbackDetails, called: false });
    return () => this.deregister(arr, uuid);
  }

  // eslint-disable-next-line class-methods-use-this
  deregister(arr, uuid) {
    const idx = R.findIndex(R.propEq('uuid', uuid))(arr);
    arr.splice(idx, 1);
  }

  onEveryTick(callback) {
    return this.register({
      arr: this.everyTick,
      callback,
    });
  }

  createNewTimeline(name) {
    const newLine = {
      name,
      active: false,
      start: -1,
      localTime: 0,
      callbacks: [],
    };

    this.timelines.push(newLine);

    return newLine;
  }

  startTimeline(name) {
    const currTime = performance.now();
    const line = R.find(R.propEq('name', name))(this.timelines);

    if (line) {
      line.start = currTime;
      line.active = true;
    }
  }

  pauseTimeline(name) {
    const currTime = performance.now();
    const line = R.find(R.propEq('name', name));
    if (line) {
      line.active = false;
      line.localTime += (currTime - line.start);
    }
  }

  stopTimeline(name) {
    const line = R.find(R.propEq('name', name))(this.timelines);
    if (line) {
      line.active = false;
      line.localTime = 0;
      // eslint-disable-next-line no-param-reassign
      line.callbacks.forEach((item) => { item.called = false; });
    }
  }

  schedule({ timelineName = 'realtime', timepoint, callback }) {
    const { timelines } = this;

    const line = R.find(R.propEq('name', timelineName))(timelines)
      || this.createNewTimeline(timelineName);

    return this.register({
      arr: line.callbacks,
      timepoint,
      callback,
    });
  }

  performEveryTickTasks() {
    this.everyTick.forEach(({ callback }) => callback());
  }

  performScheduledTasks() {
    const currTime = performance.now();
    R.pipe(
      R.filter(R.prop('active')),
      R.chain((line) => {
        const localTime = line.localTime + currTime - line.start;
        return line.callbacks.filter(item => !item.called && item.timepoint <= localTime);
      }),
      R.forEach(
        (item) => {
          // eslint-disable-next-line no-param-reassign
          item.called = true;
          item.callback();
        },
      ),
    )(this.timelines);
  }

  loop() {
    // this.performEveryTickTasks();
    this.performScheduledTasks();
    requestAnimationFrame(() => this.loop());
  }

  expose() { console.log(this.timelines); }
}

export default Scheduler;
