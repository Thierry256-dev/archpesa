import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import * as XLSX from "xlsx";
import {
  creditTransactionTypes,
  debitTransactionTypes,
} from "../../constants/admin/transactionTypes";
import { formatDateFull } from "../formatDateFull";
import { saveExcelToDownloads, savePdfToDownloads } from "../saveToStorage";

/**
 * Professional SACCO PDF Engine
 * @param {string} title - The Report Name (e.g. "Member Savings Ledger")
 * @param {object} meta - Member/Account details
 * @param {Array} data - The API transactions array
 * @param {object} totals - Calculated figures (Deposits, Withdrawals, etc)
 */

export const generateAllMembersReportPdf = async (members = []) => {
  /* 1. Aggregates */
  const totals = members.reduce(
    (acc, member) => {
      member.accounts?.forEach((accnt) => {
        if (accnt.account_type === "Savings") {
          acc.totalSavings += Number(accnt.balance ?? 0);
        }

        if (accnt.account_type === "Shares") {
          acc.totalShares += Number(accnt.balance / 10000 ?? 0);
        }
      });

      if (member.loan) {
        acc.totalLoans += Number(member.loan.outstanding_balance ?? 0);

        if (
          ["Substandard", "Doubtful", "Loss"].includes(
            member.loan.risk_category,
          )
        ) {
          acc.overdueCount += 1;
        }
      }

      return acc;
    },
    {
      totalSavings: 0,
      totalShares: 0,
      totalLoans: 0,
      overdueCount: 0,
    },
  );

  /* 2. Table Rows */
  const tableRows = members
    .map(
      (m, index) => `
      <tr style="background:${index % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td>${m.membership_no}</td>
        <td>${m.first_name} ${m.last_name}</td>
        <td>${m.phone_number}</td>
        <td>${m.member_status.toUpperCase()}</td>
        <td style="text-align:right;">${Number(m.accounts[0].balance).toLocaleString()}</td>
        <td style="text-align:right;">${Number(m.accounts[1].balance / 10000).toLocaleString()}</td>
         <td style="text-align:right;">${Number(m.accounts[2].balance).toLocaleString()}</td>
        
      </tr>
    `,
    )
    .join("");

  /* 3. HTML Template */
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        @page { margin: 40px; }
        body { font-family: Helvetica, Arial, sans-serif; color: #1e293b; }

        .header {
          text-align: center;
          border-bottom: 3px solid #07193f;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }

        .title { font-size: 24px; font-weight: 900; color: #07193f; }
        .subtitle { font-size: 12px; color: #64748b; }

        .summary {
          display: flex;
          justify-content: space-between;
          background: #f1f5f9;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
        }

        .summary-item { font-size: 11px; }
        .label { color: #64748b; font-weight: bold; }
        .value { font-size: 14px; font-weight: bold; }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }

        th {
          background: #07193f;
          color: white;
          padding: 8px;
          text-align: left;
        }

        td {
          padding: 8px;
          border-bottom: 0.5px solid #e2e8f0;
        }

        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 8px;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">UMOJA SACCO SOCIETY</div>
        <div class="subtitle">Members Register & Financial Position</div>
      </div>

      <div class="summary">
        <div class="summary-item">
          <div class="label">Total Members</div>
          <div class="value">${members.length}</div>
        </div>
        <div class="summary-item">
          <div class="label">Overdue Loans</div>
          <div class="value">${totals.overdueCount}</div>
        </div>
        <div class="summary-item">
          <div class="label">Total Savings</div>
          <div class="value">UGX ${totals.totalSavings.toLocaleString()}</div>
        </div>
        <div class="summary-item">
          <div class="label">Outstanding Loans</div>
          <div class="value">UGX ${totals.totalLoans.toLocaleString()}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Member Name</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Savings</th>
            <th>Shares</th>
            <th>Fixed Deposit</th>            
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div class="footer">
        Generated on ${new Date().toLocaleString()} · System Generated Document
      </div>
    </body>
  </html>
  `;

  /* 4. Generate + Download */
  try {
    const { uri } = await Print.printToFileAsync({ html });

    if (Platform.OS === "android") {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await savePdfToDownloads(
        `SACCO_MEMBERS_REPORT_${Date.now()}.pdf`,
        base64,
      );

      Alert.alert("Download Complete", "Members report saved to storage.");
    } else {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        UTI: "com.adobe.pdf",
      });
    }
  } catch (error) {
    console.error("Members PDF Error:", error);
    Alert.alert("Error", "Failed to generate members report.");
  }
};

export const generateSaccoLedger = async (transactions) => {
  const totalInflow = transactions
    .filter((t) => creditTransactionTypes.includes(t.transaction_type))
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalOutflow = transactions
    .filter((t) => debitTransactionTypes.includes(t.transaction_type))
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const netPosition = totalInflow - totalOutflow;

  // 2. Map Transactions to Professional Table Rows
  const tableRows = transactions
    .map(
      (item, index) => `
    <tr style="background-color: ${index % 2 === 0 ? "#ffffff" : "#fbfcfd"};">
      <td style="padding: 8px; border-bottom: 0.5px solid #e2e8f0; font-size: 9px;">
        ${new Date(item.created_at).toLocaleDateString("en-GB")}
      </td>     
       <td style="padding: 8px; border-bottom: 0.5px solid #e2e8f0; font-size: 8px; color: #64748b;">
        ${item.membership_no}
      </td>
       <td style="padding: 8px; border-bottom: 0.5px solid #e2e8f0; font-size: 8px; color: #64748b;">
        ${item.userName}
      </td>
      <td style="padding: 8px; border-bottom: 0.5px solid #e2e8f0; font-size: 9px; font-weight: 600;">
        ${item.transaction_type.replace("_", " ")}
      </td>
       <td style="padding: 8px; border-bottom: 0.5px solid #e2e8f0; font-size: 8px; font-family: monospace; color: #64748b;">
        ${item.external_reference || item.reference_id}
      </td>
      <td style="padding: 8px; border-bottom: 0.5px solid #e2e8f0; font-size: 9px; text-align: right; color: #64748b;">
        ${Number(item.balance_before).toLocaleString()}
      </td>
      <td style="padding: 8px; border-bottom: 0.5px solid #e2e8f0; font-size: 9px; text-align: right; font-weight: bold; color: ${creditTransactionTypes.includes(item.transaction_type) ? "#10b981" : "#ef4444"};">
        ${item.direction === "Credit" ? "+" : "-"}${Number(item.amount).toLocaleString()}
      </td>
      <td style="padding: 8px; border-bottom: 0.5px solid #e2e8f0; font-size: 9px; text-align: right; font-weight: bold; background-color: #f8fafc;">
        ${Number(item.balance_after).toLocaleString()}
      </td>
    </tr>
  `,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @page { margin: 30px; }
          body { font-family: 'Trebuchet MS', sans-serif; color: #0f172a; margin: 0; padding: 0; }
          
          /* UMRA STYLE HEADER */
          .header-container { display: flex; flex-direction: column; align-items: center; padding-bottom: 20px; border-bottom: 2px double #1e293b; margin-bottom: 20px; }
          .sacco-logo-text { font-size: 26px; font-weight: 800; color: #07193f; text-transform: uppercase; margin: 0; }
          .sacco-tagline { font-size: 10px; color: #64748b; font-style: italic; margin-bottom: 5px; }
          .reg-info { font-size: 9px; font-weight: bold; color: #1e293b; background: #f1f5f9; padding: 2px 10px; border-radius: 4px; }
          
          .report-meta { display: flex; justify-content: space-between; margin-top: 15px; width: 100%; }
          .meta-box { font-size: 10px; line-height: 1.4; }

          /* FINANCIAL SUMMARY TILES */
          .dashboard { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; }
          .tile { padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .tile-label { font-size: 8px; text-transform: uppercase; font-weight: bold; color: #64748b; margin-bottom: 4px; }
          .tile-value { font-size: 14px; font-weight: 800; color: #1e293b; }

          table { width: 100%; border-collapse: collapse; }
          th { background-color: #07193f; color: white; text-align: left; padding: 10px 8px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
          
          .footer-sig { margin-top: 50px; display: flex; justify-content: space-between; }
          .sig-line { width: 200px; border-top: 1px solid #1e293b; padding-top: 5px; text-align: center; }
          .sig-text { font-size: 10px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header-container">
          <h1 class="sacco-logo-text">UMOJA SACCO SOCIETY LIMITED</h1>
          <p class="sacco-tagline">"Empowering Members through Sustainable Financial Inclusion"</p>
          <span class="reg-info">Licensed & Regulated by UMRA</span>
          
          <div class="report-meta">
            <div class="meta-box">
              <strong>DOCUMENT:</strong> GENERAL TREASURY LEDGER<br>
              <strong>PERIOD:</strong> Full History
            </div>
            <div class="meta-box" style="text-align: right;">
              <strong>DATE GENERATED:</strong> ${new Date().toLocaleString()}<br>
              <strong>STATUS:</strong> OFFICIAL AUDIT COPY
            </div>
          </div>
        </div>

        <div class="dashboard">
          <div class="tile" style="border-left: 4px solid #10b981;">
            <div class="tile-label">Total Deposits/Credits</div>
            <div class="tile-value">UGX ${totalInflow.toLocaleString()}</div>
          </div>
          <div class="tile" style="border-left: 4px solid #ef4444;">
            <div class="tile-label">Total Withdraws/Debits</div>
            <div class="tile-value">UGX ${totalOutflow.toLocaleString()}</div>
          </div>
          <div class="tile" style="background-color: #07193f;">
            <div class="tile-label" style="color: #cbd5e1;">Net Treasury Balance</div>
            <div class="tile-value" style="color: white;">UGX ${netPosition.toLocaleString()}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>              
              <th>Member-ID</th>
              <th>Name</th>
              <th>Type</th>
             <th>Ref ID/External Ref</th>
              <th style="text-align: right;">Before</th>
              <th style="text-align: right;">Amount</th>
              <th style="text-align: right;">After</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer-sig">
          <div class="sig-line">
            <span class="sig-text">TREASURER</span><br>
            <span style="font-size: 8px; color: #94a3b8;">Stamp & Signature</span>
          </div>
          <div class="sig-line">
            <span class="sig-text">INTERNAL AUDITOR</span><br>
            <span style="font-size: 8px; color: #94a3b8;">Stamp & Signature</span>
          </div>
          <div class="sig-line">
            <span class="sig-text">CHAIRPERSON</span><br>
            <span style="font-size: 8px; color: #94a3b8;">Stamp & Signature</span>
          </div>
        </div>

        <div style="margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 10px; font-size: 7px; color: #94a3b8; text-align: center;">
          Disclaimer: This is an official computer-generated statement of the Sacco ledger. Any alterations render this document void. 
          Verified by SmartSpend AI Ledger System.
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    const pdfBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    if (Platform.OS === "android") {
      await savePdfToDownloads(`SACCO_LEDGER_${Date.now()}.pdf`, pdfBase64);
      Alert.alert(
        "Ledger Exported",
        "The official SACCO ledger has been saved to your downloads folder.",
      );
    } else {
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    }
  } catch (error) {
    console.error("PDF Generation Error:", error);
  }
};

export const generateSaccoExcel = async (transactions = []) => {
  try {
    const totalInflow = transactions
      .filter((t) => t.direction === "Credit")
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const totalOutflow = transactions
      .filter((t) => t.direction === "Debit")
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const worksheetData = [
      ["OFFICIAL SACCO TREASURY LEDGER"],
      ["ORGANIZATION", "UMOJA SACCO SOCIETY LIMITED"],
      ["REGULATION", "Licensed by UMRA"],
      ["GENERATED AT", new Date().toLocaleString()],
      ["SUMMARY"],
      ["Total Credits (Inflow)", totalInflow],
      ["Total Debits (Outflow)", totalOutflow],
      ["Net Treasury Position", totalInflow - totalOutflow],
      [], // Spacer row
      [
        "Date",
        "Transaction ID",
        "Member",
        "Member-ID",
        "Type",
        "Description (Notes)",
        "Opening Bal (UGX)",
        "Amount (UGX)",
        "Closing Bal (UGX)",
        "Method",
        "Status",
      ],
    ];

    /* 3. Map Data using specific DB keys */
    transactions.forEach((item) => {
      worksheetData.push([
        item.created_at
          ? new Date(item.created_at).toLocaleDateString("en-GB")
          : "N/A",
        item.id ?? "N/A",
        item.userName,
        item.membership_no,
        (item.transaction_type ?? "").replace("_", " "),
        item.notes ?? "",
        Number(item.balance_before ?? 0),
        Number(item.amount ?? 0),
        Number(item.balance_after ?? 0),
        item.payment_method ?? "",
        item.status ?? "",
      ]);
    });

    /* 4. Create Workbook */
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const wscols = [
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
    ];
    worksheet["!cols"] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Treasury Ledger");

    /* 5. Convert to Base64 */
    const base64 = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    /* 6. Save and Share File */
    const fileName = `SACCO_AUDIT_LEDGER_${Date.now()}.xlsx`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (Platform.OS === "android") {
      // Assuming saveExcelToDownloads is defined in your utils
      await saveExcelToDownloads(fileName, base64);
    } else if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Export SACCO Ledger",
        UTI: "com.microsoft.excel.xlsx",
      });
    }
  } catch (error) {
    console.error("Excel Export Error:", error);
    Alert.alert(
      "Export Failed",
      "Unable to generate the Excel report. Please ensure you have granted storage permissions.",
    );
  }
};

export const generateMemberStatementPdf = async ({
  member,
  transactions = [],
  period,
}) => {
  const sortedTx = [...transactions].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );

  // 2. Calculate Statement Totals
  const openingBalance = sortedTx.length > 0 ? sortedTx[0].balance_before : 0;
  const closingBalance =
    sortedTx.length > 0 ? sortedTx[sortedTx.length - 1].balance_after : 0;

  const totals = sortedTx.reduce(
    (acc, tx) => {
      if (tx.direction === "Credit") {
        acc.moneyIn += Number(tx.amount);
      } else {
        acc.moneyOut += Number(tx.amount);
      }
      return acc;
    },
    { moneyIn: 0, moneyOut: 0 },
  );

  // 3. Generate Table Rows
  const tableRows = sortedTx
    .map((tx, index) => {
      const isCredit = tx.direction === "Credit";
      const amountColor = isCredit ? "#059669" : "#dc2626"; // Emerald vs Red
      const sign = isCredit ? "+" : "-";

      return `
      <tr class="${index % 2 === 0 ? "row-even" : "row-odd"}">
        <td class="col-date">${formatDateFull(tx.created_at)}</td>
        <td class="col-desc">
          <div class="tx-type">${tx.transaction_type.replace(/_/g, " ")}</div>
          <div class="tx-notes">${tx.notes || "-"}</div>
          <div class="tx-ref">${tx.external_reference || tx.reference_id || "Ref: " + tx.id.substring(0, 8)}</div>
        </td>
        <td class="col-method">
          ${tx.payment_method}
        </td>
        <td class="col-status">
          ${tx.status}
        </td>
        <td class="col-amount" style="color: ${amountColor};">
          ${sign}${Number(tx.amount).toLocaleString()}
        </td>
        <td class="col-balance">
          ${Number(tx.balance_after).toLocaleString()}
        </td>
      </tr>
    `;
    })
    .join("");

  // 4. The Professional HTML Template
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        @page { margin: 40px; size: A4; }
        * { box-sizing: border-box; }
        
        body { 
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
          color: #1e293b; 
          line-height: 1.4;
          font-size: 10px;
        }

        /* --- HEADER SECTION --- */
        .header-container {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .brand-section h1 {
          font-size: 26px;
          color: #0f172a;
          margin: 0 0 5px 0;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }
        
        .brand-section p { margin: 0; color: #64748b; font-size: 9px; }

        .statement-label {
          text-align: right;
        }
        .statement-label h2 {
          font-size: 18px;
          color: #64748b;
          margin: 0 0 5px 0;
          text-transform: uppercase;
          font-weight: 400;
        }
        .statement-label .period { font-weight: bold; color: #0f172a; font-size: 11px; }

        /* --- INFO GRID --- */
        .info-grid {
          display: flex;
          margin-bottom: 30px;
          gap: 40px;
        }
        
        .info-box { flex: 1; }
        .info-title { 
          font-size: 8px; 
          text-transform: uppercase; 
          color: #94a3b8; 
          font-weight: bold; 
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }
        .info-value { font-size: 11px; font-weight: 600; color: #0f172a; }
        .info-address { font-size: 10px; color: #334155; margin-top: 2px; }

        /* --- FINANCIAL SUMMARY CARDS --- */
        .summary-strip {
          display: flex;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 30px;
          justify-content: space-between;
        }
        
        .sum-item { text-align: left; }
        .sum-label { font-size: 8px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; font-weight: bold; }
        .sum-value { font-size: 14px; font-weight: bold; color: #0f172a; }
        .sum-value.green { color: #059669; }
        .sum-value.red { color: #dc2626; }

        /* --- TABLE --- */
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        
        th {
          text-align: left;
          font-size: 9px;
          text-transform: uppercase;
          background-color: #1e293b; 
          color: #ffffff; 
          border-bottom: 2px solid #e2e8f0;
          padding: 10px 8px;
          font-weight: 700;
        }
        
        td { padding: 12px 8px; vertical-align: top; }
        .row-even { background-color: #ffffff; }
        .row-odd { background-color: #f8fafc; }

        /* Column Specifics */
        .col-date { width: 15%; color: #475569; font-weight: 500; }
        .col-desc { width: 35%; }
        .col-method { width: 20%; }
        .col-status { width: 10%; }
        .col-amount { width: 10%; text-align: right; font-weight: 700; }
        .col-balance { width: 10%; text-align: right; font-weight: 700; color: #0f172a; }

        .tx-type { font-weight: 700; color: #334155; font-size: 10px; margin-bottom: 2px; }
        .tx-notes { font-size: 9px; color: #64748b; margin-bottom: 2px; font-style: italic; }
        .tx-ref { font-size: 8px; color: #94a3b9; font-family: 'Courier New', monospace; }

        /* --- FOOTER --- */
        .footer {
          margin-top: 50px;
          border-top: 1px solid #e2e8f0;
          padding-top: 15px;
          display: flex;
          justify-content: space-between;
          font-size: 8px;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      
      <div class="header-container">
        <div class="brand-section">
          <h1>MONETA SACCO SAVINGS GROUP</h1>
          <p>Jinja Road, Kampala, Uganda</p>
          <p>+256 756 124 346</p>
        </div>
        <div class="statement-label">
          <h2>Statement of Account</h2>
          <div class="period">${period.from} to ${period.to}</div>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <div class="info-title">Account Holder</div>
          <div class="info-value">${member.first_name} ${member.last_name}</div>
          <div class="info-address">Member ID: ${member.id}</div>
          <div class="info-address">Phone: ${member.phone || "N/A"}</div>
        </div>
        <div class="info-box">
          <div class="info-title">Account Summary</div>
          <div class="info-address">Currency: <strong>UGX (Ugandan Shilling)</strong></div>
          <div class="info-address">Generated: ${new Date().toLocaleString()}</div>
        </div>
      </div>

      <div class="summary-strip">
        <div class="sum-item">
          <div class="sum-label">Opening Balance</div>
          <div class="sum-value">${Number(openingBalance).toLocaleString()}</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">Total Deposits</div>
          <div class="sum-value green">+${Number(totals.moneyIn).toLocaleString()}</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">Total Withdrawals</div>
          <div class="sum-value red">-${Number(totals.moneyOut).toLocaleString()}</div>
        </div>
        <div class="sum-item" style="text-align: right;">
          <div class="sum-label">Closing Balance</div>
          <div class="sum-value" style="font-size: 16px;">${Number(closingBalance).toLocaleString()}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description / Reference</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th style="text-align: right;">Amount</th>
            <th style="text-align: right;">Running Balance</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div class="footer">
        <div>
          <strong>Computer Generated Document</strong><br/>
          This statement is valid without a physical signature.
        </div>
        <div>
          Page 1 of 1
        </div>
      </div>

    </body>
  </html>
  `;

  try {
    if (Platform.OS === "web") {
      await Print.printAsync({ html });
      return;
    }

    const { uri } = await Print.printToFileAsync({ html });

    if (Platform.OS === "android") {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await savePdfToDownloads(
        `STATEMENT_${member.id}_${Date.now()}.pdf`,

        base64,
      );

      Alert.alert("Download Complete", "Statement saved to storage.");
    } else {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
      });
    }
  } catch (error) {
    console.error("Member Statement Error:", error);

    Alert.alert("Error", "Failed to generate statement.");
  }
};
