import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

export const saveExcelToDownloads = async (fileName, base64Data) => {
  const permissions =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permissions.granted) {
    throw new Error("Permission denied");
  }

  const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
    permissions.directoryUri,
    fileName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );

  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
};

export const savePdfToDownloads = async (fileName, base64Data) => {
  if (Platform.OS !== "android") {
    throw new Error("Android only");
  }

  const permission =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permission.granted) {
    throw new Error("Permission denied");
  }

  const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
    permission.directoryUri,
    fileName,
    "application/pdf",
  );

  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
};
