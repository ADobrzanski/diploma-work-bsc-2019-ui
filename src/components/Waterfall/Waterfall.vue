<template>
  <canvas id="waterfall" ref="waterfall" class="waterfall"></canvas>
</template>

<script>
import * as R from 'ramda';
import { mapGetters, mapActions } from 'vuex';
import {
  KEY_WHITE,
  getMidiCodeFromKey,
  getKeyTypeFromMidiCode,
  KEY_BLACK,
} from '../PianoKeyboard/utils';
import {
  whiteKeyCount,
  appendType,
  appendWidth,
  appendOffset,
} from './utils';

export default {
  name: 'waterfall',
  data() {
    return {
      context: null,
      resizeListener: null,
      dropletSchemas: null,
    };
  },
  computed: {
    ...mapGetters([
      'playbackTimestamp',
      'playbackStartTimestamp',
      'isPlaybackPlaying',
      'playbackActiveNotes',
      'isScoreReady',
      'scoreEntries',
      'keyboardStartKey',
      'keyboardKeyCount',
    ]),
  },
  watch: {
    isScoreReady() {
      if (this.isScoreReady) this.drawFrame();
    },
    isPlaybackPlaying() {
      if (this.isPlaybackPlaying) {
        this.startWaterfall();
      } else {
        this.stopWaterfall();
      }
    },
    playbackTimestamp() {
      this.drawFrame();
    },
  },
  mounted() {
    this.initializeCanvasContext();
    this.addRoundedRectPrototype();
    this.calculateMidiToDropletMapping();
  },
  updated() {
    this.drawFrame();
  },
  methods: {
    ...mapActions(['setPlaybackActiveNotes']),
    initializeCanvasContext() {
      this.context = this.$refs.waterfall.getContext('2d');
      this.matchCanvasSizeWithContainter();

      this.context.fillStyle = '#5CDB95';
      this.resizeListener = window.addEventListener('resize', () => {
        this.matchCanvasSizeWithContainter();
      });
    },
    matchCanvasSizeWithContainter() {
      this.context.canvas.width = this.context.canvas.clientWidth;
      this.context.canvas.height = this.context.canvas.clientHeight;
      this.calculateMidiToDropletMapping();
    },
    addRoundedRectPrototype() {
      // eslint-disable-next-line
      CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
        /* eslint-disable no-param-reassign */
        if (Math.abs(width) < 2 * radius) radius = width / 2;
        if (Math.abs(height) < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
      };
    },
    calculateMidiToDropletMapping() {
      const firstMidiCode = getMidiCodeFromKey(this.keyboardStartKey);
      let lastMidiCode = firstMidiCode + this.keyboardKeyCount;
      if (getKeyTypeFromMidiCode(lastMidiCode) === KEY_WHITE) lastMidiCode += 1;

      const keyCodes = R.range(firstMidiCode, lastMidiCode);

      const containerWidth = this.context.canvas.clientWidth;
      const whiteKeyWidth = containerWidth / whiteKeyCount(keyCodes);

      const dropletsSchemaData = R.pipe(
        R.map(R.objOf('code')),
        appendType,
        appendWidth(whiteKeyWidth),
        appendOffset,
      )(keyCodes);

      this.dropletSchemas = R.mergeAll(R.map(
        data => R.objOf(data.code, data),
      )(dropletsSchemaData));
    },
    translate00ToBottom() {
      this.context.translate(0, this.context.canvas.height);
    },
    msToPx(ms) {
      return ms * 50 / 250;
    },
    pxToMs(px) {
      return px * 250 / 50;
    },
    extractVisibleNotes(start, end) {
      return this.scoreEntries.filter(entry => entry.timestamp >= start && entry.timestamp <= end);
    },
    startWaterfall() {
      this.request = requestAnimationFrame(this.loop);
    },
    stopWaterfall() {
      cancelAnimationFrame(this.request);
    },
    drawFrame() {
      this.resetCanvas();
      this.translate00ToBottom();
      this.translateToScoreTimestamp();
      this.translateByTimeElapsed();
      this.drawAllDroplets();
    },
    resetCanvas() {
      const { context } = this;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    },
    translateToScoreTimestamp() {
      const { context, msToPx } = this;

      context.translate(0, msToPx(this.playbackTimestamp));
    },
    translateByTimeElapsed() {
      const { context, msToPx } = this;

      if (this.isPlaybackPlaying) {
        context.translate(0, msToPx(
          performance.now() - this.playbackStartTimestamp,
        ));
      }
    },
    getVisibleEntries() {
      const { pxToMs, context } = this;
      let timeFromStart = 0;
      if (this.isPlaybackPlaying) timeFromStart = (performance.now() - this.playbackStartTimestamp);

      const windowStart = this.playbackTimestamp + timeFromStart;
      const windowEnd = windowStart + pxToMs(context.canvas.height);

      const visibleEntries = this.scoreEntries.filter(
        ({ timestamp, longestNote }) => timestamp < windowEnd
          && (longestNote + timestamp) > windowStart,
      );

      const activeNotes = R.chain(R.pipe(
        ({ notes, timestamp }) => R.filter(
          ({ duration }) => timestamp <= windowStart
            && timestamp + duration >= windowStart,
        )(notes),
        R.map(R.prop('note')),
      ))(visibleEntries);

      /*
      R.chain(({ notes, timestamp }) => R.pipe(
        R.filter(({ duration }) => timestamp <= windowStart
          && timestamp + duration >= windowStart),
        R.prop('note'),
      )(notes))(visibleEntries);
      */

      if (R.symmetricDifference(this.playbackActiveNotes, activeNotes)) {
        this.setPlaybackActiveNotes(activeNotes);
      }

      return visibleEntries;
    },
    drawAllDroplets() {
      const { msToPx, context, dropletSchemas } = this;

      const blacks = [];
      const visibleEntries = this.getVisibleEntries();
      visibleEntries.forEach(({ timestamp, notes }) => {
        notes.forEach((note) => {
          const { note: noteVal, duration } = note;
          if (dropletSchemas[noteVal].type === KEY_BLACK) {
            note.timestamp = timestamp;
            blacks.push(note);
            return;
          }
          context.roundRect(
            dropletSchemas[noteVal].offset, -msToPx(timestamp),
            dropletSchemas[noteVal].width, -msToPx(duration) + 2,
            4,
          );
          this.context.fillStyle = '#5CDB95';
          this.context.fill();
        });
      });

      blacks.forEach((note) => {
        const { note: noteVal, duration, timestamp } = note;
        context.roundRect(
          dropletSchemas[noteVal].offset, -msToPx(timestamp),
          dropletSchemas[noteVal].width, -msToPx(duration) + 2,
          4,
        );
        this.context.fillStyle = '#2e6d4a';
        this.context.fill();
      });

      // getActiveNotes
    },
    loop() {
      this.drawFrame();
      this.request = requestAnimationFrame(() => this.loop());
    },
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  },
};
</script>

<style lang="scss" scoped>
  .waterfall {
    width: 100%;
    height: 300px;
    border-radius: 32px 32px 0 0;
    // border-bottom: 2px solid blue;
    margin: 0;
    padding: 0;
    background-color: black;
  }
</style>
