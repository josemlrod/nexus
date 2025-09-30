import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    text: v.string(),
    date: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  clipboard: defineTable({
    text: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  files: defineTable({
    fileId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});
