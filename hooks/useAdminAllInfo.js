import { useMemo } from "react";
import {
  attachUserInfoToLoan,
  compileMemberProfiles,
} from "../services/adminServices/dataCompilers";
import { useAdminLoanForms } from "./adminHooks/useAdminLoanApplyForms";
import { useAdminLoansFetch } from "./adminHooks/useAdminLoansFetch";
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
  const { data: loansData } = useAdminLoansFetch();

  const { members, loans } = useMemo(() => {
    if (!allProfiles?.length) return [];

    return {
      members: compileMemberProfiles(allProfiles, allAccounts, allLoans),
      loans: attachUserInfoToLoan(allProfiles, loansData),
    };
  }, [allProfiles, allAccounts, allLoans, loansData]);

  return {
    registrationForms,
    loanForms,
    members,
    transactions,
    loans,
  };
}
