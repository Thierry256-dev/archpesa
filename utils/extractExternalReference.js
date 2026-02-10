export function extractExternalReference(ocrText) {
  if (!ocrText) return "";

  const text = ocrText.toUpperCase();

  //Matching TID
  const tidMatch = text.match(
    /(TRANSACTION\s*ID|TXN\s*ID|T\s*ID)\s*[:\-]?\s*([A-Z0-9\-]{6,})/,
  );

  if (tidMatch?.[2]) {
    return {
      type: "TID",
      value: tidMatch[2],
    };
  }

  //Matching reference
  const refMatch = text.match(
    /(REFERENCE|REF\s*NO|REF)\s*[:\-]?\s*([A-Z0-9\-]{5,})/,
  );

  if (refMatch?.[2]) {
    return {
      type: "REFERENCE",
      value: refMatch[2],
    };
  }

  return "";
}
