import type { CollectionConfig } from "payload";

// The models sold under a make: Audi -> A4, BMW -> 3 Series.
//
// A collection rather than an array nested inside src/collections/Vehicles.ts,
// because a model is something the rest of the CMS has to be able to point
// AT: a product's fitment rows attach to one specific generation of one
// specific model (see src/collections/Products.ts), and a row buried inside
// another document's array has no id to attach to.
//
// Same value/label contract as the rest of Taxonomy — `value` is the stable
// key that travels in /catalog?model=… and that products are matched on,
// `label` is the only human-facing half.
export const VehicleModels: CollectionConfig = {
  slug: "vehicle-models",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "make", "value", "order"],
    description:
      "Models, filed under a make. Each one holds its generations (Taxonomy → Vehicle generations), which is what the catalog's car picker walks: make → model → years.",
    group: "Taxonomy",
    listSearchableFields: ["title", "label", "value"],
  },
  access: {
    read: () => true,
  },
  defaultSort: "order",
  fields: [
    {
      name: "make",
      type: "relationship",
      relationTo: "vehicles",
      required: true,
      index: true,
      admin: { description: "The marque this model belongs to." },
    },
    {
      name: "label",
      type: "text",
      required: true,
      admin: { description: 'Display name, e.g. "3 Series".' },
    },
    {
      name: "value",
      type: "text",
      required: true,
      index: true,
      admin: {
        description:
          "Stable key, e.g. 3 SERIES. Goes in /catalog?model=… . Set it once and leave it — changing it breaks shared links. It only has to be unique within its own make, so two marques can both have a model keyed 500.",
      },
      hooks: {
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
      admin: { description: "Position within its make, lowest first.", step: 1 },
    },
    // Payload lists a relationship by one field, so without this every model
    // would show as its bare label and the pickers on Vehicle generations and
    // on Products would offer four rows all reading "3 Series". Stored rather
    // than computed on read so the admin list can sort and search on it.
    {
      name: "title",
      type: "text",
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            const label = typeof data?.label === "string" ? data.label : "";
            const make = data?.make;
            const makeId =
              make && typeof make === "object" && "id" in make ? make.id : make;
            if (!makeId) return label;
            const doc = await req.payload
              .findByID({ collection: "vehicles", id: makeId as number, depth: 0 })
              .catch(() => null);
            const makeLabel = typeof doc?.label === "string" ? doc.label : "";
            return [makeLabel, label].filter(Boolean).join(" ");
          },
        ],
      },
    },
  ],
};
