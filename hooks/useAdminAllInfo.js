import { useAdminLoanForms } from "./useAdminLoanApplyForms";
import { useAdminMemberRegisterForms } from "./useAdminMemberRegisterForms";

export default function useAdminAllInfo() {
  const { data: registrationForms } = useAdminMemberRegisterForms();
  const { data: loanForms } = useAdminLoanForms();

  return {
    registrationForms,
    loanForms,
  };
}
