/**
 * JSON for a `<script type="application/ld+json">` tag. `JSON.stringify`
 * leaves `<` as is, so a text containing `</script>` would close the tag
 * early; escaping `<` keeps the data inert whatever the content says.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
