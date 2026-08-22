import type { CollectionConfig } from "payload";

// The catalog's category list. This used to be a hardcoded `select` on the
// products collection, so adding a category meant a code change — it lives
// here instead so /admin can add, reorder and rename them.
//
// The split between `value` and `label` is the important part: `value` is the
// stable key products are filed under and that /catalog?category=… is built
// from, while `label` is the only human-facing half and is localized. Reword
// a label freely; changing a value breaks the products already using it.
export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "value", "order"],
    description:
      "Categories shown in the /catalog filters. Renaming a label is safe at any time; see the value field before changing it.",
    group: "Taxonomy",
  },
  access: {
    read: () => true,
  },
  defaultSort: "order",
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: 'Display name, e.g. "Hybrid". Has an en/ka switcher.',
      },
    },
    {
      name: "value",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "Stable key, e.g. HYBRID. Stored on every product in this category and used in /catalog?category=… links. Set it once and leave it. Changing it drops the products already filed here out of that filter and breaks any shared link.",
      },
      hooks: {
        // Normalised so "hybrid" typed in the admin can't become a second,
        // separate key alongside an existing "HYBRID".
        beforeValidate: [
          ({ value }) =>
            typeof value === "string" ? value.trim().toUpperCase() : value,
        ],
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Position in the filter list, lowest first.",
        step: 1,
      },
    },
  ],
};
