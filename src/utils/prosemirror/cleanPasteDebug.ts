/**
 * DEBUG VERSION - Paste Plain Text Without Line Breaks Plugin
 *
 * This version includes extensive console logging to help debug issues.
 * Use this version to troubleshoot, then switch back to the regular version.
 */

import { Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Slice, Fragment, Schema } from "prosemirror-model";

interface PasteNoLineBreaksOptions {
  separator?: string;
}

interface ExtendedClipboardEvent extends ClipboardEvent {
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
}

export class PasteNoLineBreaksPluginDebug {
  static build(schema: Schema, options: PasteNoLineBreaksOptions = {}): Plugin {
    const separator = options.separator ?? ' ';

    console.log('A5E | Paste plugin DEBUG: Building plugin with separator:', JSON.stringify(separator));

    return new Plugin({
      key: new PluginKey("pasteNoLineBreaks"),

      props: {
        handleDOMEvents: {
          // Log ALL paste events
          paste(view: EditorView, event: Event): boolean {
            const clipboardEvent = event as ExtendedClipboardEvent;

            console.log('A5E | Paste plugin DEBUG: Paste event detected!');
            console.log('  - Event:', clipboardEvent);
            console.log('  - ctrlKey:', clipboardEvent.ctrlKey);
            console.log('  - metaKey:', clipboardEvent.metaKey);
            console.log('  - altKey:', clipboardEvent.altKey);
            console.log('  - shiftKey:', clipboardEvent.shiftKey);

            // Check if Ctrl+Alt (or Cmd+Alt on Mac) is pressed
            const isSpecialPaste = (clipboardEvent.ctrlKey || clipboardEvent.metaKey) && clipboardEvent.altKey;

            console.log('  - isSpecialPaste:', isSpecialPaste);

            if (!isSpecialPaste) {
              console.log('  - Not a special paste, passing through to normal handler');
              return false;
            }

            console.log('  - SPECIAL PASTE DETECTED! Processing...');

            // Prevent default paste behavior
            event.preventDefault();
            event.stopPropagation();

            console.log('  - Default prevented and propagation stopped');

            // Get clipboard data
            const clipboardData = clipboardEvent.clipboardData;

            if (!clipboardData) {
              console.error('  - ERROR: No clipboard data available!');
              return true;
            }

            console.log('  - Clipboard data found');

            // Get plain text
            let content = clipboardData.getData('text/plain');
            console.log('  - Plain text length:', content?.length || 0);
            console.log('  - Plain text preview:', content?.substring(0, 100));

            if (!content) {
              // Fallback: try HTML
              const html = clipboardData.getData('text/html');
              console.log('  - No plain text, trying HTML. HTML length:', html?.length || 0);

              if (html) {
                const temp = document.createElement('div');
                temp.innerHTML = html;
                content = temp.textContent || temp.innerText || '';
                console.log('  - Extracted text from HTML, length:', content.length);
              }
            }

            if (!content) {
              console.error('  - ERROR: No content to paste!');
              return true;
            }

            console.log('  - Original content length:', content.length);
            console.log('  - Original content preview:', content.substring(0, 100));

            // Process content
            const originalLength = content.length;
            content = content
              .replace(/[\r\n]+/g, separator)
              .replace(/\s+/g, ' ')
              .trim();

            console.log('  - Processed content length:', content.length, '(was', originalLength + ')');
            console.log('  - Processed content preview:', content.substring(0, 100));

            // Create text node
            console.log('  - Creating text node...');
            const textNode = schema.text(content);
            console.log('  - Text node created:', textNode);

            const slice = new Slice(Fragment.from(textNode), 0, 0);
            console.log('  - Slice created:', slice);

            // Insert into editor
            console.log('  - Inserting into editor...');
            console.log('  - Current selection:', view.state.selection);

            const tr = view.state.tr.replaceSelection(slice);
            console.log('  - Transaction created:', tr);

            view.dispatch(tr);
            console.log('  - Transaction dispatched!');
            console.log('  - SUCCESS: Content pasted without line breaks');

            return true;
          }
        }
      }
    });
  }
}

export function registerPasteNoLineBreaksPluginDebug(): void {
  console.log('A5E | Paste plugin DEBUG: Registering plugin...');

  Hooks.on("createProseMirrorEditor", (uuid: string, plugins: Record<string, Plugin>, options: any) => {
    console.log('A5E | Paste plugin DEBUG: createProseMirrorEditor hook called');
    console.log('  - UUID:', uuid);
    console.log('  - Existing plugins:', Object.keys(plugins));
    console.log('  - Schema available:', !!options?.state?.schema);

    plugins.pasteNoLineBreaks = PasteNoLineBreaksPluginDebug.build(
      options.state.schema,
      { separator: ' ' }
    );

    console.log('A5E | Paste plugin DEBUG: Plugin registered for editor:', uuid);
    console.log('  - Updated plugins:', Object.keys(plugins));
  });

  console.log('A5E | Paste plugin DEBUG: Registration complete');
}

export default registerPasteNoLineBreaksPluginDebug;
