import React from "react";
import type {
    BlockRenderers,
    BlocksType,
    ElementRenderers,
    PayloadLexicalReactRendererContent,
    RenderMark
} from "./types";
import {createElementRenderer, createTextRenderer, defaultElementRenderers, defaultRenderMark} from "./utils";
import {createSerializer} from "./utils";

export type PayloadLexicalReactRendererProps<
    Blocks extends BlocksType,
> = {
    content: PayloadLexicalReactRendererContent;
    elementRenderers?: ElementRenderers;
    renderMark?: RenderMark;
    blockRenderers?: BlockRenderers<Blocks>;
};

export function PayloadLexicalReactRenderer<
    Blocks extends BlocksType,
>({
      content,
      elementRenderers = defaultElementRenderers,
      renderMark = defaultRenderMark,
      blockRenderers = {},
  }: PayloadLexicalReactRendererProps<Blocks>) {
    const renderElement = React.useMemo(
        () => createElementRenderer(elementRenderers),
        [elementRenderers],
    );

    const renderText = React.useMemo(
        () => createTextRenderer(renderMark),
        [renderMark],
    );

    const serialize = React.useMemo(
        () => createSerializer(renderText, blockRenderers, renderElement),
        [renderElement, renderText, blockRenderers],
    );

    return <>{serialize(content.root.children)}</>;
}
