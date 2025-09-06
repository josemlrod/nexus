import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("activities").collect();
  },
});

export const addActivity = mutation({
  args: { date: v.number(), text: v.string() },
  handler: async (ctx, args) => {
    const date = new Date().getTime();

    try {
      await ctx.db.insert("activities", {
        text: args.text,
        date: args.date,
        createdAt: date,
        updatedAt: date,
      });
      return { ok: true };
    } catch (err) {
      console.error(err);
      return { ok: false }
    }
  },
});

export const deleteActivity = mutation({
  args: { id: v.id("activities") },
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
