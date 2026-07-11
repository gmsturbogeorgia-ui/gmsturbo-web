import type { CollectionConfig } from "payload";

// Admin-panel login accounts. Auth is handled entirely by Payload — this
// collection has no extra fields, just email + password (added by `auth: true`).
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [],
};
