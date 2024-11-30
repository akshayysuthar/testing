import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ChapterSelector({ questionBankData, onSelectQuestions }) {
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    const savedChapterId = localStorage.getItem("selectedChapterId");
    const savedQuestions = localStorage.getItem("selectedQuestions");

    if (savedChapterId) {
      setSelectedChapterId(savedChapterId);
    }

    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions);
      setSelectedQuestions(parsedQuestions);
      onSelectQuestions(parsedQuestions);
    }
  }, [onSelectQuestions]);

  useEffect(() => {
    if (selectedChapterId) {
      localStorage.setItem("selectedChapterId", selectedChapterId);
    } else {
      localStorage.removeItem("selectedChapterId");
    }

    if (selectedQuestions.length > 0) {
      localStorage.setItem(
        "selectedQuestions",
        JSON.stringify(selectedQuestions)
      );
    } else {
      localStorage.removeItem("selectedQuestions");
    }
  }, [selectedChapterId, selectedQuestions]);

  const handleChapterChange = (chapterId) => {
    setSelectedChapterId(chapterId);
    setSelectedQuestions([]);
    onSelectQuestions([]);
  };

  const handleQuestionChange = (question, chapterNumber, marks) => {
    setSelectedQuestions((prev) => {
      const isSelected = prev.some((q) => q.id === question.id);
      const updated = isSelected
        ? prev.filter((q) => q.id !== question.id) // Remove deselected question
        : [
            ...prev,
            {
              id: question.id,
              question: question.question,
              answer: question.answer,
              chapterNumber,
              marks,
              type: question.type,
            }, // Add selected question with metadata
          ];
      onSelectQuestions(updated);
      return updated;
    });
  };

  const selectedChapter = questionBankData.find(
    (chapter) => chapter.id === selectedChapterId
  );

  // console.log(questionBankData);
  return (
    <div className="space-y-6">
      {/* Display Chapter List */}

      <Label>Select Chapter</Label>

      {questionBankData.map((chapter) => (
        <div key={chapter.id}>
          {/* Unique key based on chapter ID */}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => handleChapterChange(chapter.id)}
          >
            {chapter.subject}
          </button>
          {selectedChapterId === chapter.id && (
            <Accordion type="single" collapsible className="w-full mt-4">
              {chapter.chapters.map((section) => (
                <AccordionItem
                  key={section.id || section.name}
                  value={section.name}
                >
                  {/* Unique key based on section ID or name */}
                  <AccordionTrigger>{section.name}</AccordionTrigger>
                  <AccordionContent>
                    {section.sections.map((type) => (
                      <Accordion
                        type="single"
                        collapsible
                        key={`${type.type}-${section.id}`}
                      >
                        {/* Unique key based on type and section */}
                        <AccordionItem
                          key={`item-${type.type}-${section.id}`}
                          value={`item-${type.type}`}
                        >
                          <AccordionTrigger>{type.type}</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {type.questions.map((question) => (
                                <div
                                  key={question.id} // Unique key for each question
                                  className="flex items-center space-x-3"
                                >
                                  <Checkbox
                                    id={`question-${question.id}`}
                                    checked={selectedQuestions.some(
                                      (q) => q.id === question.id
                                    )}
                                    onCheckedChange={() =>
                                      handleQuestionChange(
                                        question,
                                        section.name,
                                        question.marks
                                      )
                                    }
                                  />
                                  <Label htmlFor={`question-${question.id}`}>
                                    {question.question} - {question.marks} Marks
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      ))}
    </div>
  );
}
