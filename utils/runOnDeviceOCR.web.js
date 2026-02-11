let warningShown = false;

export async function runOnDeviceOCR(imageUri) {
  if (!warningShown) {
    console.warn(
      "[OCR] On-device OCR is not available on web. Users must manually enter transaction reference.",
    );
    warningShown = true;
  }

  return null;
}
