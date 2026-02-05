import { useMemo } from "react";
import { useAdminLoanForms } from "./adminHooks/useAdminLoanApplyForms";
import { useAdminMemberAccounts } from "./adminHooks/useAdminMemberAccounts";
import { useAdminMemberLoans } from "./adminHooks/useAdminMemberLoans";
import { useAdminMemberProfiles } from "./adminHooks/useAdminMemberProfiles";
import { useAdminMemberRegisterForms } from "./adminHooks/useAdminMemberRegisterForms";

export default function useAdminAllInfo() {
  const { data: registrationForms } = useAdminMemberRegisterForms();
  const { data: loanForms } = useAdminLoanForms();
  const { data: allProfiles } = useAdminMemberProfiles();
  const { data: allAccounts } = useAdminMemberAccounts();
  const { data: allLoans } = useAdminMemberLoans();

  const members = useMemo(() => {
    if (!allProfiles?.length) return [];

    return allProfiles.map((user) => {
      const accounts =
        allAccounts?.filter((acc) => acc.user_id === user.auth_user_id) ?? [];

      const loan =
        allLoans?.find(
          (loan) =>
            loan.user_id === user.id &&
            loan.status === "Approved" &&
            loan.status !== "Completed",
        ) ?? null;

      return {
        ...user,
        accounts,
        loan,
      };
    });
  }, [allProfiles, allAccounts, allLoans]);

  return {
    registrationForms,
    loanForms,
    members,
  };
}
