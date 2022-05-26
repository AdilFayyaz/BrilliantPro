import {AssessmentInCourse, CourseDBInterface} from "./CourseDBInterface";
import {LearnerInterface} from "./LearnerInterface";

export interface CourseLearnerInterface extends CourseDBInterface{
  learnerDetails: LearnerInterface[]
}

