export function computeSaccoTotals(members = []) {
  let totalSaccoValue = 0;
  let totalSavings = 0;
  let totalOutstandingLoans = 0;
  let totalPayableLoans = 0;
  let totalActiveLoan = 0;
  let totalPrincipal = 0;

  members.forEach((member) => {
    member.accounts?.forEach((acc) => {
      const balance = Number(acc.balance ?? 0);
      totalSaccoValue += balance;

      if (acc.account_type === "Savings") {
        totalSavings += balance;
      }
    });

    if (member.loan) {
      totalActiveLoan++;
      totalSaccoValue += Number(member.loan.total_payable ?? 0);
      totalPayableLoans += Number(member.loan.total_payable ?? 0);
      totalOutstandingLoans += Number(member.loan.outstanding_balance ?? 0);
      totalPrincipal += Number(member.loan.principal_amount ?? 0);
    }
  });

  return {
    totalSaccoValue,
    totalSavings,
    cashAtHand: totalSaccoValue - totalOutstandingLoans,
    totalOutstandingLoans,
    totalPayableLoans,
    totalRepaidLoan: totalPayableLoans - totalOutstandingLoans,
    totalActiveLoan,
    totalPrincipal,
  };
}

export function computeTransactionSummary(transactions = []) {
  if (!transactions.length) {
    return {
      openingBalance: 0,
      closingBalance: 0,
      totalDeposits: 0,
      totalWithdraws: 0,
      netAmount: 0,
      depositPercent: 0,
      withdrawPercent: 0,
    };
  }

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );

  const openingBalance = Number(sorted[0].balance_before ?? 0);
  const closingBalance = Number(sorted[sorted.length - 1].balance_after ?? 0);

  let totalDeposits = 0;
  let totalWithdraws = 0;

  sorted.forEach((tx) => {
    const amount = Number(tx.amount ?? 0);

    if (tx.status === "Completed") {
      if (
        [
          "Loan_Repayment",
          "Savings_Deposit",
          "Share_Purchase",
          "Fee",
          "Penalty",
        ].includes(tx.transaction_type)
      ) {
        totalDeposits += amount;
      }

      if (
        ["Savings_Withdraw", "Loan_Disbursement"].includes(tx.transaction_type)
      ) {
        totalWithdraws += amount;
      }
    }
  });

  const netAmount = totalDeposits - totalWithdraws;
  const totalFlow = totalDeposits + totalWithdraws;

  const depositPercent = totalFlow > 0 ? (totalDeposits / totalFlow) * 100 : 0;

  const withdrawPercent =
    totalFlow > 0 ? (totalWithdraws / totalFlow) * 100 : 0;

  return {
    openingBalance,
    closingBalance,
    totalDeposits,
    totalWithdraws,
    netAmount,
    depositPercent,
    withdrawPercent,
  };
}
