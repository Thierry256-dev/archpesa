import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import * as XLSX from "xlsx";
import { saveExcelToDownloads } from "../saveToStorage";

export const generateLoansExcelReport = async (loans) => {
  try {
    const data = loans.map((l) => ({
      "Member ID": l.membership_no,
      Name: l.member_name,
      Status: l.status,
      Risk: l.risk_category,
      Principal: l.principal,
      Outstanding: l.balance_due,
      "Days in Arrears": l.days_in_arrears,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loans");

    const base64 = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    const safeId = String(loans.length ?? "ALL")
      .replace(/[^a-z0-9]/gi, "_")
      .toUpperCase();

    const fileName = `LOANS_REPORT_${safeId}_${Date.now()}.xlsx`;
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
