<template>
  <div ref="waterfall" id="waterfall">
    <img ref="dropletsImg" :style="waterfallImgStyle" />
  </div>
</template>

<script>
import * as R from 'ramda';
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
import {
  WHITE_KEY_DROPLET_COLOR,
  BLACK_KEY_DROPLET_COLOR,
} from '../../consts/colors';

export default {
  name: 'waterfall',
  data() {
    return {
      resizeListener: null,
      imageLoadListener: null,
      dropletSchemas: null,
      imgOffset: 0,
    };
  },


  props: {
    active: {
      type: Boolean,
      defult: false,
    },
    now: {
      type: Function,
      default: () => performance.now(),
    },
    startTimestamp: {
      type: Number,
      default: 0,
    },
    songTimestamp: {
      type: Number,
      default: 0,
    },
    notes: {
      type: Array,
      default: () => [],
    },
    keyboard: {
      type: Object,
      default: () => ({
        startKey: 'C2',
        keyCount: 61,
      }),
    },
  },


  computed: {
    waterfallImgStyle() {
      return { transform: `translateY(${this.imgOffset}px)` };
    },
    droplets() {
      const { sToPx, dropletSchemas } = this;
      if (!dropletSchemas) return [];

      return R.map(
        note => ({
          x: dropletSchemas[note.halfTone].offset,
          y: sToPx(note.timestamp),
          w: dropletSchemas[note.halfTone].width,
          h: sToPx(note.length),
          color: dropletSchemas[note.halfTone].type === KEY_WHITE
            ? WHITE_KEY_DROPLET_COLOR
            : BLACK_KEY_DROPLET_COLOR,
          type: dropletSchemas[note.halfTone].type,
        }),
      )(R.filter(R.prop('audible'), this.notes)); // TODO swap for props.notes
    },
    waterfallImgUrl() {
      return this.prerender(this.droplets);
    },
  },


  watch: {
    active(isActive) { // TODO change for props.active
      if (isActive) {
        this.startWaterfall();
      } else {
        this.stopWaterfall();
        this.drawFrame();
      }
    },
    songTimestamp() { // TODO change for songTimestamp
      this.drawFrame();
    },
    waterfallImgUrl() {
      this.drawImage();
      this.drawFrame();
    },
  },


  mounted() {
    this.registerListeners();
    this.addRoundedRectPrototype();
    this.calculateMidiToDropletMapping();
  },


  updated() {
    this.drawImage();
  },


  methods: {
    registerListeners() {
      this.resizeListener = window.addEventListener('resize', () => {
        this.calculateMidiToDropletMapping();
      });

      this.imageLoadListener = this.$refs.dropletsImg.addEventListener(
        'load', () => { this.drawFrame(); },
      );
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
      const firstMidiCode = getMidiCodeFromKey(this.keyboard.startKey);
      let lastMidiCode = firstMidiCode + this.keyboard.keyCount;
      if (getKeyTypeFromMidiCode(lastMidiCode) === KEY_WHITE) lastMidiCode += 1;

      const keyCodes = R.range(firstMidiCode, lastMidiCode);

      const containerWidth = this.$refs.waterfall.getBoundingClientRect().width;
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
    sToPx(ms) {
      return ms * 50 / 250 * 1000;
    },
    pxToS(px) {
      return px * 250 / 50 * 1000;
    },
    startWaterfall() {
      this.request = requestAnimationFrame(this.loop);
    },
    stopWaterfall() {
      cancelAnimationFrame(this.request);
    },
    prerender(rects, { color } = { color: 'red' }) {
      const canvasW = R.pipe(
        R.map(({ x, w }) => x + w),
        R.reduce(R.max, 0),
      )(rects);

      const canvasH = R.pipe(
        R.map(({ y, h }) => y + h),
        R.reduce(R.max, 0),
      )(rects);

      const canvas = document.createElement('canvas');
      canvas.style.width = canvasW;
      canvas.style.height = canvasH;

      const context = canvas.getContext('2d');
      context.canvas.width = canvasW;
      context.canvas.height = canvasH;

      context.translate(0, context.canvas.height);

      const splitByKeyType = R.groupBy(R.prop('type'))(this.droplets);
      const whites = splitByKeyType[KEY_WHITE] || [];
      const blacks = splitByKeyType[KEY_BLACK] || [];

      context.fillStyle = color;

      whites.forEach((rect) => {
        if (rect.color) { context.fillStyle = rect.color; }
        context.roundRect(
          rect.x, -rect.y, rect.w, -rect.h + 2, 4,
        );
        context.fill();
        context.fillStyle = color;
      });

      blacks.forEach((rect) => {
        if (rect.color) { context.fillStyle = rect.color; }
        context.roundRect(
          rect.x, -rect.y, rect.w, -rect.h + 2, 4,
        );
        context.fill();
        context.fillStyle = color;
      });

      const url = canvas.toDataURL();
      return url;
    },
    drawImage() {
      const image = this.$refs.dropletsImg;
      image.src = this.waterfallImgUrl;
    },
    drawFrame() {
      const container = this.$refs.waterfall;
      const image = this.$refs.dropletsImg;

      const imgH = image.height;
      const boxH = container.getBoundingClientRect().height;

      const baseYShift = Math.abs(imgH - boxH);
      const deltaTime = this.now()
        - this.startTimestamp;
      let yShift = -baseYShift + this.sToPx(this.songTimestamp);
      if (this.active) yShift += this.sToPx(deltaTime);

      this.imgOffset = yShift;
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
  #waterfall {
    width: 100%;
    height: 300px;
    border-radius: 32px 32px 0 0;
    text-align: left;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: black;
  }

  .dropletsImg {
    width: 100%;
    height: auto;
    border: 0;
    padding: 0;
    margin: 0;
  }
</style>
