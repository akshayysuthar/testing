import { Button } from "@/components/ui/button"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export function PdfDownload({
  contentId,
  selectedQuestions
}) {
  const handleDownload = async () => {
    const examPaper = document.getElementById('examPaperContent')
    if (!examPaper) return

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    // Add exam paper to PDF
    const examCanvas = await html2canvas(examPaper)
    const examImgData = examCanvas.toDataURL('image/png')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    pdf.addImage(examImgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    // Add answer key
    pdf.addPage()
    pdf.setFontSize(16)
    pdf.text('Answer Key', pdfWidth / 2, 20, { align: 'center' })
    
    let yPosition = 30
    selectedQuestions.forEach((question, index) => {
      if (yPosition > pdfHeight - 20) {
        pdf.addPage()
        yPosition = 20
      }
      pdf.setFontSize(12)
      pdf.text(`${index + 1}. ${question.question}`, 10, yPosition)
      yPosition += 10
      pdf.setFontSize(10)
      pdf.text(`Answer: ${question.answer}`, 20, yPosition)
      yPosition += 15
    })

    pdf.save('exam_paper_with_answers.pdf')
  }

  return (
    (<Button onClick={handleDownload}>Download Exam Paper with Answer Key (PDF)
          </Button>)
  );
}

