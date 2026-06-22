import { Scheme } from '@/types'

export interface SchemeData extends Scheme {
  eligibilityRules: {
    requiresPregnancy?: boolean
    requiresChildUnder5?: boolean
    requiresLowIncome?: boolean
    requiresBPLCard?: boolean
    requiresSenior?: boolean
    stateSpecific?: string
  }
}

export const SCHEMES_DATA: SchemeData[] = [
  {
    id: 'pm-jay',
    name: 'Ayushman Bharat PM-JAY',
    nameHi: 'आयुष्मान भारत PM-JAY',
    status: 'check',
    benefit: '₹5,00,000/year hospital cover',
    benefitHi: '₹5,00,000/वर्ष अस्पताल कवर',
    reason: 'You may be eligible based on income',
    reasonHi: 'आय के आधार पर आप पात्र हो सकते हैं',
    documents: ['Aadhar Card', 'Ration Card', 'Income Certificate'],
    documentsHi: ['आधार कार्ड', 'राशन कार्ड', 'आय प्रमाण पत्र'],
    applyAt: 'Nearest CSC / Govt Hospital',
    applyAtHi: 'निकटतम CSC / सरकारी अस्पताल',
    officialUrl: 'https://pmjay.gov.in/',
    eligibilityRules: {
      requiresLowIncome: true,
      requiresBPLCard: true
    }
  },
  {
    id: 'pmmvy',
    name: 'Pradhan Mantri Matru Vandana Yojana',
    nameHi: 'प्रधानमंत्री मातृ वंदना योजना',
    status: 'check',
    benefit: '₹5,000 maternity benefit',
    benefitHi: '₹5,000 मातृत्व लाभ',
    reason: 'For pregnant women having their first child',
    reasonHi: 'पहली बार गर्भवती महिलाओं के लिए',
    documents: ['Aadhar Card', 'Bank Passbook', 'MCP Card'],
    documentsHi: ['आधार कार्ड', 'बैंक पासबुक', 'MCP कार्ड'],
    applyAt: 'Anganwadi Centre / ASHA Worker',
    applyAtHi: 'आंगनवाड़ी केंद्र / आशा कार्यकर्ता',
    officialUrl: 'https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana',
    eligibilityRules: {
      requiresPregnancy: true
    }
  },
  {
    id: 'jsy',
    name: 'Janani Suraksha Yojana (JSY)',
    nameHi: 'जननी सुरक्षा योजना',
    status: 'check',
    benefit: 'Cash assistance for institutional delivery',
    benefitHi: 'अस्पताल में डिलीवरी पर नकद सहायता',
    reason: 'Promotes institutional delivery among poor pregnant women',
    reasonHi: 'गरीब गर्भवती महिलाओं में संस्थागत प्रसव को बढ़ावा देने के लिए',
    documents: ['BPL Card', 'Aadhar Card', 'JSA Card'],
    documentsHi: ['BPL कार्ड', 'आधार कार्ड', 'JSA कार्ड'],
    applyAt: 'ASHA Worker / Govt Health Centre',
    applyAtHi: 'आशा कार्यकर्ता / सरकारी स्वास्थ्य केंद्र',
    eligibilityRules: {
      requiresPregnancy: true,
      requiresBPLCard: true
    }
  },
  {
    id: 'jan-aushadhi',
    name: 'Pradhan Mantri Bhartiya Janaushadhi',
    nameHi: 'प्रधानमंत्री भारतीय जनऔषधि परियोजना',
    status: 'eligible',
    benefit: '50-90% discount on generic medicines',
    benefitHi: 'जेनेरिक दवाओं पर 50-90% की छूट',
    reason: 'Open for all Indian citizens',
    reasonHi: 'सभी भारतीय नागरिकों के लिए उपलब्ध',
    documents: ['Valid Prescription'],
    documentsHi: ['वैध डॉक्टर की पर्ची'],
    applyAt: 'Nearest Jan Aushadhi Kendra',
    applyAtHi: 'निकटतम जन औषधि केंद्र',
    eligibilityRules: {}
  },
  {
    id: 'mission-indradhanush',
    name: 'Mission Indradhanush',
    nameHi: 'मिशन इंद्रधनुष',
    status: 'eligible',
    benefit: 'Free life-saving vaccines for children',
    benefitHi: 'बच्चों के लिए मुफ्त जीवन रक्षक टीके',
    reason: 'If child is under 5 years',
    reasonHi: 'यदि बच्चा 5 वर्ष से कम है',
    documents: ['Aadhar Card', 'Immunization Card'],
    documentsHi: ['आधार कार्ड', 'टीकाकरण कार्ड'],
    applyAt: 'Govt Hospitals / PHC / Anganwadi',
    applyAtHi: 'सरकारी अस्पताल / PHC / आंगनवाड़ी',
    eligibilityRules: {
      requiresChildUnder5: true
    }
  },
  {
    id: 'mp-dawai',
    name: 'MP Nishulk Dawai Yojana',
    nameHi: 'म.प्र. निःशुल्क दवा योजना',
    status: 'check',
    benefit: 'Free medicine at govt hospitals',
    benefitHi: 'सरकारी अस्पतालों में मुफ्त दवा',
    reason: 'For all residents of MP',
    reasonHi: 'म.प्र. के सभी निवासियों के लिए',
    documents: ['Aadhar Card', 'MP Domicile'],
    documentsHi: ['आधार कार्ड', 'म.प्र. मूल निवासी प्रमाण पत्र'],
    applyAt: 'Govt Hospitals in MP',
    applyAtHi: 'म.प्र. के सरकारी अस्पताल',
    eligibilityRules: {
      stateSpecific: 'Madhya Pradesh'
    }
  }
]