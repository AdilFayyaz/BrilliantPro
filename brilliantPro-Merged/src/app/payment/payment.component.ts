import { Component, OnInit } from '@angular/core';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
    public payPalConfig ?: IPayPalConfig;

    ngOnInit(): void {
      this.initConfig();
    }
  
    private initConfig(): void {
      this.payPalConfig = {
        currency: 'EUR',
        clientId: 'AZuv3DVSf37_4ieucjlsZruPzUMkm5rAnID_pM5x3G_JGvk8pjblIa4phHMYZuW391nYA-vDoPWyVRTW', 
        createOrderOnClient: (data) => <ICreateOrderRequest> {
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'EUR',
              value: '0.01',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '0.01'
                }
              }
            },
            items: [{
              name: 'The Swag Coder',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'EUR',
                value: '0.01',
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
