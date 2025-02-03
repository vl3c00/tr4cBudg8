"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/routes";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import React, { ReactNode, useMemo } from 'react'

interface Props {
    from: Date;
    to: Date;
    userSettings: UserSettings;
}

function StatsCards({ from, to, userSettings}: Props) {

    const statsQuery = useQuery<GetBalanceStatsResponseType>({
        queryKey: ["overview", "status", from, to],
        queryFn: () => fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
    ).then((res) => res.json()),
    });

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency]);

    const income = statsQuery.data?.income || 0;
    const expense = statsQuery.data?.expense || 0;

    const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsCard
        formatter={formatter}
        value={income}
        title="Income"
        icon={
          <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emarald-400/10" />
        }
        />
      </SkeletonWrapper>
    </div>

  );
}

export default StatsCards;


function StatCard({formatter, value, title, icon}: {
  formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: String;
  value: number;
}) {}