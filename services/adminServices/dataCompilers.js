export function compileMemberProfiles(allProfiles, allAccounts, allLoans) {
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
}

export function attachUserInfoToTransactions(profiles = [], transactions = []) {
  if (!profiles.length || !transactions.length) return transactions;

  const userMap = new Map();

  profiles.forEach((user) => {
    if (!user.auth_user_id) return;

    userMap.set(user.auth_user_id, {
      userName: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
      membership_no: user.membership_no ?? null,
    });
  });

  return transactions.map((tx) => {
    const userInfo = userMap.get(tx.user_id);

    return {
      ...tx,
      userName: userInfo?.userName ?? "Unknown Member",
      membership_no: userInfo?.membership_no ?? "N/A",
    };
  });
}

export function attachUserInfoToLoan(profiles = [], loans = []) {
  if (!profiles.length || !loans.length) return loans;

  const userMap = new Map();

  profiles.forEach((user) => {
    if (!user.id) return;

    userMap.set(user.id, {
      userName: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
      membership_no: user.membership_no ?? null,
    });
  });

  return loans.map((ln) => {
    const userInfo = userMap.get(ln.user_id);

    return {
      ...ln,
      userName: userInfo?.userName ?? "Unknown Member",
      membership_no: userInfo?.membership_no ?? "N/A",
    };
  });
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
