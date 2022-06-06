import { Component, OnInit } from '@angular/core';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { LearnerService } from '../services/learner.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

    getCourseName(){
      this.coursesService.getAllInCourse(this.courseId).subscribe(
        (data)=>{
          this.courseName = data[0].name
        }
      )
    }
    constructor(private route: ActivatedRoute, private coursesService: CoursesService, private learnerService: LearnerService) {
      this.courseId = this.route.snapshot.paramMap.get('courseId');
      this.getCourseName()
      this.amount = this.route.snapshot.paramMap.get('amount');
      this.username = this.route.snapshot.paramMap.get('username');
      console.log(this.courseId)
    }
    username: any;
    amount:any;
    courseId: any;
    courseName: any;

    public payPalConfig ?: IPayPalConfig;

    ngOnInit(): void {

      if(this.courseId && this.amount){
        this.initConfig(this.courseId, this.amount);
      }
    }
  
    private initConfig(courseId: string, amount: string): void {
      this.payPalConfig = {
        currency: 'USD',
        clientId: 'AZuv3DVSf37_4ieucjlsZruPzUMkm5rAnID_pM5x3G_JGvk8pjblIa4phHMYZuW391nYA-vDoPWyVRTW', 
        createOrderOnClient: (data) => <ICreateOrderRequest> {
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: amount,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: amount
                }
              }
            },
            items: [{
              name: courseId,
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'USD',
                value: amount,
              },
            }]
          }]
        },
        advanced: {
          commit: 'true'
        },
        style: {
          label: 'paypal',
          layout: 'vertical',
          size: 'small',
          color: 'blue',
          shape: 'rect'
        },
        onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get().then((details: any) => {
            console.log('onApprove - you can get full order details inside onApprove: ', details);
            this.learnerService.addNewCourseToLearner(this.username, this.courseId).subscribe(
              (data)=>{
                console.log("course added")
              }
            )
          });
  
        },
        onClientAuthorization: (data) => {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        },
        onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
        },
        onError: err => {
          console.log('OnError', err);
        },
        onClick: (data, actions) => {
          console.log('onClick', data, actions);
        }
      };
    }


}
