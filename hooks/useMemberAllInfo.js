import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";
import { useMemberAccounts } from "./useMemberAccounts";
import { useMemberProfile } from "./useMemberProfile";
import { useMemberTransactions } from "./useMemberTransactions";

export function useMemberAllInfo() {
  const { user } = useAuth();

  const { data: profile } = useMemberProfile(user?.id);
  const { data: accounts } = useMemberAccounts(profile?.auth_user_id);
  const { data: transactions } = useMemberTransactions(profile?.auth_user_id);

  const balances = useMemo(() => {
    const map = {
      Savings: 0,
      Shares: 0,
      Fixed_Deposit: 0,
      Loan: 0,
    };

    accounts?.forEach((acc) => {
      map[acc.account_type] = Number(acc.balance ?? 0);
    });

    return map;
  }, [accounts]);

  return {
    profile,
    balances,
    transactions,
  };
}
