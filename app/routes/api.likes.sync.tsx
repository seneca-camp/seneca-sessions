import { ActionFunctionArgs, data } from "react-router";
import { db } from "~/utils/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const { userId, scheduleId, likedSessionIds } = (await request.json()) as {
      userId?: string;
      likedSessionIds?: string[];
      scheduleId?: string;
    };

    if (
      !userId ||
      !Array.isArray(likedSessionIds) ||
      likedSessionIds.some((it) => typeof it !== "string")
    ) {
      return data({ error: "Invalid payload" }, { status: 400 });
    }

    const existingSessionIds = await db.session.findMany({
      select: { id: true },
      where: { scheduleId },
    });

    await db.likedSession.deleteMany({ where: { userId } });

    const likedSessionIdsOfExistingSessions = likedSessionIds.filter(
      (sessionId) =>
        existingSessionIds.some(
          (existingSessionId) => existingSessionId.id === sessionId,
        ),
    );

    if (likedSessionIds.length > 0) {
      const deduplicatedLikedSessionIds = Array.from(
        new Set(likedSessionIdsOfExistingSessions),
      );
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
