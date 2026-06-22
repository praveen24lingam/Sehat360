import Tesseract from 'tesseract.js'

export async function extractPrescriptionText(
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  const result = await Tesseract.recognize(file, 'eng+hin', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        onProgress(Math.round(m.progress * 100))
      }
    },
  })
  return result.data.text
}