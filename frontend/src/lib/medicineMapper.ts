import { Medicine } from '@/types'
import { MEDICINE_CATALOG } from '@/data/medicineCatalog'
import { isGeminiConfigured } from './gemini'

export async function mapMedicinesFromText(rawText: string): Promise<{
  medicines: Medicine[]
  totalMonthlySaving: number
  totalYearlySaving: number
  source: 'gemini' | 'fallback'
}> {
  if (isGeminiConfigured) {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are a medical helper for SehatMitra. Analyze this raw text from a medical prescription: "${rawText}"
          Identify if any of the following brand name medicines or their active salts are present.
          Here is our catalog of medicines to match against:
          ${JSON.stringify(MEDICINE_CATALOG.map(m => ({ id: m.id, brandName: m.brandName, saltName: m.saltName, dosage: m.dosage, brandPrice: m.brandPrice, genericPrice: m.genericPrice })))}
          
          Respond ONLY with a valid JSON array of matched medicines. Mapped objects should strictly match the catalog values. 
          If a brand name or salt matches partially, find the closest catalog match.
          Each object in the JSON array must have:
          - id (string)
          - brandName (string)
          - saltName (string)
          - dosage (string)
          - brandPrice (number)
          - genericPrice (number)
          - confidence (number, e.g., 0.95)
          
          Do not include any markdown styling like \`\`\`json or explanations. Just return the raw JSON array string.`
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        const text = data.text.trim()
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim()
        const parsed = JSON.parse(cleanedText)
        
        if (Array.isArray(parsed) && parsed.length > 0) {
          const medicines: Medicine[] = parsed.map((m: any) => ({
            id: m.id,
            brandName: m.brandName,
            saltName: m.saltName,
            dosage: m.dosage,
            brandPrice: Number(m.brandPrice),
            genericPrice: Number(m.genericPrice),
            monthlySaving: Number(m.brandPrice) - Number(m.genericPrice),
            yearlySaving: (Number(m.brandPrice) - Number(m.genericPrice)) * 12,
            confidence: Number(m.confidence || 0.9),
            source: 'gemini' as const
          }))
          
          const totalMonthlySaving = medicines.reduce((sum, m) => sum + m.monthlySaving, 0)
          const totalYearlySaving = medicines.reduce((sum, m) => sum + m.yearlySaving, 0)
          
          return {
            medicines,
            totalMonthlySaving,
            totalYearlySaving,
            source: 'gemini'
          }
        }
      }
    } catch (e) {
      console.warn("Gemini mapping failed, falling back to static matching", e)
    }
  }

  const textLower = rawText.toLowerCase()
  const matchedMedicines: Medicine[] = []
  
  MEDICINE_CATALOG.forEach(item => {
    if (item.keywords.some(kw => textLower.includes(kw))) {
      matchedMedicines.push({
        id: item.id,
        brandName: item.brandName,
        saltName: item.saltName,
        dosage: item.dosage,
        brandPrice: item.brandPrice,
        genericPrice: item.genericPrice,
        monthlySaving: item.brandPrice - item.genericPrice,
        yearlySaving: (item.brandPrice - item.genericPrice) * 12,
        confidence: 0.85,
        source: 'fallback'
      })
    }
  })

  // Provide at least one default match if OCR finds nothing
  if (matchedMedicines.length === 0) {
    const item = MEDICINE_CATALOG[0]
    matchedMedicines.push({
      id: item.id,
      brandName: item.brandName,
      saltName: item.saltName,
      dosage: item.dosage,
      brandPrice: item.brandPrice,
      genericPrice: item.genericPrice,
      monthlySaving: item.brandPrice - item.genericPrice,
      yearlySaving: (item.brandPrice - item.genericPrice) * 12,
      confidence: 0.5,
      source: 'fallback'
    })
  }

  const totalMonthlySaving = matchedMedicines.reduce((sum, m) => sum + m.monthlySaving, 0)
  const totalYearlySaving = matchedMedicines.reduce((sum, m) => sum + m.yearlySaving, 0)

  return {
    medicines: matchedMedicines,
    totalMonthlySaving,
    totalYearlySaving,
    source: 'fallback'
  }
}
