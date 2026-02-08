export const TRANSACTION_TYPES = [
  {
    id: "deposit",
    title: "Deposit Money",
    desc: "Add funds to your accounts",
    icon: "wallet-outline",
  },
  {
    id: "withdraw",
    title: "Withdraw Money",
    desc: "Cash out from savings",
    icon: "cash-outline",
  },
  {
    id: "repay",
    title: "Repay Loan",
    desc: "Clear your outstanding loans",
    icon: "document-text-outline",
  },
];

export const directionMap = {
  deposit: "Credit",
  repay: "Credit",
  withdraw: "Debit",
};

export const PAYMENT_METHODS = [
  { id: "MTN_Momo", label: "MTN MoMo" },
  { id: "Airtel_Money", label: "Airtel Money" },
  { id: "Bank_Transfer", label: "Bank Transfer" },
  { id: "Cash", label: "Cash at Office" },
  { id: "Internal", label: "Internal" },
];

export const ACCOUNTS = [
  { id: "Savings", label: "Savings Account" },
  { id: "Shares", label: "Shares Account" },
  { id: "Fixed_Deposit", label: "Fixed Deposit Account" },
];
