<template>
  <section id="keyboard" class="keyboard">
    <key
      v-for="key in this.keys"
      :key="key.midiCode"
      :midiCode="key.midiCode"
      :type="key.type"
      :prevKeyType="key.prevKeyType"
      :pianoSize="pianoSize"/>
  </section>
</template>

<script>
import * as R from 'ramda';
import Key from './PianoKey.vue';
import {
  getMidiCodeFromKey,
  getKeyTypeFromMidiCode,
  KEY_WHITE,
} from './utils';

export default {
  name: 'piano-keyboard',
  components: {
    key: Key,
  },
  props: {
    firstKey: {
      type: String,
      default: 'C2',
    },
    keyCount: {
      type: Number,
      default: 12,
    },
  },
  computed: {
    keys() {
      const firstMidiCode = getMidiCodeFromKey(this.firstKey);
      let lastMidiCode = firstMidiCode + this.keyCount;
      if (getKeyTypeFromMidiCode(lastMidiCode) === KEY_WHITE) lastMidiCode += 1;
      const midiCodes = R.range(firstMidiCode, lastMidiCode);


      return midiCodes.map((midiCode, idx, codes) => {
        let prevKeyType = KEY_WHITE;
        if (idx > 0) prevKeyType = getKeyTypeFromMidiCode(codes[(idx - 1)]);
        return ({
          midiCode,
          type: getKeyTypeFromMidiCode(midiCode),
          prevKeyType,
        });
      });
    },
    pianoSize() {
      return this.keys.filter(R.propEq('type', KEY_WHITE)).length;
    },
  },
};
</script>

<style lang="scss" scoped>
  .keyboard {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-content: top;
  }
</style>
