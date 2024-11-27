import React, { useState, useEffect } from "react";

export function ChapterSelector({
  classNumber,
  board,
  medium,
  subject,
  onSelectChapters
}) {
  const [chapters, setChapters] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    const mockData = [
      {
        class: 10,
        board: "GSEB",
        subject: "Science",
        chapters: [
          { id: 1, name: "Chemical Reactions and Equations" }
        ]
      },
      {
        class: 10,
        board: "GSEB",
        subject: "Social Science",
        chapters: [
          { id: 1, name: "Heritage of India" }
        ]
      }
    ];
    const subjectData = mockData.find(
      item => item.class === classNumber && item.board === board && item.subject === subject
    );
    setChapters(subjectData ? subjectData.chapters : []);
  }, [classNumber, board, medium, subject]);

  const handleChapterChange = (chapterId) => {
    setSelectedChapters((prev) => {
      if (prev.includes(chapterId)) {
        return prev.filter((id) => id !== chapterId);
      } else {
        return [...prev, chapterId];
      }
    });
  };

  useEffect(() => {
    onSelectChapters(selectedChapters);
  }, [selectedChapters, onSelectChapters]);

  return (
    (<div className="mb-4">
      <h3 className="font-bold mb-2">Select Chapters:</h3>
      {chapters.map((chapter) => (
        <div key={chapter.id} className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedChapters.includes(chapter.id)}
              onChange={() => handleChapterChange(chapter.id)}
              className="mr-2" />
            {chapter.name}
          </label>
        </div>
      ))}
    </div>)
  );
}

