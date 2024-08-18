import {AbstractElementNode, ElementRenderers} from "../types";
import React from "react";

function getElementStyle<Type extends string>(
    {
        indent,
        format,
    }: AbstractElementNode<Type>): React.CSSProperties {
    const style: React.CSSProperties = {};

    if (indent > 0) {
        style.marginLeft = `${indent * 20}px`;
    }

    if (format === "right" || format === "center" || format === "justify") {
        style.textAlign = format;
    }

    return style;
}

export const defaultElementRenderers: ElementRenderers<false> = {
    heading: (element) => {
        return React.createElement(
            element.tag,
            {
                style: getElementStyle<"heading">(element),
            },
            element.children,
        );
    },
    list: (element) => {
        return React.createElement(
            element.tag,
            {
                style: getElementStyle<"list">(element),
            },
            element.children,
        );
    },
    listItem: (element) => {
        return (
            <li style={getElementStyle<"listitem">(element)}>{element.children}</li>
        );
    },
    paragraph: (element) => {
        return (
            <p style={getElementStyle<"paragraph">(element)}>{element.children}</p>
        );
    },
    link: (element) => (
        <a
            href={element.fields.url}
            target={element.fields.newTab ? "_blank" : "_self"}
            style={getElementStyle<"link">(element)}
        >
            {element.children}
        </a>
    ),
    autolink: (element) => (
        <a
            href={element.fields.url}
            target={element.fields.newTab ? "_blank" : "_self"}
            style={getElementStyle<"autolink">(element)}
        >
            {element.children}
        </a>
    ),
    quote: (element) => (
        <blockquote style={getElementStyle<"quote">(element)}>
            {element.children}
        </blockquote>
    ),
    linebreak: () => <br/>,
    tab: () => <br/>,
    upload: (element) => {
        if (element.value.mimeType?.includes("image")) {
            return <img src={element.value.url} alt={element.value.alt}/>;
        }
    },
};