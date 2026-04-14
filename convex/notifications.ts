import { query } from "./_generated/server";
import { requireCurrentUser } from "./auth";

export const listMine = query({
  args: {},
  handler: async (ctx: any) => {
    const user = await requireCurrentUser(ctx);

    return ctx.db
      .query("notifications")
      .withIndex("by_userId", (query: any) => query.eq("userId", user._id))
      .collect();
  }
});
