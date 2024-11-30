"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GeneratedExam({
  selectedQuestions,
  instituteName,
  standard,
  subject,
  chapters,
  studentName,
  teacherName,
  totalMarks,
}) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportedQuestionId, setReportedQuestionId] = useState(null);
  const [reportType, setReportType] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleReportQuestion = (questionId) => {
    setReportedQuestionId(questionId);
    setReportDialogOpen(true);
  };

  const handleSubmitReport = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const reportData = {
      questionId: reportedQuestionId,
      reportType: reportType,
      description: formData.get("description"),
      correctAnswer: correctAnswer,
    };
    console.log("Report submitted:", reportData);
    setReportDialogOpen(false);
    setReportType("");
    setCorrectAnswer("");
  };

  const renderQuestion = (question, index) => {
    return (
      <div key={question.id} className="mb-4">
        <p>{`${index + 1}. ${question.question}`}</p>
        {question.image && (
          <img
            src={question.image}
            alt={`Question ${index + 1}`}
            className="mt-2 mb-2 max-w-full rounded shadow"
          />
        )}
        {question.type === "MCQ" &&
          Object.entries(question.options).map(([key, value]) => (
            <p key={key}>{`(${key}) ${value}`}</p>
          ))}
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            ({question.marks} marks)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReportQuestion(question.id)}
          >
            Report
          </Button>
        </div>
      </div>
    );
  };

  const groupedQuestions = selectedQuestions.reduce((acc, question) => {
    const key = question.type;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(question);
    return acc;
  }, {});

  return (
    <div className="mt-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{instituteName}</h2>
          <p className="text-lg">
            Standard: {standard} | Subject: {subject}
          </p>
          <p className="text-lg">Chapter: {chapters}</p>
          <p className="text-lg">Student's Name: {studentName}</p>
          <p className="text-lg">Teacher Name: {teacherName}</p>
          <p className="text-lg">Total Marks: {totalMarks}</p>
          <p className="text-lg">Time: {Math.ceil(totalMarks * 1.5)} minutes</p>
        </div>

        {groupedQuestions &&
          Object.entries(groupedQuestions).map(
            ([type, questions], typeIndex) => (
              <div key={type} className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {`Q. ${typeIndex + 1}. ${type}`}
                </h3>
                {questions.map((question, index) =>
                  renderQuestion(question, index)
                )}
              </div>
            )
          )}

        <div className="text-center mt-8">
          <p className="text-xl font-bold">All the Best</p>
        </div>
      </div>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report a Problem</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReport} className="space-y-4">
            <div>
              <Label htmlFor="reportType">Issue Type</Label>
              <Select
                onValueChange={(value) => setReportType(value)}
                value={reportType}
              >
                <SelectTrigger id="reportType">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wrongAnswer">Wrong Answer</SelectItem>
                  <SelectItem value="spellingMistake">
                    Spelling Mistake
                  </SelectItem>
                  <SelectItem value="noAnswer">No Answer Shown</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {reportType === "wrongAnswer" && (
              <div>
                <Label htmlFor="correctAnswer">Correct Answer</Label>
                <Textarea
                  id="correctAnswer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  placeholder="Please provide the correct answer"
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please describe the issue in detail"
                required
              />
            </div>
            <Button type="submit">Submit Report</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
