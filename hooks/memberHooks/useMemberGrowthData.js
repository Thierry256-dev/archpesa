import { useMemo } from "react";

export function useGrowthData(transactions) {
  return useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const sorted = [...transactions].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );

    const monthlyData = {};

    sorted.forEach((tx) => {
      const date = new Date(tx.created_at);

      const monthKey = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          netChange: 0,
          closingBalance: 0,
          timestamp: date.getTime(),
        };
      }

      const amount = Number(tx.amount);
      const change = tx.direction === "Credit" ? amount : -amount;
      monthlyData[monthKey].netChange += change;

      monthlyData[monthKey].closingBalance = Number(tx.balance_after);
    });

    const allMonths = Object.values(monthlyData).sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    return allMonths.slice(-6);
  }, [transactions]);
}
