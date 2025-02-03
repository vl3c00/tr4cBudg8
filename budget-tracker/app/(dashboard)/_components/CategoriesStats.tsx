"use client";

import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Props {
    userSettings: UserSettings;
    from: Date;
    to: Date;
}

function CategoriesStats({userSettings, from, to}: Props) {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", "categories", from, to],
  });
  return <div>hbhbhb</div>;
}

export default CategoriesStats;
