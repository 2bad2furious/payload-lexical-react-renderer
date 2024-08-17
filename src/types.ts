import type React from "react";

export type AbstractNode<Type extends string> = {
    format?: "" | "start" | "center" | "right" | "justify" | number;
    type: Type;
    version: number;
};

export type AbstractElementNode<Type extends string> = {
    direction: "ltr" | "rtl" | null;
    indent: number;
} & AbstractNode<Type>;

export type AbstractTextNode<Type extends string> = {
    detail: number; // what is this
    format: "" | number;
    mode: "normal"; // what is this
    style: string;
    text: string;
} & AbstractNode<Type>;

export type BlockNode<
    BlockData extends Record<string, unknown>,
    BlockType extends string,
> = {
    fields: {
        id: string;
        blockName: string;
        blockType: BlockType;
    } & BlockData;
} & AbstractElementNode<"block">;

type UnknownBlockNode = {
    fields: {
        id: string;
        blockName: string;
        blockType: string;
        [key: string]: unknown;
    };
} & AbstractNode<"block">;

export type Root = {
    children: Node[];
} & AbstractElementNode<"root">;

export type Mark = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
    subscript?: boolean;
    superscript?: boolean;
    highlight?: boolean;
};

export type TextNode = AbstractTextNode<"text">;
export type Linebreak = AbstractNode<"linebreak">;
export type Tab = AbstractTextNode<"tab">;

export type LinkNode = {
    children: TextNode[];
    fields:
        | {
        linkType: "custom";
        newTab: boolean;
        url: string;
    }
        | {
        doc: {
            relationTo: string;
            value: unknown;
        };
        linkType: "internal";
        newTab: boolean;
        url: string;
    };
} & AbstractElementNode<"link">;

export type AutoLinkNode = {
    children: TextNode[];
    fields: {
        linkType: "custom";
        newTab?: boolean;
        url: string;
    };
} & AbstractElementNode<"autolink">;

export type HeadingNode = {
    tag: string;
    children: TextNode[];
} & AbstractElementNode<"heading">;

export type ParagraphNode = {
    children: (TextNode | Linebreak | Tab | LinkNode | AutoLinkNode)[];
} & AbstractElementNode<"paragraph">;

export type ListItemNode = {
    children: (TextNode | ListNode)[];
    value: number;
} & AbstractElementNode<"listitem">;

export type ListNode = {
    tag: string;
    listType: "number" | "bullet" | "check";
    start: number;
    children: ListItemNode[];
} & AbstractElementNode<"list">;

export type QuoteNode = {
    children: TextNode[];
} & AbstractElementNode<"quote">;

export type UploadNode<
    MediaType = {
        id: string;
        alt: string;
        updatedAt: string;
        createdAt: string;
        url?: string;
        filename?: string;
        mimeType?: string;
        filesize?: number;
        width?: number;
        height?: number;
    },
> = {
    fields: null;
    relationTo: "media";
    value: MediaType;
} & AbstractElementNode<"upload">;

export type Node =
    | HeadingNode
    | ParagraphNode
    | UploadNode
    | TextNode
    | ListNode
    | ListItemNode
    | QuoteNode
    | Linebreak
    | Tab
    | LinkNode
    | UnknownBlockNode
    | AutoLinkNode;

export type ElementRenderers = {
    heading: (
        props: { children: React.ReactNode } & Omit<HeadingNode, "children">,
    ) => React.ReactNode;
    list: (
        props: { children: React.ReactNode } & Omit<ListNode, "children">,
    ) => React.ReactNode;
    listItem: (
        props: { children: React.ReactNode } & Omit<ListItemNode, "children">,
    ) => React.ReactNode;
    paragraph: (
        props: { children: React.ReactNode } & Omit<ParagraphNode, "children">,
    ) => React.ReactNode;
    quote: (
        props: { children: React.ReactNode } & Omit<QuoteNode, "children">,
    ) => React.ReactNode;
    link: (
        props: { children: React.ReactNode } & Omit<LinkNode, "children">,
    ) => React.ReactNode;
    autolink: (
        props: { children: React.ReactNode } & Omit<AutoLinkNode, "children">,
    ) => React.ReactNode;
    linebreak: () => React.ReactNode;
    tab: () => React.ReactNode;
    upload: (props: UploadNode) => React.ReactNode;
};

export type RenderMark = (mark: Mark) => React.ReactNode;

export type PayloadLexicalReactRendererContent = {
    root: Root;
};

export type BlocksType = Record<string, any>;

export type BlockRenderers<Blocks extends BlocksType> = {
    [BlockName in Extract<keyof Blocks, string>]?: (
        props: BlockNode<Blocks[BlockName], BlockName>,
    ) => React.ReactNode;
}