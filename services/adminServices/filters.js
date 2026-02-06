import {
  creditTransactionTypes,
  debitTransactionTypes,
} from "../../constants/admin/transactionTypes";

export function filterMemberTransactions(
  transactions = [],
  { filterType = "all", searchQuery = "", range, isFilterActive = false } = {},
) {
  const normalizedSearch = searchQuery.toLowerCase();

  return transactions.filter((tx) => {
    const txDate = new Date(tx.created_at);

    const matchesRange =
      !isFilterActive ||
      (txDate >= new Date(range.start).setHours(0, 0, 0, 0) &&
        txDate <= new Date(range.end).setHours(23, 59, 59, 999));

    const matchesType =
      filterType === "all"
        ? true
        : filterType === "Credit"
          ? creditTransactionTypes.includes(tx.transaction_type)
          : debitTransactionTypes.includes(tx.transaction_type);

    const matchesSearch =
      (tx.external_reference &&
        tx.external_reference.toLowerCase().includes(normalizedSearch)) ||
      (tx.reference_id &&
        tx.reference_id.toLowerCase().includes(normalizedSearch)) ||
      tx.id.toLowerCase().includes(normalizedSearch) ||
      (tx.notes && tx.notes.toLowerCase().includes(normalizedSearch));

    return matchesType && matchesSearch && matchesRange;
  });
}

export function filterTransactionsByTotalsType(
  transactions = [],
  totalsFilter = "all",
) {
  if (totalsFilter === "all") return transactions;

  return transactions.filter((tx) => {
    switch (totalsFilter) {
      case "loans":
        return (
          tx.transaction_type === "Loan_Repayment" ||
          tx.transaction_type === "Loan_Disbursement"
        );

      case "savings":
        return (
          tx.transaction_type === "Savings_Deposit" ||
          tx.transaction_type === "Savings_Withdraw"
        );

      case "shares":
        return tx.transaction_type === "Share_Purchase";

      default:
        return true;
    }
  });
}

export function applyAllTransactionFilters(
  transactions,
  { filterType, totalsFilter, searchQuery, range, isFilterActive },
) {
  let result = filterTransactionsByTotalsType(transactions, totalsFilter);

  result = filterMemberTransactions(result, {
    filterType,
    searchQuery,
    range,
    isFilterActive,
  });

  return result;
}
