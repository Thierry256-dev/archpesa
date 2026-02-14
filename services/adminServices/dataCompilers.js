export function compileMemberProfiles(allProfiles, allAccounts, allLoans) {
  if (!Array.isArray(allProfiles)) return [];

  return allProfiles
    .map((user) => {
      if (!user) return null;

      const accounts = Array.isArray(allAccounts)
        ? allAccounts.filter((acc) => acc?.user_id === user?.auth_user_id)
        : [];

      const loan = Array.isArray(allLoans)
        ? allLoans.find(
            (loan) =>
              loan?.user_id === user?.id &&
              loan?.status === "Disbursed" &&
              loan?.status !== "Completed",
          )
        : null;

      return {
        ...user,
        accounts,
        loan: loan ?? null,
      };
    })
    .filter(Boolean);
}

export function attachUserInfoToTransactions(profiles = [], transactions = []) {
  const safeProfiles = Array.isArray(profiles) ? profiles : [];
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  if (!safeTransactions.length) return [];

  const userMap = new Map();

  safeProfiles.forEach((user) => {
    if (!user?.auth_user_id) return;

    const firstName = user.first_name ?? "";
    const lastName = user.last_name ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    userMap.set(user.auth_user_id, {
      userName: fullName || "Unnamed Member",
      membership_no: user.membership_no ?? "N/A",
    });
  });

  return safeTransactions
    .map((tx) => {
      if (!tx) return null;
      const userInfo = userMap.get(tx.user_id);

      return {
        ...tx,
        userName: userInfo?.userName ?? "Unknown Member",
        membership_no: userInfo?.membership_no ?? "N/A",
      };
    })
    .filter(Boolean);
}

export function attachUserInfoToLoan(profiles = [], loans = []) {
  const safeProfiles = Array.isArray(profiles) ? profiles : [];
  const safeLoans = Array.isArray(loans) ? loans : [];

  if (!safeLoans.length) return [];

  const userMap = new Map();

  safeProfiles.forEach((user) => {
    if (!user?.id) return;

    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

    userMap.set(user.id, {
      userName: fullName || "Unknown",
      membership_no: user.membership_no ?? "N/A",
    });
  });

  return safeLoans
    .map((ln) => {
      if (!ln) return null;
      const userInfo = userMap.get(ln.user_id);

      return {
        ...ln,
        userName: userInfo?.userName ?? "Unknown Member",
        membership_no: userInfo?.membership_no ?? "N/A",
      };
    })
    .filter(Boolean);
}

export function attachUserInfoToTxReq(profiles = [], txReqs = []) {
  if (!profiles.length || !txReqs.length) return txReqs;

  const userMap = new Map();

  profiles.forEach((user) => {
    if (!user.auth_user_id) return;

    userMap.set(user.auth_user_id, {
      userName: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
      membership_no: user.membership_no ?? null,
    });
  });

  return txReqs.map((tx) => {
    const userInfo = userMap.get(tx.user_id);

    return {
      ...tx,
      userName: userInfo?.userName ?? "Unknown Member",
      membership_no: userInfo?.membership_no ?? "N/A",
    };
  });
}
