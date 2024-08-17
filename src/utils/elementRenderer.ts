import type {ElementRenderers, Node} from "../types";
import type React from "react";

export function createElementRenderer(elementRenderers: ElementRenderers) {
    return (node: Node, children?: React.ReactNode) => {
        if (!elementRenderers) {
            throw new Error("'elementRenderers' prop not provided.");
        }

        if (node.type === "link" && node.fields) {
            return elementRenderers.link({
                ...node,
                children,
            });
        }

        if (node.type === "autolink" && node.fields) {
            return elementRenderers.autolink({
                ...node,
                children,
            });
        }

        if (node.type === "heading") {
            return elementRenderers.heading({
                ...node,
                children,
            });
        }

        if (node.type === "paragraph") {
            return elementRenderers.paragraph({
                ...node,
                children,
            });
        }

        if (node.type === "list") {
            return elementRenderers.list({
                ...node,
                children,
            });
        }

        if (node.type === "listitem") {
            return elementRenderers.listItem({
                ...node,
                children,
            });
        }

        if (node.type === "quote") {
            return elementRenderers.quote({
                ...node,
                children,
            });
        }

        if (node.type === "linebreak") {
            return elementRenderers.linebreak();
        }

        if (node.type === "tab") {
            return elementRenderers.tab();
        }

        if (node.type === "upload") {
            return elementRenderers.upload(node);
        }

        throw new Error(`Missing element renderer for node type '${node.type}'`);
    };
}