import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function ClassSelector({
  subjectData,
  onSelectClass,
  onSelectBoard,
  onSelectMedium
}) {
  const [classNumber, setClassNumber] = useState(null)
  const [board, setBoard] = useState(null)
  const [medium, setMedium] = useState(null)
  const [availableClasses, setAvailableClasses] = useState([])
  const [availableBoards, setAvailableBoards] = useState([])
  const [availableMediums, setAvailableMediums] = useState([])

  useEffect(() => {
    const classes = [...new Set(subjectData.map(item => item.class))]
    setAvailableClasses(classes)
  }, [subjectData])

  useEffect(() => {
    if (classNumber) {
      const boards = [...new Set(
        subjectData.filter(item => item.class === classNumber).map(item => item.board)
      )]
      setAvailableBoards(boards)
    }
  }, [classNumber, subjectData])

  useEffect(() => {
    if (classNumber && board) {
      const mediums = [...new Set(
        subjectData.filter(item => item.class === classNumber && item.board === board).flatMap(item => {
          if (item.medium) return [item.medium];
          if (item.subjects) {
            return item.subjects.flatMap(subject => subject.mediums ? subject.mediums.map(m => m.language) : []);
          }
          return [];
        })
      )]
      setAvailableMediums(mediums)
    }
  }, [classNumber, board, subjectData])

  const handleClassChange = (value) => {
    const selectedClass = parseInt(value)
    setClassNumber(selectedClass)
    onSelectClass(selectedClass)
    setBoard(null)
    setMedium(null)
  }

  const handleBoardChange = (value) => {
    setBoard(value)
    onSelectBoard(value)
    setMedium(null)
  }

  const handleMediumChange = (value) => {
    setMedium(value)
    onSelectMedium(value)
  }

  return (
    (<div className="mb-4 space-y-4">
      <div>
        <Label htmlFor="class">Class</Label>
        <Select onValueChange={handleClassChange} value={classNumber?.toString()}>
          <SelectTrigger id="class">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {availableClasses.map((c) => (
              <SelectItem key={c} value={c.toString()}>{c}th</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {classNumber && (
        <div>
          <Label htmlFor="board">Board</Label>
          <Select onValueChange={handleBoardChange} value={board || ''}>
            <SelectTrigger id="board">
              <SelectValue placeholder="Select Board" />
            </SelectTrigger>
            <SelectContent>
              {availableBoards.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {classNumber && board && (
        <div>
          <Label htmlFor="medium">Medium</Label>
          <Select onValueChange={handleMediumChange} value={medium || ''}>
            <SelectTrigger id="medium">
              <SelectValue placeholder="Select Medium" />
            </SelectTrigger>
            <SelectContent>
              {availableMediums.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>)
  );
}

