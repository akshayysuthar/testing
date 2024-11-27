import { Button } from "@/components/ui/button"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export function PdfDownload({
  contentId
}) {
  const handleDownload = async () => {
    const examPaper = document.getElementById('examPaper')
    const answerKey = document.getElementById('answerKey')
    if (!examPaper || !answerKey) return

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

    // Add answer key to new page in PDF
    pdf.addPage()
    const answerCanvas = await html2canvas(answerKey)
    const answerImgData = answerCanvas.toDataURL('image/png')
    pdf.addImage(answerImgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    pdf.save('exam_paper_with_answers.pdf')
  }

  return (
    (<Button onClick={handleDownload}>Download Exam Paper with Answer Key (PDF)
          </Button>)
  );
}

