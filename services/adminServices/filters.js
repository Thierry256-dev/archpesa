import {
  creditTransactionTypes,
  debitTransactionTypes,
} from "../../constants/admin/transactionTypes";

function safeLower(value) {
  if (typeof value !== "string") return "";
  return value.toLowerCase();
}

function safeDate(value) {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function filterMemberTransactions(
  transactions = [],
  { filterType = "all", searchQuery = "", range, isFilterActive = false } = {},
) {
  const safeTransactions = safeArray(transactions);

  const normalizedSearch = safeLower(searchQuery);

  return safeTransactions.filter((tx) => {
    if (!tx || typeof tx !== "object") return false;

    const matchesStatus =
      typeof tx.status === "string" ? tx.status === "Completed" : false;

    let matchesRange = true;

    if (isFilterActive && range?.start && range?.end) {
      const txDate = safeDate(tx.created_at);
      const start = safeDate(range.start);
      const end = safeDate(range.end);

      if (!txDate || !start || !end) {
        matchesRange = false;
      } else {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        matchesRange = txDate >= start && txDate <= end;
      }
    }

    let matchesType = true;

    if (filterType !== "all") {
      const txType =
        typeof tx.transaction_type === "string" ? tx.transaction_type : "";

      if (filterType === "Credit") {
        matchesType = creditTransactionTypes?.includes(txType) ?? false;
      } else if (filterType === "Debit") {
        matchesType = debitTransactionTypes?.includes(txType) ?? false;
      }
    }

    const matchesSearch =
      safeLower(tx.external_reference).includes(normalizedSearch) ||
      safeLower(tx.reference_id).includes(normalizedSearch) ||
      safeLower(tx.id).includes(normalizedSearch) ||
      safeLower(tx.notes).includes(normalizedSearch);

    return matchesStatus && matchesType && matchesSearch && matchesRange;
  });
}

export function filterTransactionsByTotalsType(
  transactions = [],
  totalsFilter = "all",
) {
  const safeTransactions = safeArray(transactions);

  if (totalsFilter === "all") return safeTransactions;

  return safeTransactions.filter((tx) => {
    if (!tx || typeof tx !== "object") return false;

    const type =
      typeof tx.transaction_type === "string" ? tx.transaction_type : "";

    switch (totalsFilter) {
      case "loans":
        return type === "Loan_Repayment" || type === "Loan_Disbursement";

      case "savings":
        return type === "Savings_Deposit" || type === "Savings_Withdraw";

      case "shares":
        return type === "Share_Purchase";

      default:
        return true;
    }
  });
}

export function applyAllTransactionFilters(
  transactions,
  { filterType, totalsFilter, searchQuery, range, isFilterActive } = {},
) {
  try {
    let result = filterTransactionsByTotalsType(transactions, totalsFilter);

    result = filterMemberTransactions(result, {
      filterType,
      searchQuery,
      range,
      isFilterActive,
    });

    return safeArray(result);
  } catch (error) {
    console.error("applyAllTransactionFilters error:", error);

    return [];
  }
}
