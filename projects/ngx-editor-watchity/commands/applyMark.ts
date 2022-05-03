import { MarkType } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import { EditorState, TextSelection, Transaction } from 'prosemirror-state';

import { markApplies } from 'ngx-editor-watchity/helpers';

// Ref: https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js
export const applyMark = (type: MarkType, attrs: Record<string, any> = {}): Command => {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { tr, selection } = state;
    const { empty, ranges, $from, $to } = selection;

    if (empty && selection instanceof TextSelection) {
      const { $cursor } = selection;

      if (!$cursor || !markApplies(state.doc, ranges, type)) {
        return false;
      }

      tr.addStoredMark(type.create(attrs));
      if (!tr.storedMarksSet) {
        return false;
      }

      dispatch?.(tr);
    } else {
      tr.addMark($from.pos, $to.pos, type.create(attrs));

      if (!tr.docChanged) {
        return false;
      }

      dispatch?.(tr.scrollIntoView());
    }

    return true;
  };
};
