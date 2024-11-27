"use client";
import { useState, useEffect } from "react";
import { ClassSelector } from "@/components/ClassSelector";
import { SubjectSelector } from "@/components/SubjectSelector";
import { ChapterSelector } from "@/components/ChapterSelector";
import { QuestionSelector } from "@/components/QuestionSelector";
import { GeneratedExam } from "@/components/GeneratedExam";
import { PdfDownload } from "@/components/PdfDownload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExamPaperGenerator() {
  const [generationType, setGenerationType] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedMedium, setSelectedMedium] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [totalMarks, setTotalMarks] = useState(100);
  const [remainingMarks, setRemainingMarks] = useState(100);
  const [subjectData, setSubjectData] = useState([]);
  const [questionBankData, setQuestionBankData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectResponse = await fetch("/data.json");
        const subjectData = await subjectResponse.json();
        console.log(subjectData); // Logs the data from the JSON file
        setSubjectData(subjectData);

        const questionBankResponse = await await fetch("./questionbank.json");
        const questionBankData = await questionBankResponse.json();
        console.log(questionBankData);
        
        setQuestionBankData(questionBankData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleGenerationTypeChange = (type) => {
    setGenerationType(type);
    setSelectedSubject(null);
    setSelectedChapters([]);
    setSelectedQuestions([]);
    setRemainingMarks(totalMarks);
  };

  const handleTotalMarksChange = (e) => {
    const newTotalMarks = parseInt(e.target.value) || 0;
    setTotalMarks(newTotalMarks);
    setRemainingMarks(newTotalMarks - (totalMarks - remainingMarks));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Exam Paper Generator</h1>
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${
            generationType === "manual"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleGenerationTypeChange("manual")}
        >
          Manual Generate
        </button>
        <button
          className={`px-4 py-2 rounded ${
            generationType === "auto" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleGenerationTypeChange("auto")}
        >
          Auto Generate
        </button>
      </div>
      <div className="mb-4">
        <Label htmlFor="totalMarks">Total Marks</Label>
        <Input
          id="totalMarks"
          type="number"
          value={totalMarks}
          onChange={handleTotalMarksChange}
          className="w-24"
        />
      </div>
      {generationType && (
        <ClassSelector
          subjectData={subjectData}
          onSelectClass={setSelectedClass}
          onSelectBoard={setSelectedBoard}
          onSelectMedium={setSelectedMedium}
        />
      )}
      {selectedClass && selectedBoard && selectedMedium && (
        <SubjectSelector
          subjectData={subjectData}
          classNumber={selectedClass}
          board={selectedBoard}
          medium={selectedMedium}
          onSelectSubject={setSelectedSubject}
        />
      )}
      {selectedSubject && generationType === "manual" && (
        <ChapterSelector
          subjectData={subjectData}
          questionBankData={questionBankData}
          classNumber={selectedClass}
          board={selectedBoard}
          medium={selectedMedium}
          subject={selectedSubject}
          onSelectChapters={setSelectedChapters}
        />
      )}
      {selectedChapters.length > 0 && generationType === "manual" && (
        <QuestionSelector
          questionBankData={questionBankData}
          classNumber={selectedClass}
          board={selectedBoard}
          medium={selectedMedium}
          subject={selectedSubject}
          chapters={selectedChapters}
          onSelectQuestions={setSelectedQuestions}
          totalMarks={totalMarks}
          remainingMarks={remainingMarks}
          setRemainingMarks={setRemainingMarks}
        />
      )}
      {((selectedQuestions.length > 0 && generationType === "manual") ||
        generationType === "auto") && (
        <div>
          <div id="examPaperContent">
            <GeneratedExam
              questionBankData={questionBankData}
              generationType={generationType}
              classNumber={selectedClass}
              board={selectedBoard}
              medium={selectedMedium}
              subject={selectedSubject}
              chapters={selectedChapters}
              questions={selectedQuestions}
              totalMarks={totalMarks}
            />
          </div>
          <div className="mt-4 flex justify-center">
            <PdfDownload contentId="examPaperContent" />
          </div>
        </div>
      )}
    </div>
  );
}
