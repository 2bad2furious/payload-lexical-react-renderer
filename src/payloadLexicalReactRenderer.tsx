import type {
    BlockRenderers,
    BlocksType,
    ElementRenderers,
    PayloadLexicalReactRendererContent,
    RenderMark
} from "./types";
import {
    createElementRenderer,
    createSerializer,
    createTextRenderer,
    defaultElementRenderers,
    defaultRenderMark,
    mapWhenReady
} from "./utils";

export type PayloadLexicalReactRendererProps<
    Blocks extends BlocksType,
    Async extends boolean = false
> = {
    async?: Async;
    content: PayloadLexicalReactRendererContent;
    elementRenderers?: ElementRenderers<Async>;
    renderMark?: RenderMark<Async>;
    blockRenderers?: BlockRenderers<Async, Blocks>;
};

export function PayloadLexicalReactRenderer<
    Blocks extends BlocksType,
    Async extends boolean = false
>({
      async,
      content,
      elementRenderers = defaultElementRenderers as ElementRenderers<boolean>,
      renderMark = defaultRenderMark,
      blockRenderers = {},
  }: PayloadLexicalReactRendererProps<Blocks, Async>) {
    const renderElement = createElementRenderer<Async>(elementRenderers);

    const renderText = createTextRenderer<Async>(renderMark);

    const serialize = createSerializer<Async>((async ?? false as Async), renderText, blockRenderers, renderElement);

    return mapWhenReady(serialize(content.root.children), (serialized) => {
        return <>{serialized}</>
    })

}
