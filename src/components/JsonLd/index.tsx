/**
 * Renders one schema.org graph into the page.
 *
 * The `<` escape is the reason this is a component rather than four copies of
 * the same three lines: a product name or a CMS description containing "</" —
 * or a stray `<script>` typed into a description field — would otherwise close
 * this tag early and inject the rest of the string as markup. Serialising it
 * as `<` keeps the JSON identical to a parser and inert to the HTML
 * tokenizer.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
