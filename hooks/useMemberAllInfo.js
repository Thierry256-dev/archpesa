import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";
import { useMemberAccounts } from "./useMemberAccounts";
import { useMemberProfile } from "./useMemberProfile";
import { useMemberTransactions } from "./useMemberTransactions";
import {
  useLoanApplicationGuarantors,
  useLoanGuarantorRequest,
  usePendingLoanApplication,
} from "./usePendingLoanApplications";

export function useMemberAllInfo() {
  const { user } = useAuth();

  const profileQuery = useMemberProfile(user?.id);
  const accountsQuery = useMemberAccounts(profileQuery.data?.auth_user_id);
  const transactionsQuery = useMemberTransactions(
    profileQuery.data?.auth_user_id,
  );
  const pendingLoanQuery = usePendingLoanApplication(
    profileQuery.data?.auth_user_id,
  );
  const guarantorsQuery = useLoanApplicationGuarantors(
    pendingLoanQuery.data?.id,
  );
  const guarantorRequestQuery = useLoanGuarantorRequest(profileQuery.data?.id);

  const resolvedData = useMemo(() => {
    return {
      profile: profileQuery.data ?? null,
      accounts: accountsQuery.data ?? [],
      transactions: transactionsQuery.data ?? [],
      pendingLoanApplication: pendingLoanQuery.data ?? null,
      loanGuarantors: guarantorsQuery.data ?? [],
      guarantorRequests: guarantorRequestQuery.data ?? [],

      isLoading:
        profileQuery.isLoading ||
        accountsQuery.isLoading ||
        transactionsQuery.isLoading ||
        pendingLoanQuery.isLoading ||
        guarantorsQuery.isLoading ||
        guarantorRequestQuery.isLoading,

      isError:
        profileQuery.isError ||
        accountsQuery.isError ||
        transactionsQuery.isError ||
        pendingLoanQuery.isError ||
        guarantorsQuery.isError ||
        guarantorRequestQuery.isError,
    };
  }, [
    profileQuery,
    accountsQuery,
    transactionsQuery,
    pendingLoanQuery,
    guarantorsQuery,
    guarantorRequestQuery,
  ]);

  const balances = useMemo(() => {
    const map = {
      Savings: 0,
      Shares: 0,
      Fixed_Deposit: 0,
      Loan: 0,
    };

    resolvedData.accounts.forEach((acc) => {
      map[acc.account_type] = Number(acc.balance ?? 0);
    });

    return map;
  }, [resolvedData.accounts]);

  return {
    profile: resolvedData.profile,
    balances,
    transactions: resolvedData.transactions,
    pendingLoanApplication: resolvedData.pendingLoanApplication,
    loanGuarantors: resolvedData.loanGuarantors,
    guarantorRequests: resolvedData.guarantorRequests,
    guarantees: resolvedData.guarantees,
    isLoading: resolvedData.isLoading,
    isError: resolvedData.isError,
  };
}
