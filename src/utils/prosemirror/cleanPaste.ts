/**
 * Integration file for Paste-Plain-Text-No-LineBreaks Plugin
 * Add this to your Level Up system's initialization
 *
 * This plugin pastes content as plain text (stripping all formatting)
 * and removes all line breaks using Ctrl+Alt+V (Cmd+Alt+V on Mac)
 *
 * File location suggestion:
 * src/prosemirror/paste-no-linebreaks.ts or
 * src/prosemirror/plugins/paste-no-linebreaks.ts
 */

import { Plugin, PluginKey } from "prosemirror-state";
import { Slice, Fragment, Schema } from "prosemirror-model";
import { DOMParser } from "prosemirror-model";
import { EditorView } from "prosemirror-view";

/**
 * Options for configuring the PasteNoLineBreaksPlugin
 */
interface PasteNoLineBreaksOptions {
  /** Character(s) to use as separator instead of line breaks (default: ' ') */
  separator?: string;
}

/**
 * Extended ClipboardEvent with keyboard modifiers
 * Note: These properties exist on the actual event but aren't in the base ClipboardEvent type
 */
interface ExtendedClipboardEvent extends ClipboardEvent {
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
}

/**
 * ProseMirror plugin for pasting as plain text without line breaks
 * Strips all formatting (bold, italic, links, etc.) and removes line breaks
 */
export class PasteNoLineBreaksPlugin {
  /**
   * Build the plugin
   * @param schema - The ProseMirror schema
   * @param options - Additional options
   * @returns The configured ProseMirror plugin
   */
  static build(schema: Schema, options: PasteNoLineBreaksOptions = {}): Plugin {
    const separator = options.separator ?? ' ';

    return new Plugin({
      key: new PluginKey("pasteNoLineBreaks"),

      props: {
        /**
         * Handle DOM events, specifically paste events
         */
        handleDOMEvents: {
          paste(view: EditorView, event: Event): boolean {
            const clipboardEvent = event as ExtendedClipboardEvent;

            // Only handle paste with Ctrl/Cmd + Alt
            const isSpecialPaste = (clipboardEvent.ctrlKey || clipboardEvent.metaKey) && clipboardEvent.altKey;

            if (!isSpecialPaste) {
              return false; // Let normal paste handling occur
            }

            // Prevent default paste behavior
            clipboardEvent.preventDefault();

            // Get clipboard data
            const clipboardData = clipboardEvent.clipboardData;
            if (!clipboardData) return false;

            // Get plain text only (this strips all formatting)
            let plainContent = clipboardData.getData('text/plain');

            if (!plainContent) {
              // Fallback: try HTML and strip tags
              const htmlContent = clipboardData.getData('text/html');
              if (htmlContent) {
                const temp = document.createElement('div');
                temp.innerHTML = htmlContent;
                plainContent = temp.textContent || temp.innerText || '';
              }
            }

            if (!plainContent) return false;

            // Process the content - remove line breaks
            const processedContent = PasteNoLineBreaksPlugin.processPlainText(plainContent, separator);

            // Parse as plain text (no HTML)
            const parser = DOMParser.fromSchema(schema);
            const tempDiv = document.createElement('div');

            // Wrap in paragraph
            const p = document.createElement('p');
            p.textContent = processedContent;
            tempDiv.appendChild(p);

            const doc = parser.parse(tempDiv);
            const slice = doc.slice(0);

            // Insert the content
            const tr = view.state.tr.replaceSelection(slice);
            view.dispatch(tr);

            return true;
          }
        }
      }
    });
  }

  /**
   * Process plain text to remove line breaks
   * @param text - Plain text content
   * @param separator - Separator to use
   * @returns Processed text (plain text, no HTML)
   */
  static processPlainText(text: string, separator: string): string {
    // Replace all newlines and carriage returns with separator
    let processed = text.replace(/[\r\n]+/g, separator);

    // Clean up multiple consecutive separators
    const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const multiSeparatorRegex = new RegExp(`(${escapedSeparator}\\s*){2,}`, 'g');
    processed = processed.replace(multiSeparatorRegex, separator);

    // Trim
    processed = processed.trim();

    return processed;
  }
}

/**
 * Register the plugin with FoundryVTT
 * This should be called during your system's init hook
 */
export function registerPasteNoLineBreaksPlugin(): void {
  Hooks.on("createProseMirrorEditor", (uuid: string, plugins: Record<string, Plugin>, options: any) => {
    // Add the plugin to the editor
    plugins.pasteNoLineBreaks = PasteNoLineBreaksPlugin.build(
      options.state.schema,
      {
        separator: ' ' // You can change this to '\u00A0' for non-breaking space if preferred
      }
    );

    console.log("A5E | Registered Paste-No-LineBreaks plugin for editor:", uuid);
  });
}

// For systems using module pattern, you can also export a default initialization function
export default function init(): void {
  registerPasteNoLineBreaksPlugin();
}

/**
 * Usage in your main system file (e.g., a5e.ts or level-up.ts):
 *
 * import { registerPasteNoLineBreaksPlugin } from './prosemirror/paste-no-linebreaks';
 *
 * Hooks.once('init', () => {
 *   registerPasteNoLineBreaksPlugin();
 * });
 *
 * Users can then paste plain text without line breaks using:
 * Ctrl+Alt+V (Windows/Linux) or Cmd+Alt+V (Mac)
 */
