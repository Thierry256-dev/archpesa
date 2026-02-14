import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import { savePdfToDownloads } from "../saveToStorage";

/**
 * Generates a Professional SACCO Loan Portfolio HTML
 * @param {Array} loans - The array of loan objects
 * @param {Object} saccoInfo - Basic info about the SACCO
 */

export const generateLoansPdfReport = async (
  loans,
  saccoInfo = {
    name: "MONETA SAVINGS GROUP",
    address: "Jinja Road, Kampala",
  },
) => {
  const totalPrincipal = loans.reduce((sum, l) => sum + l.principal, 0);
  const totalOutstanding = loans.reduce((sum, l) => sum + l.balance_due, 0);
  const totalArrears = loans.filter((l) => l.days_in_arrears > 0).length;
  const portfolioAtRisk = loans.filter((l) =>
    ["Substandard", "Doubtful", "Loss"].includes(l.risk_category),
  ).length;

  const fmt = (n) =>
    Number(n).toLocaleString("en-GB", { minimumFractionDigits: 0 });
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const rows = loans
    .map((l, i) => {
      let riskColor = "#1e293b";
      if (l.risk_category === "Substandard") riskColor = "#d97706";
      if (l.risk_category === "Doubtful") riskColor = "#dc2626";
      if (l.risk_category === "Loss") riskColor = "#991b1b";

      return `
      <tr style="background-color: ${i % 2 === 0 ? "#ffffff" : "#f8fafc"}; border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 8px;">${l.membership_no}</td>
        <td style="padding: 12px 8px; font-weight: 600; color: #334155;">${l.member_name}</td>
        <td style="padding: 12px 8px;">${l.status}</td>
        <td style="padding: 12px 8px; font-weight: bold; color: ${riskColor}; font-size: 11px; ">${l.risk_category}</td>
        <td style="padding: 12px 8px; text-align: right; font-family: 'Courier New', Courier, monospace;">${fmt(l.principal)}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: bold; font-family: 'Courier New', Courier, monospace;">${fmt(l.balance_due)}</td>
        <td style="padding: 12px 8px; text-align: center; color: ${l.days_in_arrears > 0 ? "#dc2626" : "#059669"};">${l.days_in_arrears}</td>
      </tr>
    `;
    })
    .join("");

  // 4.Professional Template
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          @page { margin: 40px; size: A4; } /* Sets margin for the actual PDF page */
          
          body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            color: #0f172a; 
            line-height: 1.5; 
            -webkit-print-color-adjust: exact; /* Ensures backgrounds print correctly */
          }

          /* HEADER */
          .header-grid { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #1e293b; padding-bottom: 15px; margin-bottom: 30px; }
          .sacco-name { font-size: 26px; font-weight: 900; color: #1e293b; letter-spacing: -0.5px; text-transform: uppercase; }
          .sacco-address { font-size: 11px; color: #64748b; margin-top: 4px; }
          .report-meta { text-align: right; }
          .report-title { font-size: 18px; font-weight: bold; color: #3b82f6; text-transform: uppercase; }
          .gen-date { font-size: 10px; color: #94a3b8; margin-top: 4px; }

          /* EXECUTIVE SUMMARY BOX */
          .summary-box { 
            background-color: #f1f5f9; 
            border: 1px solid #cbd5e1; 
            border-radius: 8px; 
            padding: 20px; 
            margin-bottom: 30px; 
            display: flex; 
            justify-content: space-between; 
          }
          .stat-item { flex: 1; border-right: 1px solid #cbd5e1; padding-left: 20px; }
          .stat-item:first-child { padding-left: 0; }
          .stat-item:last-child { border-right: none; }
          .stat-label { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
          .stat-value { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 5px; }
          .stat-value.danger { color: #dc2626; }

          /* DATA TABLE */
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { 
            background-color: #1e293b; 
            color: #ffffff; 
            text-align: left; 
            padding: 12px 8px; 
            font-size: 10px; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
          }
          
          /* FOOTER */
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; }
          .signature-box { width: 30%; text-align: center; }
          .sig-line { border-bottom: 1px solid #000; height: 30px; margin-bottom: 8px; }
          .sig-label { font-size: 10px; font-weight: bold; }
          
          .confidential { text-align: center; font-size: 9px; color: #cbd5e1; margin-top: 40px; font-style: italic; }
        </style>
      </head>
      <body>

        <div class="header-grid">
          <div>
            <div class="sacco-name">${saccoInfo.name}</div>
            <div class="sacco-address">${saccoInfo.address}</div>           
          </div>
          <div class="report-meta">
            <div class="report-title">Loan Portfolio Report</div>
            <div class="gen-date">Generated: ${dateStr}</div>
          </div>
        </div>

        <div class="summary-box">
          <div class="stat-item">
            <div class="stat-label">Total Principal</div>
            <div class="stat-value">UGX ${fmt(totalPrincipal)}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Total Outstanding</div>
            <div class="stat-value">UGX ${fmt(totalOutstanding)}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Loans in Arrears</div>
            <div class="stat-value danger">${totalArrears} / ${loans.length}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Portfolio Risk</div>
            <div class="stat-value danger">${portfolioAtRisk} Loans</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Member Name</th>
              <th>Status</th>
              <th>Risk Category</th>
              <th style="text-align: right;">Principal</th>
              <th style="text-align: right;">Balance Due</th>
              <th style="text-align: center;">Arrears (Days)</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="footer">
          <div class="signature-box">
            <div class="sig-line"></div>
            <div class="sig-label">Prepared By (Treasurer)</div>
          </div>
          <div class="signature-box">
            <div class="sig-line"></div>
            <div class="sig-label">Approved By (Chairperson)</div>
          </div>
          <div class="signature-box">
            <div class="sig-line"></div>
            <div class="sig-label">Audit Verified</div>
          </div>
        </div>

        <div class="confidential">
          CONFIDENTIAL DOCUMENT: This report contains sensitive financial data. 
          Unauthorized distribution is prohibited. Printed from Official SACCO Portal.
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

      await savePdfToDownloads(`Loan_Report_${Date.now()}.pdf`, base64);
      Alert.alert("Success", "PDF saved to Storage");
    } else {
      await Sharing.shareAsync(uri);
    }
  } catch (err) {
    console.log("PDF Error:", err);
    Alert.alert("Error", "Failed to generate loan report");
  }
};
