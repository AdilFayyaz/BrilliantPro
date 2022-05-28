export interface LearnerInterface{
 "_id": string,
  "username": string,
  "password": string,
  "courses": CourseInLearner[],
  "certificates": string[]
}

export interface CourseInLearner{
  "courseId": string,
  "status": string,
  "progress": number,
  "score": number,
  "attemptNo": number,
  "assessmentsDone": AssessmentInLearner[]
}

export interface AssessmentInLearner{
  "assessmentID": string,
  "grade": string,
  "passValue": boolean,
  "quesSummary": string,
  "correctQ": number,
  "incorrectQ": number
}
