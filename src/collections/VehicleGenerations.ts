import type { CollectionConfig } from "payload";

// One generation of one model — the third and last step of the catalog's car
// picker, and the thing a product's fitment row actually points at.
//
// `yearTo` is deliberately optional: a generation still in production has no
// end year, and inventing one (2099, or this year) would either match nothing
// or quietly go stale. Empty means "still built", and both the picker and the
// filter read it that way.
export const VehicleGenerations: CollectionConfig = {
  slug: "vehicle-generations",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "model", "yearFrom", "yearTo"],
    description:
      "Year ranges, filed under a model. These are what a product's fitment rows are attached to under Products → Fitments.",
    group: "Taxonomy",
    listSearchableFields: ["title", "label"],
  },
  access: {
    read: () => true,
  },
  defaultSort: "yearFrom",
  fields: [
    {
      name: "model",
      type: "relationship",
      relationTo: "vehicle-models",
      required: true,
      index: true,
      admin: { description: "The model this generation belongs to." },
    },
    {
      type: "row",
      fields: [
        {
          name: "yearFrom",
          type: "number",
          required: true,
          admin: { width: "33%", step: 1, description: "First model year." },
        },
        {
          name: "yearTo",
          type: "number",
          admin: {
            width: "33%",
            step: 1,
            description: "Last model year. Leave empty if it is still built.",
          },
        },
        {
          name: "label",
          type: "text",
          admin: {
            width: "34%",
            description: 'Chassis code, e.g. "E90". Optional but worth filling.',
          },
        },
      ],
    },
    // See the same field on src/collections/VehicleModels.ts for why this is
    // stored: a product's fitment picker lists generations, and without a
    // composed title every row would read "2005".
    {
      name: "title",
      type: "text",
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            const model = data?.model;
            const modelId =
              model && typeof model === "object" && "id" in model
                ? model.id
                : model;
            const span = `${data?.yearFrom ?? ""}–${data?.yearTo ?? ""}`;
            const chassis = data?.label ? ` (${data.label})` : "";
            if (!modelId) return `${span}${chassis}`;
            // depth 1 so the model's own composed title comes back populated.
            const doc = await req.payload
              .findByID({
                collection: "vehicle-models",
                id: modelId as number,
                depth: 0,
              })
              .catch(() => null);
            const name = typeof doc?.title === "string" ? doc.title : "";
            return [name, `${span}${chassis}`].filter(Boolean).join(" · ");
          },
        ],
      },
    },
  ],
};
