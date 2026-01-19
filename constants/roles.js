export const ROLE_CONFIG = {
  president: {
    label: "President",
    badge: "Final Authority",
    theme: "bg-indigo-600",
    actions: ["reports", "finalApproval"],
    alerts: ["approval", "risk"],
  },
  treasurer: {
    label: "Treasurer",
    badge: "Finance Authority",
    actions: ["deposit", "reports"],
    alerts: ["overdue", "lowBalance"],
  },
  creditManager: {
    label: "Credit Manager",
    badge: "Credit Risk",
    actions: ["issueLoan", "reviewLoans"],
    alerts: ["pendingLoans", "defaults"],
  },
};
