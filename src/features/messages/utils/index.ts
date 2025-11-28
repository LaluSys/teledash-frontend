import { urlWithHttps } from "utils/urlWithHttps";

import { MessageEntity } from "types";

// Inspired by https://gist.github.com/chuv1/9641abc8a5a1a9b3bb8c9177fb7ffa9e
export function parseMessageEntitiesAndHighlights(
  text: string,
  entities?: Array<MessageEntity>,
  highlighted_text?: string,
) {
  let tags: Array<{
    index: number;
    tag: string;
  }> = [];

  if (entities) {
    entities.forEach((entity) => {
      const startTag = getTag(entity, text);

      if (!startTag) {
        return;
      }

      let searchTag = tags.filter((tag) => tag.index === entity.offset);

      if (searchTag.length > 0) {
        searchTag[0].tag += startTag;
      } else {
        tags.push({
          index: entity.offset,
          tag: startTag,
        });
      }

      // Extract tag name from the opening tag
      const tagName = startTag.match(/<([a-z]+)[\s>]/i)?.[1] ?? "";
      const closeTag = `</${tagName}>`;

      searchTag = tags.filter(
        (tag) => tag.index === entity.offset + entity.length,
      );

      if (searchTag.length > 0) {
        searchTag[0].tag = closeTag + searchTag[0].tag;
      } else {
        tags.push({
          index: entity.offset + entity.length,
          tag: closeTag,
        });
      }
    });
  }

  if (highlighted_text) {
    let match: RegExpExecArray | null;
    const regexp = /<span class='highlight'>|<\/span>/g;
    while ((match = regexp.exec(highlighted_text)) !== null) {
      // Store the index in a const to ensure type safety
      const matchIndex = match.index;
      const searchTag = tags.filter((tag) => tag.index === matchIndex);

      if (searchTag.length > 0) {
        searchTag[0].tag = match[0] + searchTag[0].tag;
      } else {
        tags.push({
          index: matchIndex,
          tag: match[0],
        });
      }

      highlighted_text = highlighted_text.replace(match[0], "");
      regexp.lastIndex = 0;
    }
  }

  let html = "";
  for (let i = 0; i < text.length; i++) {
    const tag = tags.filter((tag) => tag.index === i);
    tags = tags.filter((tag) => tag.index !== i);
    if (tag.length > 0) html += tag[0].tag;
    html += text[i];
  }
  if (tags.length > 0) html += tags[0].tag;

  return html;
}

function getTag(entity: MessageEntity, text: string) {
  const entityText = text.slice(entity.offset, entity.offset + entity.length);
  const linkClass = `class="text-indigo-800 hover:underline" target="_blank" rel="noreferrer"`;

  switch (entity.type) {
    case "mention":
      return `<a href="https://t.me/${entityText.replace(
        "@",
        "",
      )}" ${linkClass}>`;
    case "url":
      return `<a href="${urlWithHttps(entityText)}" ${linkClass}>`;
    case "email":
      return `<a href="mailto:${entityText}" ${linkClass}>`;
    case "phone_number":
      return `<a href="tel:${entityText}" ${linkClass}>`;
    case "bold":
      return `<strong>`;
    case "italic":
      return `<i>`;
    case "underline":
      return `<u>`;
    case "strikethrough":
      return `<s>`;
    case "spoiler":
      return `<mark>`;
    case "code":
      return `<code>`;
    case "pre":
      return `<pre>`;
    case "blockquote":
      return `<blockquote>`;
    case "text_link":
      return `<a href="${entity.url}" ${linkClass}>`;
    case "hashtag":
      return `<span class="text-blue-800">`;
    default:
      return `<span>`;
  }
}
