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

  function generateUniqueId(prefix) {
    const timestamp = Date.now(); // Get current timestamp
    const random = Math.floor(Math.random() * 10000); // Generate a random number
    return `${prefix}-${timestamp}-${random}`; // Combine prefix, timestamp, and random number
  }

  // Example usage:
  const chapterId = generateUniqueId("ch"); // e.g., ch-1613508463847-2459
  const questionId = generateUniqueId("q"); // e.g., q-1613508463847-3218
  const sectionId = generateUniqueId("sec"); // e.g., sec-1613508463847-5249

  const keydiv = chapterId + questionId + sectionId;

  console.log(chapterId, questionId, sectionId);

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

  return (
    <>
      <div>
        {/* Display Chapter List */}

        <Label>Select Chapter</Label>

        {questionBankData.map((chapter) => (
          <div key={chapter.id}>
            {/* Use chapter.id as the key */}
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
                    key={section.id} // Ensure the section has a unique key
                    value={section.name}
                  >
                    <AccordionTrigger>{section.name}</AccordionTrigger>
                    <AccordionContent>
                      {section.sections.map((type) => (
                        <Accordion
                          type="single"
                          collapsible
                          key={`${type.type}-${section.id}`} // Combine section and type for uniqueness
                        >
                          <AccordionItem
                            key={`item-${type.type}-${section.id}`} // Ensure item has a unique key
                            value={`item-${type.type}`}
                          >
                            <AccordionTrigger>{type.type}</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                {type.questions.map((question) => (
                                  <div
                                    key={`unique-050505${question.id}`} // Use question.id as the unique key
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
                                      {question.question} - {question.marks}{" "}
                                      Marks
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
    </>
  );
}
