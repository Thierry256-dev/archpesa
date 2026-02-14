import Tesseract from "tesseract.js";
import { extractExternalReference } from "./extractExternalReference";

export async function runOnDeviceOCR(imageUri) {
  try {
    const {
      data: { text: rawText },
    } = await Tesseract.recognize(imageUri, "eng", {});

    const extracted = extractExternalReference(rawText);

    return {
      rawText,
      external_reference: extracted?.value || null,
      source: extracted?.type || null,
    };
  } catch (error) {
    console.error("Web OCR failed", error);
    return {
      rawText: "",
      external_reference: null,
      source: null,
    };
  }
}
