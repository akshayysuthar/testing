"use client";

import { useState, useEffect } from "react";
import { ClassSelector } from "@/components/ClassSelector";
import { SubjectSelector } from "@/components/SubjectSelector";
import { ChapterSelector } from "@/components/ChapterSelector";
import { GeneratedExam } from "@/components/GeneratedExam";
import { PdfDownload } from "@/components/PdfDownload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExamPaperGenerator() {
  const [generationType, setGenerationType] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedMedium, setSelectedMedium] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [totalMarks, setTotalMarks] = useState(80);
  const [subjectData, setSubjectData] = useState([]);
  const [questionBankData, setQuestionBankData] = useState([]);
  const [generatedExam, setGeneratedExam] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectResponse = await fetch("./data.json");
        const subjectData = await subjectResponse.json();
        setSubjectData(subjectData);

        const questionBankResponse = await fetch("./questionbank.json");
        const questionBankData = await questionBankResponse.json();
        setQuestionBankData(questionBankData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Load saved state from localStorage
    const savedClass = localStorage.getItem("selectedClass");
    const savedBoard = localStorage.getItem("selectedBoard");
    const savedMedium = localStorage.getItem("selectedMedium");
    const savedSubject = localStorage.getItem("selectedSubject");
    const savedTotalMarks = localStorage.getItem("totalMarks");
    const savedGenerationType = localStorage.getItem("generationType");

    if (savedClass) setSelectedClass(parseInt(savedClass));
    if (savedBoard) setSelectedBoard(savedBoard);
    if (savedMedium) setSelectedMedium(savedMedium);
    if (savedSubject) setSelectedSubject(savedSubject);
    if (savedTotalMarks) setTotalMarks(parseInt(savedTotalMarks));
    if (savedGenerationType) setGenerationType(savedGenerationType);
  }, []);

  useEffect(() => {
    // Save state to localStorage whenever it changes
    if (selectedClass)
      localStorage.setItem("selectedClass", selectedClass.toString());
    if (selectedBoard) localStorage.setItem("selectedBoard", selectedBoard);
    if (selectedMedium) localStorage.setItem("selectedMedium", selectedMedium);
    if (selectedSubject)
      localStorage.setItem("selectedSubject", selectedSubject);
    localStorage.setItem("totalMarks", totalMarks.toString());
    if (generationType) localStorage.setItem("generationType", generationType);
  }, [
    selectedClass,
    selectedBoard,
    selectedMedium,
    selectedSubject,
    totalMarks,
    generationType,
  ]);

  const handleTotalMarksChange = (e) => {
    const newTotalMarks = parseInt(e.target.value) || 0;
    setTotalMarks(newTotalMarks);
  };

  const handleGenerate = () => {
    setGeneratedExam(true);
  };

  const handleGenerationTypeChange = (type) => {
    setGenerationType(type);
  };
  // console.log(selectedQuestions);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Exam Paper Generator
      </h1>
      <div className="flex items-center justify-center mb-4">
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
      <div className="space-y-4 grid grid-cols-1 justify-center gap-4 p-3">
        <ClassSelector
          subjectData={subjectData}
          onSelectClass={setSelectedClass}
          onSelectBoard={setSelectedBoard}
          onSelectMedium={setSelectedMedium}
          initialClass={selectedClass}
          initialBoard={selectedBoard}
          initialMedium={selectedMedium}
        />
        {selectedClass && selectedBoard && selectedMedium && (
          <SubjectSelector
            subjectData={subjectData}
            classNumber={selectedClass}
            board={selectedBoard}
            medium={selectedMedium}
            onSelectSubject={setSelectedSubject}
            initialSubject={selectedSubject}
          />
        )}
        <div>
          <Label htmlFor="totalMarks">Total Marks</Label>
          <Input
            id="totalMarks"
            type="number"
            value={totalMarks}
            onChange={handleTotalMarksChange}
            className="w-24"
          />
        </div>
        {selectedSubject && (
          <ChapterSelector
            questionBankData={questionBankData.filter(
              (item) =>
                item.class === selectedClass &&
                item.board === selectedBoard &&
                item.subject === selectedSubject
            )}
            onSelectQuestions={setSelectedQuestions}
          />
        )}

        <Button
          onClick={handleGenerate}
          disabled={selectedQuestions.length === 0}
        >
          Generate Exam Paper
        </Button>
      </div>
      {generatedExam && (
        <div className="mt-8">
          <div id="examPaperContent">
            <GeneratedExam
              selectedQuestions={selectedQuestions}
              classNumber={selectedClass}
              board={selectedBoard}
              medium={selectedMedium}
              subject={selectedSubject}
              totalMarks={totalMarks}
            />
          </div>
          <div className="mt-4 flex justify-center">
            <PdfDownload
              selectedQuestions={selectedQuestions} // Ensure this array is populated
              instituteName="ABC School"
              standard="10"
              subject="Science"
              chapters={["Life Processes"]}
              studentName="John Doe"
              teacherName="Mr. Smith"
              totalMarks={20}
            />
          </div>
        </div>
      )}
    </div>
  );
}
