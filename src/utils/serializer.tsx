import React from "react";
import type {BlockRenderers, Node} from "../types";
import type {createTextRenderer} from "./textRenderer";
import {createElementRenderer} from "./elementRenderer";

export function createSerializer(
    renderText: ReturnType<typeof createTextRenderer>,
    blockRenderers: BlockRenderers<Record<string, any>>,
    renderElement: ReturnType<typeof createElementRenderer>
) {
    function serialize(children: Node[]): React.ReactNode[] | null {
        return children.map((node, index) => {
            if (node.type === "text") {
                return (
                    <React.Fragment key={index}>{renderText(node)}</React.Fragment>
                );
            }

            if (node.type === "block") {
                const renderer = blockRenderers[node.fields.blockType] as (
                    props: unknown,
                ) => React.ReactNode;

                if (typeof renderer !== "function") {
                    throw new Error(
                        `Missing block renderer for block type '${node.fields.blockType}'`,
                    );
                }

                return <React.Fragment key={index}>{renderer(node)}</React.Fragment>;
            }

            if (
                node.type === "linebreak" ||
                node.type === "tab" ||
                node.type === "upload"
            ) {
                return (
                    <React.Fragment key={index}>{renderElement(node)}</React.Fragment>
                );
            }

            return (
                <React.Fragment key={index}>
                    {renderElement(node, serialize(node.children))}
                </React.Fragment>
            );
        });
    }

    return serialize;
}