export function buildTransactionPayload({
  txType,
  profile,
  accounts,
  loans,
  formData,
  directionMap,
}) {
  const amount = Number(formData.amount.replace(/,/g, ""));
  if (amount <= 0) throw new Error("Invalid amount");

  const direction = directionMap[txType];
  if (!direction) throw new Error("Invalid direction");

  if (txType === "repay") {
    const activeLoan = loans?.find((l) => l.status === "Disbursed");
    if (!activeLoan) throw new Error("No active loan found");

    return {
      user_id: profile.auth_user_id,
      loan_id: activeLoan.id,
      transaction_type: "Loan_Repayment",
      direction: "Credit",
      amount,
      payment_method: formData.paymentMethod,
      notes: formData.notes,
    };
  }

  const matchingAccount = accounts?.find(
    (acc) => acc.account_type === formData.targetAccount,
  );

  if (!matchingAccount) throw new Error("Account not found");

  return {
    user_id: profile.auth_user_id,
    account_id: matchingAccount.id,
    transaction_type: formData.transactionType,
    direction,
    amount,
    payment_method: formData.paymentMethod,
    notes: formData.notes,
  };
}
