import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import * as XLSX from "xlsx";
import {
  saveExcelToDownloads,
  savePdfToDownloads,
} from "../utils/saveToStorage";

/**
 * Professional SACCO PDF Engine
 * @param {string} title - The Report Name (e.g. "Member Savings Ledger")
 * @param {object} meta - Member/Account details
 * @param {Array} data - The API transactions array
 * @param {object} totals - Calculated figures (Deposits, Withdrawals, etc)
 */

export const generateAllMembersReportPdf = async (members = []) => {
  /* 1. Aggregates (Top Summary) */
  const totals = members.reduce(
    (acc, m) => {
      acc.totalSavings += m.savings || 0;
      acc.totalShares += m.shares || 0;
      acc.totalLoans += m.loan?.outstanding || 0;
      acc.totalPenalties += m.penalties || 0;

      if (m.loan?.status === "overdue") acc.overdueCount += 1;

      return acc;
    },
    {
      totalSavings: 0,
      totalShares: 0,
      totalLoans: 0,
      totalPenalties: 0,
      overdueCount: 0,
    },
  );

  /* 2. Table Rows */
  const tableRows = members
    .map(
      (m, index) => `
      <tr style="background:${index % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td>${m.id}</td>
        <td>${m.firstName} ${m.lastName}</td>
        <td>${m.phone}</td>
        <td>${m.status.toUpperCase()}</td>
        <td style="text-align:right;">${Number(m.savings).toLocaleString()}</td>
        <td style="text-align:right;">${Number(m.shares).toLocaleString()}</td>
        <td style="text-align:right; color:${
          m.loan.status === "overdue" ? "#dc2626" : "#1e293b"
        };">
          ${Number(m.loan.outstanding).toLocaleString()}
        </td>
        <td style="text-align:right;">${Number(
          m.penalties,
        ).toLocaleString()}</td>
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
            <th>Loan</th>
            <th>Penalties</th>
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

export const generateSaccoSavingsReport = async (title, meta, data, totals) => {
  // 1. Map API data to Table Rows
  // This logic is generic: it assumes data has date, reference, and amount
  const tableRows = data
    .map(
      (item, index) => `
    <tr style="background-color: ${index % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding: 10px; border-bottom: 0.5px solid #e2e8f0; font-size: 10px;">${item.date}</td>
      <td style="padding: 10px; border-bottom: 0.5px solid #e2e8f0; font-size: 10px;">       
        ${item.id}      
      </td>
      <td style="padding: 10px; border-bottom: 0.5px solid #e2e8f0; font-size: 10px;">       
        ${item.type}      
      </td>
      <td style="padding: 10px; border-bottom: 0.5px solid #e2e8f0; font-size: 10px;">
        <div style="font-weight: bold; color: #1e293b;">${item.reference}</div>        
      </td>
      <td style="padding: 10px; border-bottom: 0.5px solid #e2e8f0; font-size: 10px;">       
        ${item.status}      
      </td>      
      <td style="padding: 10px; border-bottom: 0.5px solid #e2e8f0; font-size: 10px; text-align: right; color: ${item.type === "deposit" ? "#059669" : "#dc2626"}; font-weight: bold;">
        ${item.type === "deposit" ? "+" : "-"}${Number(item.amount).toLocaleString()}
      </td>
    </tr>
  `,
    )
    .join("");

  // 2. The Main HTML Template
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @page { margin: 40px; }
          body { font-family: 'Helvetica', 'Arial', sans-serif; color: #1e293b; line-height: 1.5; }
          .sacco-header { text-align: center; border-bottom: 3px solid #07193f; padding-bottom: 10px; margin-bottom: 20px; }
          .sacco-name { font-size: 24px; font-weight: 900; color: #07193f; letter-spacing: 1px; }
          .report-title { font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: bold; margin-top: 5px; }
          
          .summary-section { display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 30px; background: #f1f5f9; padding: 15px; border-radius: 8px; }
          .summary-item { flex: 1; }
          .label { font-size: 9px; color: #64748b; font-weight: bold; text-transform: uppercase; }
          .value { font-size: 14px; font-weight: bold; color: #07193f; }

          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background-color: #07193f; color: white; text-align: left; padding: 12px 10px; font-size: 10px; text-transform: uppercase; }
          
          /* SIGNATURE SECTION */
          .signature-container { margin-top: 60px; display: flex; flex-direction: row; justify-content: space-between; }
          .sig-box { width: 40%; border-top: 1px solid #1e293b; text-align: center; padding-top: 10px; }
          .sig-label { font-size: 10px; font-weight: bold; color: #1e293b; }
          .sig-title { font-size: 9px; color: #64748b; }
          .digital-stamp { font-family: 'Courier', monospace; font-size: 8px; color: #94a3b8; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="sacco-header">
          <div class="sacco-name">UMOJA SACCO SOCIETY</div>
          <div class="report-title">${title}</div>
        </div>

        <div class="summary-section">
          <div class="summary-item">            
            <div class="value">Summary report</div>
            <div class="label" style="margin-top: 5px;">Generated on</div>
            <div class="value" style="font-size: 11px;">${new Date().toLocaleDateString()}</div>
          </div>
          <div class="summary-item" style="text-align: right;">
            <div class="label">Net Balance</div>
            <div class="value" style="font-size: 22px;">UGX ${Number(totals.closingBalance).toLocaleString()}</div>            
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>TXId</th>
              <th>TX Type</th>
              <th>Reference</th>
              <th>Status</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="signature-container">
          <div class="sig-box">
            <div class="sig-label">Robert Mugabe</div>
            <div class="sig-title">President / Chairperson</div>
            <div class="digital-stamp">Digitally Verified: ${new Date().getFullYear()}</div>
          </div>
          <div class="sig-box">
            <div class="sig-label">Sarah Nakintu</div>
            <div class="sig-title">Treasurer</div>
            <div class="digital-stamp">Digitally Verified: ${new Date().getFullYear()}</div>
          </div>
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 8px; color: #cbd5e1;">
          This is a computer-generated document and is valid without a physical stamp.
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
      await savePdfToDownloads(`SACCO_REPORT_${Date.now()}.pdf`, pdfBase64);
      Alert.alert(
        "Download Complete",
        "PDF report saved to storage. Check the folder you selected.",
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

export const generateSaccoExcel = async (title, data = [], meta = {}) => {
  try {
    /* 1. Prepare Header & Metadata*/
    const worksheetData = [
      ["SACCO NAME", "UMOJA SACCO SOCIETY"],
      ["REPORT TYPE", title || "Savings Ledger"],
      [
        "MEMBER",
        meta.memberName
          ? `${meta.memberName} (${meta.memberId ?? "N/A"})`
          : "ALL MEMBERS",
      ],
      ["DATE GENERATED", new Date().toLocaleString()],
      [],
      [
        "Date",
        "Transaction ID",
        "Reference",
        "Type",
        "Amount (UGX)",
        "Recorded By",
      ],
    ];

    /* 2. Append Ledger Rows */
    data.forEach((item) => {
      worksheetData.push([
        item.date ?? "",
        item.id ?? "",
        item.reference ?? "",
        (item.type ?? "").toUpperCase(),
        Number(item.amount ?? 0),
        item.recordedBy ?? "",
      ]);
    });

    /* 3. Create Workbook */
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Savings Ledger");

    /*4. Convert to Base64*/
    const base64 = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    /* 5. Save File */
    const safeId = String(meta.memberId ?? "ALL")
      .replace(/[^a-z0-9]/gi, "_")
      .toUpperCase();

    const fileName = `SACCO_LEDGER_${safeId}_${Date.now()}.xlsx`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    /* 6. Share (Safe) */
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert(
        "File Generated",
        "Excel file saved locally but sharing is not available on this device.",
      );
      return;
    }

    if (Platform.OS === "android") {
      await saveExcelToDownloads(fileName, base64);
    } else {
      await Sharing.shareAsync(fileUri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Export SACCO Financial Report",
        UTI: "com.microsoft.excel.xlsx",
      });
    }
  } catch (error) {
    console.error("Excel Export Error:", error);
    Alert.alert(
      "Export Failed",
      "Unable to generate Excel report. Please try again.",
    );
  }
};

export const generateMemberStatementPdf = async ({
  member,
  transactions,
  period,
}) => {
  /* 1. Compute Balances */
  const openingBalance = transactions[0]?.balanceAfter ?? 0;
  const closingBalance =
    transactions[transactions.length - 1]?.balanceAfter ?? 0;

  const category =
    transactions.length > 0
      ? transactions[0].category.toUpperCase()
      : "GENERAL";

  /* 2. Build Table Rows */
  const rows = transactions
    .map(
      (tx, index) => `
      <tr style="background:${index % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td>${tx.date}</td>
        <td>${tx.reference}</td>
        <td>${tx.type.toUpperCase()}</td>
        <td style="text-align:right; color:${
          tx.type === "deposit" ? "#059669" : "#dc2626"
        };">
          ${tx.type === "deposit" ? "+" : "-"}${Number(
            tx.amount,
          ).toLocaleString()}
        </td>
        <td style="text-align:right;">
          ${Number(tx.balanceAfter).toLocaleString()}
        </td>
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

        .title { font-size: 22px; font-weight: 900; color: #07193f; }
        .subtitle { font-size: 11px; color: #64748b; }

        .member-box {
          background: #f1f5f9;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 11px;
        }

        .summary {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 11px;
        }

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
        <div class="title">UMOJA SACCO LTD</div>
        <div class="subtitle">Member Financial Statement</div>
        <div class="subtitle">${category}</div>
      </div>

      <div class="member-box">
        <strong>Member:</strong> ${member.name}<br/>
        <strong>Member ID:</strong> ${member.id}<br/>
        <strong>Period:</strong> ${period.from} – ${period.to}
      </div>

      <div class="summary">
        <div><strong>Opening Balance:</strong> UGX ${openingBalance.toLocaleString()}</div>
        <div><strong>Closing Balance:</strong> UGX ${closingBalance.toLocaleString()}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Reference</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="footer">
        This is an electronically generated statement and is valid without a signature.<br/>
        Generated on ${new Date().toLocaleString()}
      </div>
    </body>
  </html>
  `;

  /* 4. Generate & Download */
  try {
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
