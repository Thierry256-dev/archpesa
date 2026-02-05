import { useMemo } from "react";
import { compileMemberProfiles } from "../services/adminServices/dataCompilers";
import { useAdminLoanForms } from "./adminHooks/useAdminLoanApplyForms";
import { useAdminMemberAccounts } from "./adminHooks/useAdminMemberAccounts";
import { useAdminMemberLoans } from "./adminHooks/useAdminMemberLoans";
import { useAdminMemberProfiles } from "./adminHooks/useAdminMemberProfiles";
import { useAdminMemberRegisterForms } from "./adminHooks/useAdminMemberRegisterForms";
import { useAdminTransactions } from "./adminHooks/useAdminTransactions";

export default function useAdminAllInfo() {
  const { data: registrationForms } = useAdminMemberRegisterForms();
  const { data: loanForms } = useAdminLoanForms();
  const { data: allProfiles } = useAdminMemberProfiles();
  const { data: allAccounts } = useAdminMemberAccounts();
  const { data: allLoans } = useAdminMemberLoans();
  const { data: transactions } = useAdminTransactions();

  const members = useMemo(() => {
    if (!allProfiles?.length) return [];

    return compileMemberProfiles(allProfiles, allAccounts, allLoans);
  }, [allProfiles, allAccounts, allLoans]);

  return {
    registrationForms,
    loanForms,
    members,
    transactions,
  };
}
