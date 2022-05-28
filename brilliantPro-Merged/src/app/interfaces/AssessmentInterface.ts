export interface AssessmentInterface{
  "_id": string,
  "name": string,
  "minPassing": number,
  "time": number,
  "questions": QuestionInterface[]
}

interface QuestionInterface{
  "question": string,
  "option1": string,
  "option2": string,
  "option3": string,
  "option4": string,
  "answer": string
}
