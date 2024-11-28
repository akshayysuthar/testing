import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function GeneratedExam({
  selectedQuestions,
  classNumber,
  board,
  medium,
  subject,
  totalMarks
}) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [reportedQuestionId, setReportedQuestionId] = useState(null)

  const handleReportQuestion = (questionId) => {
    setReportedQuestionId(questionId)
    setReportDialogOpen(true)
  }

  const handleSubmitReport = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const reportData = {
      questionId: reportedQuestionId,
      issue: formData.get('issue'),
      description: formData.get('description'),
    }
    console.log('Report submitted:', reportData)
    // Here you would typically send this data to your backend
    setReportDialogOpen(false)
  }

  return (
    (<div className="mt-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Exam Paper</h2>
          <p>Class: {classNumber} | Board: {board} | Medium: {medium}</p>
          <p>Subject: {subject}</p>
          <p>Total Marks: {totalMarks}</p>
          <p>Time: {Math.ceil(totalMarks * 1.5)} minutes</p>
        </div>
        
        <ol className="list-decimal list-inside space-y-8">
          {selectedQuestions.map((question, index) => (
            <li
              key={`${question.chapterId}-${question.sectionType}-${question.id}`}
              className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold">{question.question}</span>
                  <span className="text-sm text-gray-500 ml-2">({question.marks} marks)</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReportQuestion(`${question.chapterId}-${question.sectionType}-${question.id}`)}>
                  Report
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">({question.sectionType})</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Answer Key</h2>
        <ol className="list-decimal list-inside space-y-4">
          {selectedQuestions.map((question, index) => (
            <li
              key={`answer-${question.chapterId}-${question.sectionType}-${question.id}`}
              className="mb-2">
              <p className="font-semibold">{question.question}</p>
              <p className="ml-4 mt-1">
                {typeof question.answer === 'string' ? (
                  question.answer
                ) : (
                  <ul className="list-disc list-inside">
                    {Object.entries(question.answer).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-medium">{key}: </span>
                        {Array.isArray(value) ? (
                          <ul className="list-disc list-inside ml-4">
                            {value.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          value
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report a Problem</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReport}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="issue">Issue Type</Label>
                <Input
                  id="issue"
                  name="issue"
                  placeholder="e.g., Incorrect question, Typo, etc."
                  required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please describe the issue in detail"
                  required />
              </div>
              <Button type="submit">Submit Report</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>)
  );
}

