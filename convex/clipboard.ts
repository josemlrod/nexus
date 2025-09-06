import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("clipboard").first();
  },
});

export const updateClipboard = mutation({
  args: { id: v.optional(v.id("clipboard")), text: v.string() },
  handler: async (ctx, args) => {
    const date = new Date().getTime();

    try {
      if (args.id) {
        await ctx.db.patch(args.id, {
          text: args.text,
          updatedAt: date,
        });
      }

      await ctx.db.insert("clipboard", {
        text: args.text,
        updatedAt: date,
      });

      return { ok: true };
    } catch (err) {
      console.error(err);
      return { ok: false }
    }
  },
});

export const clearClipboard = mutation({
  args: { id: v.id("clipboard") },
  handler: async (ctx, args) => {
    try {
      await ctx.db.delete(args.id);
      return { ok: true }
    } catch (err) {
      console.error(err);
      return { ok: false };
    }
  },
})
