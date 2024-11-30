import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";

export function PdfDownload({
  selectedQuestions,
  instituteName,
  standard,
  subject,
  chapters,
  studentName,
  teacherName,
  totalMarks,
}) {

  console.log(selectedQuestions);
  
  const handleDownload = () => {
    if (!selectedQuestions || selectedQuestions.length === 0) {
      console.error("No questions selected");
      return;
    }
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;
    let yPos = margin;

    // Helper function to add a new page
    const addNewPage = () => {
      doc.addPage();
      yPos = margin;
    };

    // Helper function to add text with word wrap
    const addWrappedText = (
      text,
      x,
      y,
      maxWidth,
      fontSize = 12,
      bold = false
    ) => {
      if (bold) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + lineHeight * lines.length;
    };

    // Add exam paper header
    yPos = addWrappedText(
      instituteName,
      margin,
      yPos,
      pageWidth - 2 * margin,
      16,
      true
    );
    yPos = addWrappedText(
      `Standard: ${standard} Subject: ${subject}`,
      margin,
      yPos,
      pageWidth - 2 * margin
    );
    yPos = addWrappedText(
      `Chapter: ${chapters.join(", ")}`,
      margin,
      yPos,
      pageWidth - 2 * margin
    );
    yPos = addWrappedText(
      `Student's Name: ${studentName}`,
      margin,
      yPos,
      pageWidth - 2 * margin
    );
    yPos = addWrappedText(
      `Teacher Name: ${teacherName}`,
      margin,
      yPos,
      pageWidth - 2 * margin
    );
    yPos += lineHeight;

    // Group questions by type
    const groupedQuestions = selectedQuestions.reduce((acc, question) => {
      const key = question.type;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(question);
      return acc;
    }, {});

    // Add questions
    Object.entries(groupedQuestions).forEach(([type, questions], typeIndex) => {
      if (yPos > pageHeight - 40) addNewPage();
      yPos = addWrappedText(
        `Question ${typeIndex + 1}. ${type}`,
        margin,
        yPos,
        pageWidth - 2 * margin,
        14,
        true
      );
      yPos += lineHeight / 2;

      questions.forEach((question, index) => {
        if (yPos > pageHeight - 40) addNewPage();

        if (question.type === "MCQ") {
          yPos = addWrappedText(
            `${index + 1}. ${question.question}`,
            margin,
            yPos,
            pageWidth - 2 * margin
          );
          Object.entries(question.options).forEach(([key, value]) => {
            yPos = addWrappedText(
              `(${key}) ${value}`,
              margin + 10,
              yPos,
              pageWidth - 2 * margin - 10
            );
          });
        } else {
          yPos = addWrappedText(
            `${index + 1}. ${question.question}`,
            margin,
            yPos,
            pageWidth - 2 * margin
          );
        }

        yPos = addWrappedText(
          `(${question.marks} marks)`,
          margin,
          yPos,
          pageWidth - 2 * margin,
          10
        );
        yPos += lineHeight / 2;
      });

      yPos += lineHeight;
    });

    // Add "All the Best!" at the bottom of the last page
    doc.setFontSize(14);
    doc.text("All the Best!", pageWidth / 2, pageHeight - margin, {
      align: "center",
    });

    // Add answer key on a new page
    addNewPage();
    yPos = addWrappedText(
      "Answer Key",
      pageWidth / 2,
      yPos,
      pageWidth - 2 * margin,
      16,
      true
    );
    yPos += lineHeight;

    selectedQuestions.forEach((question, index) => {
      if (yPos > pageHeight - 30) addNewPage();
      const answerText = `Q${index + 1}: ${
        typeof question.answer === "string"
          ? question.answer
          : JSON.stringify(question.answer)
      }`;
      yPos = addWrappedText(answerText, margin, yPos, pageWidth - 2 * margin);
      yPos += lineHeight / 2;
    });

    doc.save("exam_paper_with_answers.pdf");
  };

  return <Button onClick={handleDownload}>Download PDF</Button>;
}
