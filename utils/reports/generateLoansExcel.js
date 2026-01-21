import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import * as XLSX from "xlsx";
import { saveExcelToDownloads } from "../saveToStorage"; // Assuming this is your Android helper

export const generateLoansExcelReport = async (
  loans,
  saccoMeta = { name: "EXCELSIOR SACCO LTD" },
) => {
  try {
    // 1. PRE-CALCULATE SUMMARIES
    const totalPrincipal = loans.reduce(
      (sum, l) => sum + (l.principal || 0),
      0,
    );
    const totalOutstanding = loans.reduce(
      (sum, l) => sum + (l.balance_due || 0),
      0,
    );
    const riskCount = loans.filter((l) =>
      ["Substandard", "Doubtful", "Loss"].includes(l.risk_category),
    ).length;

    // 2. BUILD THE DATA GRID (Row by Row approach)
    // This allows us to inject headers, summaries, and empty spacers nicely.
    const wsData = [
      // --- REPORT HEADER SECTION ---
      [saccoMeta.name.toUpperCase()], // Row 1
      ["LOAN PORTFOLIO PERFORMANCE REPORT"], // Row 2
      ["Generated On:", new Date().toLocaleString()], // Row 3
      [], // Spacer Row

      // --- EXECUTIVE SUMMARY SECTION ---
      ["PORTFOLIO SUMMARY"],
      ["Total Principal Disbursed:", totalPrincipal],
      ["Total Outstanding Balance:", totalOutstanding],
      ["Loans At Risk:", riskCount],
      [], // Spacer Row

      // --- DATA TABLE HEADERS ---
      [
        "Member ID",
        "Member Name",
        "Loan Status",
        "Risk Category",
        "Principal (UGX)",
        "Outstanding (UGX)",
        "Days Overdue",
      ],
    ];

    // 3. ADD ACTUAL DATA ROWS
    loans.forEach((l) => {
      wsData.push([
        l.membership_no,
        l.member_name,
        l.status,
        l.risk_category,
        l.principal, // Pass raw number for math
        l.balance_due, // Pass raw number for math
        l.days_in_arrears,
      ]);
    });

    // 4. CREATE WORKSHEET WITH OPTIONS
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // 5. PROFESSIONAL FORMATTING
    // We modify the 'cols' (Column Widths) and cell formats manually

    // A. Set Column Widths (Char count)
    ws["!cols"] = [
      { wch: 15 }, // ID
      { wch: 25 }, // Name (Wider)
      { wch: 12 }, // Status
      { wch: 15 }, // Risk
      { wch: 18 }, // Principal
      { wch: 18 }, // Outstanding
      { wch: 12 }, // Arrears
    ];

    // B. Merge Title Cells (Optional but looks nice)
    // Merges Row 0, Col 0 to Row 0, Col 3 (A1:D1)
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // SACCO Name
      { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // Report Title
    ];

    // C. Apply Number Formats to Money Columns
    // The loop starts at row 7 (index 6) where data begins
    // Columns 4 (E) and 5 (F) are money
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = 7; R <= range.e.r; ++R) {
      // Principal Column (Index 4)
      const refPrincipal = XLSX.utils.encode_cell({ r: R, c: 4 });
      if (ws[refPrincipal]) {
        ws[refPrincipal].z = '#,##0 "UGX"'; // Custom Excel Format
        ws[refPrincipal].t = "n"; // Force type to Number
      }

      // Outstanding Column (Index 5)
      const refOutstanding = XLSX.utils.encode_cell({ r: R, c: 5 });
      if (ws[refOutstanding]) {
        ws[refOutstanding].z = '#,##0 "UGX"'; // Custom Excel Format
        ws[refOutstanding].t = "n"; // Force type to Number
      }
    }

    // 6. BUILD WORKBOOK
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Portfolio Report");

    // 7. WRITE FILE (Base64)
    const base64 = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    // 8. FILE NAMING & SAVING
    const safeDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const fileName = `SACCO_LOANS_${safeDate}.xlsx`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 9. PLATFORM SPECIFIC SHARING
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert("Success", "File saved locally (Sharing unavailable)");
      return;
    }

    if (Platform.OS === "android") {
      // Use your custom download helper for Android Scoped Storage
      await saveExcelToDownloads(fileName, base64);
    } else {
      // Standard iOS Share Sheet
      await Sharing.shareAsync(fileUri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Export Financial Report",
        UTI: "com.microsoft.excel.xlsx",
      });
    }
  } catch (error) {
    console.error("Excel Generation Error:", error);
    Alert.alert("Export Error", "Failed to generate the Excel file.");
  }
};
