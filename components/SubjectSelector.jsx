import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function SubjectSelector({
  subjectData,
  classNumber,
  board,
  medium,
  onSelectSubject,
  initialSubject
}) {
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(initialSubject)

  useEffect(() => {
    const filteredSubjects = subjectData
      .filter(item => item.class === classNumber && item.board === board)
      .flatMap(item => {
        if (item.subject) return [item.subject]
        if (item.subjects) {
          return item.subjects.filter(subject => 
            !subject.mediums || subject.mediums.some(m => m.language === medium)).map(subject => subject.name);
        }
        return []
      })
    setSubjects([...new Set(filteredSubjects)])
  }, [subjectData, classNumber, board, medium])

  const handleSubjectChange = (value) => {
    setSelectedSubject(value)
    onSelectSubject(value)
  }

  return (
    (<div>
      <Label htmlFor="subject">Subject</Label>
      <Select onValueChange={handleSubjectChange} value={selectedSubject || undefined}>
        <SelectTrigger id="subject">
          <SelectValue placeholder="Select Subject" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((subject) => (
            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>)
  );
}

