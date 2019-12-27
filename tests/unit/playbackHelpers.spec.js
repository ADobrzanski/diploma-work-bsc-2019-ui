import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import {
  mapOsmdToNotes,
  getAudacity,
} from '../../src/components/Score/playbackHelpers';

const TestSheet = require('../../src/assets/test_score_1.musicxml');

describe('helpers', () => {
  describe('getAudacity', () => {
    const div = document.createElement('div');
    const osmd = new OpenSheetMusicDisplay(div);

    let sopranoInaudibleNote;
    let tenorNote;
    let pianoRestNote;

    describe('given not empty note object', () => {
      beforeAll(async () => {
        await osmd.load(TestSheet);
        [sopranoInaudibleNote, tenorNote,, pianoRestNote] = osmd.cursor.NotesUnderCursor();
        sopranoInaudibleNote.ParentVoiceEntry.ParentVoice.Audible = false;
      });

      it('return true if note`s audiable and not rest note', () => {
        expect(getAudacity(tenorNote)).toBe(true);
      });

      it.skip('return false if note`s not audiable', () => {
        expect(getAudacity(sopranoInaudibleNote)).toBe(false);
      });

      it('return false if note`s rest note', () => {
        expect(getAudacity(pianoRestNote)).toBe(false);
      });
    });
  });

  describe('mapOsmdToNotes', () => {
    const div = document.createElement('div');
    const osmd = new OpenSheetMusicDisplay(div);
    const noteShape = {
      length: 0.0,
      halfTone: 0.0,
      timestamp: 0.0,
      audible: true,
      ref: {},
    };

    describe('given initialized osmd object', () => {
      beforeEach(async () => {
        await osmd.load(TestSheet);
      });

      it('returns collection of notes of expected shape', async () => {
        const notes = mapOsmdToNotes(osmd);
        expect(notes).not.toBeEmpty();
        if (notes) {
          notes.forEach(note => expect(note).toMatchShapeWith(noteShape));
        }
      });
    });
  });
});
