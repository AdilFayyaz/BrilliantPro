export interface CourseLearnerInterface{
  _id:string,
  name:string,
  materials:any[],
  assessments:any[],
  overview:string,
  image:string,
  enrollmentLink:string,
  minPassScore:number,
  startDate:number,
  endDate:number,
  learnerDetails: learnerDetails[]
}

export interface learnerDetails{
  _id:string,
  courses:any[],
}
