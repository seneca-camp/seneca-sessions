import { ActionFunctionArgs, data } from "react-router";
import { db } from "~/utils/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const { userId, likedSessionIds } = (await request.json()) as {
      userId?: string;
      likedSessionIds?: string[];
    };

    if (
      !userId ||
      !Array.isArray(likedSessionIds) ||
      likedSessionIds.some((it) => typeof it !== "string")
    ) {
      return data({ error: "Invalid payload" }, { status: 400 });
    }

    await db.likedSession.deleteMany({ where: { userId } });
    if (likedSessionIds.length > 0) {
      const deduplicatedLikedSessionIds = Array.from(new Set(likedSessionIds));
      await db.likedSession.createMany({
        data: deduplicatedLikedSessionIds.map((sessionId) => ({
          userId,
          sessionId,
        })),
      });
    }

    return { ok: true };
  } catch {
    return data({ error: "Server error" }, { status: 500 });
  }
};

export const loader = async () => new Response("", { status: 405 });
