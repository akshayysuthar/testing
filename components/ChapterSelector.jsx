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

  const handleQuestionChange = (question) => {
    setSelectedQuestions((prev) => {
      const isSelected = prev.some((q) => q.id === question.id);
      const updated = isSelected
        ? prev.filter((q) => q.id !== question.id)
        : [...prev, question];
      onSelectQuestions(updated);
      return updated;
    });
  };

  const selectedChapter = questionBankData.find(
    (chapter) => chapter.id === selectedChapterId
  );

  console.log(questionBankData);
  console.log(selectedQuestions);

  return (
    <div className="space-y-6">
      {/* Display Chapter List */}
      <div>
        <Label>Select Chapter</Label>
        <div className="space-y-4">
          {questionBankData.map((chapter) => (
            <div key={chapter.id}>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => handleChapterChange(chapter.id)}
              >
                {chapter.subject}
              </button>
              {selectedChapterId === chapter.id && (
                <Accordion type="single" collapsible className="w-full mt-4">
                  {chapter.chapters.map((section) => (
                    <AccordionItem key={section.name} value={section.name}>
                      <AccordionTrigger>{section.name}</AccordionTrigger>
                      <AccordionContent>
                        {section.sections.map((type) => {
                          <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                              <AccordionTrigger>[type.type]</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {section.sections.map((question) => (
                                    <div
                                      key={question.id}
                                      className="flex items-center space-x-3"
                                    >
                                      <Checkbox
                                        id={`question-${question.id}`}
                                        checked={selectedQuestions.some(
                                          (q) => q.id === question.id
                                        )}
                                        onCheckedChange={() =>
                                          handleQuestionChange(question)
                                        }
                                      />
                                      <Label
                                        htmlFor={`question-${question.id}`}
                                      >
                                        {question.question}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>;
                        })}
                        {section.sections.map((type) => (
                          // [type.type]
                          <Accordion type="single" collapsible key={type.type}>
                            <AccordionItem value={`item-${type.type}`}>
                              <AccordionTrigger>{type.type}</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {type.questions.map((question) => (
                                    <div
                                      key={`question-${question.id}`}
                                      className="flex items-center space-x-3"
                                    >
                                      <Checkbox
                                        id={`question-${question.id}`} // Use question ID to ensure uniqueness
                                        checked={selectedQuestions.some(
                                          (q) => q.id === question.id
                                        )}
                                        onCheckedChange={() =>
                                          handleQuestionChange(question)
                                        }
                                      />
                                      <Label
                                        htmlFor={`question-${question.id}`}
                                      >
                                        {question.question}
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
      </div>
    </div>
  );
}
