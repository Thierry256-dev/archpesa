import { useMemo } from "react";
import { attachUserInfoToTransactions } from "../../services/adminServices/dataCompilers";
import { applyAllTransactionFilters } from "../../services/adminServices/filters";
import { computeTransactionSummary } from "../../services/adminServices/financeCalculations";

export function useFilteredTransactions({
  transactions,
  members,
  filterType,
  totalsFilter,
  searchQuery,
  range,
  selectedPeriod,
}) {
  return useMemo(() => {
    const filtered = applyAllTransactionFilters(transactions, {
      filterType,
      totalsFilter,
      searchQuery,
      range,
      isFilterActive: !!selectedPeriod,
    });

    return {
      ledgerTotals: computeTransactionSummary(filtered),
      enrichedTransactions: attachUserInfoToTransactions(members, filtered),
    };
  }, [
    filterType,
    totalsFilter,
    searchQuery,
    range,
    selectedPeriod,
    members,
    transactions,
  ]);
}
