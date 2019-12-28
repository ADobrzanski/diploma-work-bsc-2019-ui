<template>
  <button
    :class="classNames"
    :style="style">
  </button>
</template>

<script>
import { mapGetters } from 'vuex';
import * as R from 'ramda';
import { KEY_WHITE, KEY_BLACK } from './utils';

export default {
  name: 'piano-key',
  props: {
    midiCode: {
      type: Number,
      default: -1,
    },
    type: {
      type: String,
      default: 'no-type',
    },
    prevKeyType: {
      type: String,
      defalut: KEY_WHITE,
    },
    pianoSize: Number,
  },
  computed: {
    ...mapGetters(['playbackActiveNotes']),
    classNames() {
      return {
        key: true,
        white: this.type === KEY_WHITE,
        black: this.type === KEY_BLACK,
        active: R.contains(this.midiCode, this.playbackActiveNotes),
      };
    },
    style() {
      return {
        width: this.type === KEY_WHITE
          ? `calc(100% / ${this.pianoSize})`
          : `calc(50% / ${this.pianoSize})`,
        marginLeft:
          (this.prevKeyType === KEY_BLACK || this.type === KEY_BLACK)
          && `calc(50% / (${this.pianoSize}) / -2)`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
  .key {
    position: relative;
    box-sizing: border-box;
    border-radius: 0 0 5% 5%;
  }

  .white {
    height: 100%;
    border-left:1px solid #bbb;
    border-bottom:1px solid #bbb;
    z-index: 1;
    box-shadow:-1px 0 0 rgba(255,255,255,0.8) inset,0 0 5px #ccc inset,0 0 3px rgba(0,0,0,0.2);
    background:linear-gradient(to bottom,#eee 0%,#fff 100%);
    &:active, &.active {
      border-top:1px solid #777;
      border-left:1px solid #999;
      border-bottom:1px solid #999;
      box-shadow:
        2px 0 3px rgba(0,0,0,0.1) inset,
        -5px 5px 20px rgba(0,0,0,0.2) inset,
        0 0 3px rgba(0,0,0,0.2);
      // background:linear-gradient(to bottom,#fff 0%,#e9e9e9 100%)
      background:linear-gradient(to bottom,#fff 0%,#5CDB95 100%)
    }
  }

  .black {
    height: 60%;
    border:1px solid #000;
    border-radius:0 0 3px 3px;
    box-shadow:
      -1px -1px 2px rgba(255,255,255,0.2) inset,
      0 -5px 2px 3px rgba(0,0,0,0.6) inset,
      0 2px 4px rgba(0,0,0,0.5);
    background:linear-gradient(45deg,#222 0%,#555 100%);
    z-index: 4;

    &:active, &.active {
      box-shadow:
        -1px -1px 2px rgba(255,255,255,0.2) inset,
        0 -2px 2px 3px rgba(0,0,0,0.6) inset,
        0 1px 2px rgba(0,0,0,0.5);
      background:linear-gradient(to right,#444 0%,#5CDB95 100%)
    }
  }
</style>
