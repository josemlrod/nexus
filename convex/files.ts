import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendFile = mutation({
  args: { storageId: v.string(), },
  handler: async (ctx, args) => {
    const date = new Date().getTime();
    await ctx.db.insert("files", {
      fileId: args.storageId,
      createdAt: date,
      updatedAt: date,
    });
  },
});

export const getDownloadUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const files = await ctx.db.query("files").collect();
    return Promise.all(
      files.map(async (file) => {
        const fileMetadata = await ctx.storage.getMetadata(file.fileId);
        return {
          ...file,
          name: fileMetadata?.contentType || "Unknown",
          size: fileMetadata?.size || 0,
          contentType: fileMetadata?.contentType || "application/octet-stream",
        };
      }),
    );
  },
});
