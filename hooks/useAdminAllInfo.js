import { useMemo } from "react";
import {
  attachUserInfoToLoan,
  attachUserInfoToTxReq,
  compileMemberProfiles,
} from "../services/adminServices/dataCompilers";
import { useAdminLoanForms } from "./adminHooks/useAdminLoanApplyForms";
import { useAdminLoansFetch } from "./adminHooks/useAdminLoansFetch";
import { useAdminMemberAccounts } from "./adminHooks/useAdminMemberAccounts";
import { useAdminMemberLoans } from "./adminHooks/useAdminMemberLoans";
import { useAdminMemberProfiles } from "./adminHooks/useAdminMemberProfiles";
import { useAdminMemberRegisterForms } from "./adminHooks/useAdminMemberRegisterForms";
import { useAdminTransactionRequests } from "./adminHooks/useAdminTransactionRequests";
import { useAdminTransactions } from "./adminHooks/useAdminTransactions";

export default function useAdminAllInfo() {
  const { data: registrationForms } = useAdminMemberRegisterForms();
  const { data: loanForms } = useAdminLoanForms();
  const { data: allProfiles } = useAdminMemberProfiles();
  const { data: allAccounts } = useAdminMemberAccounts();
  const { data: allLoans } = useAdminMemberLoans();
  const { data: transactions } = useAdminTransactions();
  const { data: loansData } = useAdminLoansFetch();
  const { data: transactionRequests } = useAdminTransactionRequests();

  const { members, loans, txRequests } = useMemo(() => {
    if (!allProfiles?.length) return [];

    return {
      members: compileMemberProfiles(allProfiles, allAccounts, allLoans),
      loans: attachUserInfoToLoan(allProfiles, loansData),
      txRequests: attachUserInfoToTxReq(allProfiles, transactionRequests),
    };
  }, [allProfiles, allAccounts, allLoans, loansData, transactionRequests]);

  return {
    registrationForms,
    loanForms,
    members,
    transactions,
    loans,
    txRequests,
  };
}
