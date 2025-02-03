import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const queryParams = OverviewQuerySchema.safeParse({ from, to });

    if (!queryParams.success) {
        return Response.json(queryParams.error.message, {
            status: 400,
        });
    }

    const stats = await getBalanceStats(
        user.id,
        new Date(queryParams.data.from),
        new Date(queryParams.data.to)
    );

    return Response.json(stats);
}

export type GetBalanceStatsResponseType = Awaited<ReturnType<typeof getBalanceStats>>;

async function getBalanceStats(userId: string, from: Date, to: Date) {
    const totals = await prisma.transaction.groupBy({
        by: ["type"],
        where: {
            userId,
            date: {
                gte: from,
                lte: to,
            },
        },
        _sum: {
            amount: true,
        },
    });

    // Define an explicit type for the `totals` array
    type TransactionGroup = {
        type: "income" | "expense";
        _sum: {
            amount: number | null;
        };
    };

    return {
        expense: (totals.find((t: TransactionGroup) => t.type === "expense")?._sum.amount) || 0,
        income: (totals.find((t: TransactionGroup) => t.type === "income")?._sum.amount) || 0,
    };
}
