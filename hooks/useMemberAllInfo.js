import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";
import {
  useLoanApplication,
  useLoanApplicationGuarantors,
  useLoanGuarantorRequest,
} from "./useLoanApplications";
import { useMemberAccounts } from "./useMemberAccounts";
import { useMemberLoanFetch } from "./useMemberLoanFetch";
import { useMemberProfile } from "./useMemberProfile";
import { useMemberTransactions } from "./useMemberTransactions";

export function useMemberAllInfo() {
  const { user } = useAuth();

  const profileQuery = useMemberProfile(user?.id);
  const accountsQuery = useMemberAccounts(profileQuery.data?.auth_user_id);
  const transactionsQuery = useMemberTransactions(
    profileQuery.data?.auth_user_id,
  );
  const loanApplicationQuery = useLoanApplication(
    profileQuery.data?.auth_user_id,
  );
  const guarantorsQuery = useLoanApplicationGuarantors(
    loanApplicationQuery.data?.id,
  );
  const guarantorRequestQuery = useLoanGuarantorRequest(profileQuery.data?.id);
  const memberLoanQuery = useMemberLoanFetch(profileQuery.data?.id);

  const resolvedData = useMemo(() => {
    return {
      profile: profileQuery.data ?? null,
      accounts: accountsQuery.data ?? [],
      transactions: transactionsQuery.data ?? [],
      pendingLoanApplication: loanApplicationQuery.data ?? null,
      loanGuarantors: guarantorsQuery.data ?? [],
      guarantorRequests: guarantorRequestQuery.data ?? [],
      memberLoan: memberLoanQuery.data ?? [],
      isLoading:
        profileQuery.isLoading ||
        accountsQuery.isLoading ||
        transactionsQuery.isLoading ||
        loanApplicationQuery.isLoading ||
        guarantorsQuery.isLoading ||
        guarantorRequestQuery.isLoading ||
        memberLoanQuery.isLoading,

      isError:
        profileQuery.isError ||
        accountsQuery.isError ||
        transactionsQuery.isError ||
        loanApplicationQuery.isError ||
        guarantorsQuery.isError ||
        guarantorRequestQuery.isError ||
        memberLoanQuery.isError,
    };
  }, [
    profileQuery,
    accountsQuery,
    transactionsQuery,
    loanApplicationQuery,
    guarantorsQuery,
    guarantorRequestQuery,
    memberLoanQuery,
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
    loanApplications: resolvedData.pendingLoanApplication,
    loanGuarantors: resolvedData.loanGuarantors,
    guarantorRequests: resolvedData.guarantorRequests,
    loans: resolvedData.memberLoan,
    isLoading: resolvedData.isLoading,
    isError: resolvedData.isError,
  };
}
