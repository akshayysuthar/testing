import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function GeneratedExam({
  generationType,
  classNumber,
  board,
  medium,
  subject,
  chapters,
  questions,
  totalMarks
}) {
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [reportedQuestionId, setReportedQuestionId] = useState(null)

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    const mockData = [
      {
        class: 10,
        board: "GSEB",
        subject: "Science",
        chapters: [
          {
            id: 1,
            name: "Chemical Reactions and Equations",
            sections: [
              {
                type: "InText Questions",
                questions: [
                  {
                    id: 1,
                    question: "Why should a magnesium ribbon be cleaned before burning in air?",
                    answer: "A magnesium ribbon should be cleaned before burning in air because magnesium reacts with oxygen slowly to form magnesium oxide, which prevents the burning of magnesium. The layer of magnesium oxide should be removed by sandpaper.",
                    marks: 5
                  },
                  {
                    id: 2,
                    question: "Write the balanced equation for the following chemical reactions.\n(i) Hydrogen + Chlorine → Hydrogen chloride\n(ii) Barium chloride + Aluminium sulphate → Barium sulphate + Aluminium chloride.",
                    answer: {
                      i: "H2 + Cl2 → 2HCl",
                      ii: "3BaCl2 + Al2(SO4)3 → 3BaSO4 + 2AlCl3"
                    },
                    marks: 5
                  }
                ]
              },
              {
                type: "Textbook Questions",
                questions: [
                  {
                    id: 1,
                    question: "Which of the following statements about the reaction below are incorrect?\n2PbO(s) + C(s) → 2Pb(s) + CO2(g)\n(a) Lead is getting reduced.\n(b) Carbon dioxide is getting oxidised.\n(c) Carbon is getting oxidised.\n(d) Lead oxide is getting reduced.\n(i) (a) and (b)\n(ii) (a) and (c)\n(iii) (a), (b) and (c)\n(iv) all",
                    answer: "(i) (a) and (b)",
                    marks: 5
                  },
                  {
                    id: 2,
                    question: "Fe2O3 + 2Al → Al2O3 + 2Fe\nThe above reaction is an example of\n(a) combination reaction.\n(b) double displacement reaction.\n(c) decomposition reaction.\n(d) displacement reaction.",
                    answer: "(d) displacement reaction",
                    marks: 5
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        class: 10,
        board: "GSEB",
        subject: "Social Science",
        chapters: [
          {
            id: 1,
            name: "Heritage of India",
            sections: [
              {
                type: "Detailed Questions",
                questions: [
                  {
                    id: 1,
                    question: "Give detail of the Aryan and Dravidian Culture.",
                    answer: {
                      Dravidians: [
                        "They originally belonged to India and were descendants of the Stone Age civilization.",
                        "Created the Mohenjodaro culture and had their own language and culture.",
                        "Introduced the worship of nature, animals, and deities, influencing the concept of Parvati and Shiva as mother and father.",
                        "Developed traditions like using 'dhup', 'deep', and 'aarti' in worship.",
                        "They excelled in crafts and arts like weaving, spinning, and boat-making.",
                        "After Aryan dominance, many Dravidians migrated to South India, contributing to languages like Tamil, Telugu, Kannada, and Malayalam."
                      ],
                      Aryans: [
                        "Nordic-Aryans created the Aryan civilization and were nature lovers who worshipped natural elements.",
                        "Inhabited the Aryavarta region, also known as 'Sapta Sindhu', extending to Mithila in the east and Vindhyachal in the south.",
                        "Contributed to practices like performing yagyas, reciting Vedas, and composing hymns.",
                        "Spread across Bharatbhumi, Bharatkhand, and Bharat Varsha, named after the Arya Bharat or Bharat tribe."
                      ]
                    },
                    marks: 5
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    const subjectData = mockData.find(
      item => item.class === classNumber && item.board === board && item.subject === subject
    );

    if (subjectData) {
      const allQuestions = subjectData.chapters.flatMap(chapter =>
        chapter.sections.flatMap(section =>
          section.questions.map(q => ({ ...q, chapterId: chapter.id, sectionType: section.type }))));

      const selected = questions.map(questionKey => {
        const [chapterId, sectionType, questionId] = questionKey.split('-');
        return allQuestions.find(
          q => q.chapterId === parseInt(chapterId) && q.sectionType === sectionType && q.id === parseInt(questionId)
        );
      }).filter(q => q !== undefined);

      setSelectedQuestions(selected);
    }
  }, [classNumber, board, medium, subject, chapters, questions]);

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
      <div
        id="examPaper"
        className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
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
      <div
        id="answerKey"
        className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto mt-8">
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

