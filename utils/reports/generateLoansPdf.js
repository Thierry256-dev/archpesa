import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import { savePdfToDownloads } from "../saveToStorage";

export const generateLoansPdfReport = async (loans) => {
  try {
    const rows = loans
      .map(
        (l, i) => `
        <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f8fafc"}">
          <td>${l.membership_no}</td>
          <td>${l.member_name}</td>
          <td>${l.status}</td>
          <td>${l.risk_category}</td>
          <td style="text-align:right">${Number(l.principal).toLocaleString()}</td>
          <td style="text-align:right">${Number(l.balance_due).toLocaleString()}</td>
          <td style="text-align:center">${l.days_in_arrears}</td>
        </tr>
      `,
      )
      .join("");

    const html = `
    <html>
      <body>
        <h2>Loan Portfolio Report</h2>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <table border="1" cellspacing="0" cellpadding="6" width="100%">
          <tr>
            <th>Member</th>
            <th>Name</th>
            <th>Status</th>
            <th>Risk</th>
            <th>Principal</th>
            <th>Outstanding</th>
            <th>Arrears</th>
          </tr>
          ${rows}
        </table>
      </body>
    </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });

    if (Platform.OS === "android") {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await savePdfToDownloads(`Loan_Report_${Date.now()}.pdf`, base64);
      Alert.alert("Success", "PDF saved to Downloads");
    } else {
      await Sharing.shareAsync(uri);
    }
  } catch (err) {
    console.error("PDF Error:", err);
    Alert.alert("Error", "Failed to generate loan report");
  }
};
