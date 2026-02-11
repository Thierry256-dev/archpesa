import MlkitOcr from "react-native-mlkit-ocr";
import { extractExternalReference } from "./extractExternalReference";

export async function runOnDeviceOCR(imageUri) {
  try {
    const result = await MlkitOcr.detectFromUri(imageUri);

    const rawText = result.map((block) => block.text).join("\n");

    const extracted = extractExternalReference(rawText);

    return {
      rawText,
      external_reference: extracted?.value || null,
      source: extracted?.type || null,
    };
  } catch (error) {
    console.error("OCR failed", error);
    return null;
  }
}
