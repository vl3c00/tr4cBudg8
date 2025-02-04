import prisma from "@/lib/prisma";
import { Period, Timeframe } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";

const getHistoryDataSchema = z.object({
    timeframe: z.enum(["month", "year"]),
    month: z.coerce.number().min(0).max(11).default(0),
    year: z.coerce.number().min(2000).max(3000),
});

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const queryParams = getHistoryDataSchema.safeParse({
        timeframe,
        month,
        year,
    });

    if (!queryParams.success) {
        return Response.json({ error: queryParams.error.message }, { status: 400 });
    }

    const data = await getHistoryData(user.id, queryParams.data.timeframe, {
        month: queryParams.data.month,
        year: queryParams.data.year,
    });

    return Response.json(Array.isArray(data) ? data : []); // Ensure response is always an array
}

export type GetHistoryDataResponseType = Awaited<ReturnType<typeof getHistoryData>>;

async function getHistoryData(userId: string, timeframe: Timeframe, period: Period) {
    switch (timeframe) {
        case "year":
            return await getYearHistoryData(userId, period.year);
        case "month":
            return await getMonthHistoryData(userId, period.year, period.month);
        default:
            return []; // Ensure it always returns an array
    }
}

type HistoryData = {
    expense: number;
    income: number;
    year: number;
    month: number;
    day?: number;
};

// Get Yearly History Data
async function getYearHistoryData(userId: string, year: number) {
    const result = await prisma.yearHistory.groupBy({
        by: ["month"],
        where: {
            userId,
            year
        },
        _sum: {
            expense: true,
            income: true,
        },
        orderBy: [
            {
                month: "asc",
            },
        ],
    });

    if (!result || result.length === 0) return [];

    const history: HistoryData[] = [];

    for (let i = 0; i < 12; i++) {
        let expense = 0;
        let income = 0;

        const monthData = result.find((row) => row.month === i);
        if (monthData) {
            expense = monthData._sum.expense || 0;
            income = monthData._sum.income || 0;
        }

        history.push({
            year,
            month: i,
            expense,
            income,
        });
    }
    return history;
}

// Get Monthly History Data
async function getMonthHistoryData(userId: string, year: number, month: number) {
    const result = await prisma.monthHistory.groupBy({
        by: ["day"],
        where: {
            userId,
            year,
            month,
        },
        _sum: {
            expense: true,
            income: true,
        },
        orderBy: [
            {
                day: "asc",
            },
        ],
    });

    if (!result || result.length === 0) return [];

    const history: HistoryData[] = [];
    const daysInMonth = getDaysInMonth(new Date(year, month));

    for (let i = 1; i <= daysInMonth; i++) {  // Fix: Only loop until daysInMonth
        let expense = 0;
        let income = 0;

        const dayData = result.find((row) => row.day === i);
        if (dayData) {
            expense = dayData._sum.expense || 0;
            income = dayData._sum.income || 0;
        }

        history.push({
            expense,
            income,
            year,
            month,
            day: i,  // Fix: Corrected from `1` to `i`
        });
    }

    return history;
}
