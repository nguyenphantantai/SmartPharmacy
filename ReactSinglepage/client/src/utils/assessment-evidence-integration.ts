// Script to add evidence display to all assessment pages
// This will be used to quickly add evidence to remaining assessment pages

const assessmentPages = [
  {
    file: 'cardiovascular-assessment.tsx',
    assessmentId: 'cardiovascular',
    assessmentName: 'Đánh giá yếu tố nguy cơ tim mạch - thận - chuyển hóa'
  },
  {
    file: 'allergic-rhinitis-assessment.tsx', 
    assessmentId: 'allergic-rhinitis',
    assessmentName: 'Đánh giá nguy cơ mắc bệnh viêm mũi dị ứng'
  },
  {
    file: 'iief5-assessment.tsx',
    assessmentId: 'iief5', 
    assessmentName: 'Đánh giá mức độ cương cứng dương vật IIEF-5 (SHIM)'
  },
  {
    file: 'tnmindtest.tsx',
    assessmentId: 'tnmindtest',
    assessmentName: 'Trí nhớ và mức độ tập trung chú ý TNmindtest'
  },
  {
    file: 'fungal-skin-assessment.tsx',
    assessmentId: 'fungal-skin',
    assessmentName: 'Đánh giá nguy cơ mắc bệnh nấm da'
  },
  {
    file: 'asthma-abuse-assessment.tsx',
    assessmentId: 'asthma-abuse',
    assessmentName: 'Đánh giá nguy cơ lạm dụng thuốc cắt cơn hen'
  }
];

// For each assessment page, we need to:
// 1. Add imports for EvidenceDisplay, BookOpen, and assessmentEvidenceData
// 2. Add showEvidence state
// 3. Add evidence button and display component
// 4. Find the title section and add the evidence components

export default assessmentPages;
