import {CoursesInterface} from "./coursesInterface";

export interface CourseDBInterface extends CoursesInterface{
  "materials": string[],
  "assessments": AssessmentInCourse[],
  "overview": string,
  "image": string,
  "enrollmentLink": string,
  "minPassScore": number,
  "startDate": number,
  "endDate": number
}


export interface AssessmentInCourse{
  "assessmentID":string,
  "weightage":number
}
