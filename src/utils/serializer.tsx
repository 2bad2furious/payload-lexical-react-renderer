import React, {ReactNode} from "react";
import type {Asyncable, BlockRenderers, Node} from "../types";
import type {TextRenderer} from "./textRenderer";
import {ElementRenderer} from "./elementRenderer";
import {mapWhenReady} from "./mapWhenReady";

type Serialized<Async extends boolean> = Asyncable<Async, ReactNode[]>;

export function createSerializer<Async extends boolean>(
    async: Async,
    renderText: TextRenderer<Async>,
    blockRenderers: BlockRenderers<Async, Record<string, any>>,
    renderElement: ElementRenderer<Async>
) {
    function serialize(children: Node[]): Serialized<Async> {
        const mappedChildren: Asyncable<Async, ReactNode>[] = children.map((node, index) => {
            if (node.type === "text") {
                return (
                    mapWhenReady(renderText(node), text => <React.Fragment key={index}>{text}</React.Fragment>)
                );
            }

            if (node.type === "block") {
                const renderer = blockRenderers[node.fields.blockType] as (
                    props: unknown,
                ) => Asyncable<Async, React.ReactNode>;

                if (typeof renderer !== "function") {
                    throw new Error(
                        `Missing block renderer for block type '${node.fields.blockType}'`,
                    );
                }

                return mapWhenReady(renderer(node), block => <React.Fragment key={index}>{block}</React.Fragment>);
            }

            if (
                node.type === "linebreak" ||
                node.type === "tab" ||
                node.type === "upload"
            ) {
                return mapWhenReady(renderElement(node), el => <React.Fragment key={index}>{el}</React.Fragment>);
            }

            return mapWhenReady(
                serialize(node.children),
                children => {
                    return mapWhenReady(
                        renderElement(node, children),
                        el => <React.Fragment key={index}>{el}</React.Fragment>
                    );
                }
            );
        });

        if (async) {
            return Promise.all(mappedChildren) as unknown as Serialized<Async>;
        }

        return mappedChildren as (ReactNode)[];
    }

    return serialize;
}