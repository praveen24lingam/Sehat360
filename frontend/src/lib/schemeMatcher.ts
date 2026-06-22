import { SchemeAnswers, Scheme } from '@/types'
import { SCHEMES_DATA } from '@/data/schemes'

export function matchSchemesStatic(answers: SchemeAnswers): Scheme[] {
  const matches: Scheme[] = []
  
  const isLowIncome = answers.monthlyIncome === '0-5000' || answers.monthlyIncome === '5001-10000'
  const isMedIncome = answers.monthlyIncome === '10001-25000'
  
  // 1. PM-JAY
  if (isLowIncome || answers.rationCardType === 'bpl' || answers.rationCardType === 'aay' || answers.hasAyushmanCard === 'yes') {
    const pmjay = SCHEMES_DATA.find(s => s.id === 'pm-jay')
    if (pmjay) {
      matches.push({
        ...pmjay,
        status: (isLowIncome || answers.rationCardType === 'bpl' || answers.rationCardType === 'aay') ? 'eligible' : 'check'
      })
    }
  }
  
  // 2. PMMVY & JSY (Pregnancy schemes)
  if (answers.isPregnant) {
    const pmmvy = SCHEMES_DATA.find(s => s.id === 'pmmvy')
    if (pmmvy) {
      matches.push({
        ...pmmvy,
        status: 'eligible'
      })
    }
    
    const jsy = SCHEMES_DATA.find(s => s.id === 'jsy')
    if (jsy) {
      matches.push({
        ...jsy,
        status: (isLowIncome || answers.rationCardType === 'bpl') ? 'eligible' : 'likely'
      })
    }
  }
  
  // 3. Mission Indradhanush (Immunization)
  if (answers.childrenUnder5 > 0) {
    const mi = SCHEMES_DATA.find(s => s.id === 'mission-indradhanush')
    if (mi) {
      matches.push({
        ...mi,
        status: 'eligible'
      })
    }
  }

  // 4. MP Nishulk Dawai Yojana (State specific)
  if (answers.state === 'Madhya Pradesh') {
    const mpDawai = SCHEMES_DATA.find(s => s.id === 'mp-dawai')
    if (mpDawai) {
      matches.push({
        ...mpDawai,
        status: 'eligible'
      })
    }
  }
  
  // 5. Always recommend Jan Aushadhi
  const janAushadhi = SCHEMES_DATA.find(s => s.id === 'jan-aushadhi')
  if (janAushadhi) {
    matches.push({
      ...janAushadhi,
      status: 'eligible'
    })
  }
    
  return matches
}