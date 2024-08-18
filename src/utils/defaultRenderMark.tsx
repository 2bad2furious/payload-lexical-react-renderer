import type {CSSProperties} from "react";
import type {RenderMark} from "../types";

export const defaultRenderMark: RenderMark<boolean> = (mark) =>  {
    const style: CSSProperties = {};

    if (mark.bold) {
        style.fontWeight = "bold";
    }

    if (mark.italic) {
        style.fontStyle = "italic";
    }

    if (mark.underline) {
        style.textDecoration = "underline";
    }

    if (mark.strikethrough) {
        style.textDecoration = "line-through";
    }

    if (mark.code) {
        return <code>{mark.text}</code>;
    }

    if (mark.highlight) {
        return <mark style={style}>{mark.text}</mark>;
    }

    if (mark.subscript) {
        return <sub style={style}>{mark.text}</sub>;
    }

    if (mark.superscript) {
        return <sup style={style}>{mark.text}</sup>;
    }

    if (Object.keys(style).length === 0) {
        return <>{mark.text}</>;
    }

    return <span style={style}>{mark.text}</span>;
};
