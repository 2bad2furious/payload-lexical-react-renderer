import type {RenderMark, TextNode} from "../types";
import type React from "react";

// This copy-and-pasted from somewhere in lexical here: https://github.com/facebook/lexical/blob/c2ceee223f46543d12c574e62155e619f9a18a5d/packages/lexical/src/LexicalConstants.ts
const IS_BOLD = 1;
const IS_ITALIC = 1 << 1;
const IS_STRIKETHROUGH = 1 << 2;
const IS_UNDERLINE = 1 << 3;
const IS_CODE = 1 << 4;
const IS_SUBSCRIPT = 1 << 5;
const IS_SUPERSCRIPT = 1 << 6;
const IS_HIGHLIGHT = 1 << 7;

export function createTextRenderer (renderMark: RenderMark) {
    if (!renderMark) {
        throw new Error("'renderMark' prop not provided.");
    }

    return  (node: TextNode): React.ReactNode | null => {
        if (!node.format) {
            return renderMark({
                text: node.text,
            });
        }

        return renderMark({
            text: node.text,
            bold: (node.format & IS_BOLD) > 0,
            italic: (node.format & IS_ITALIC) > 0,
            underline: (node.format & IS_UNDERLINE) > 0,
            strikethrough: (node.format & IS_STRIKETHROUGH) > 0,
            code: (node.format & IS_CODE) > 0,
            subscript: (node.format & IS_SUBSCRIPT) > 0,
            superscript: (node.format & IS_SUPERSCRIPT) > 0,
            highlight: (node.format & IS_HIGHLIGHT) > 0,
        });
    }
}