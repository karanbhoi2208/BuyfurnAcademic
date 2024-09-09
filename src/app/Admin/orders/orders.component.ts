import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../Service/product.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { response } from 'express';
import { BlobOptions } from 'buffer';
import { OrderDetails } from '../../Interface/orderdetails';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  filterOrders(arg0: string) {
    throw new Error('Method not implemented.');
  }
  orderDetails: any = [];
  isOrderIsEmpty: boolean = false;
  notDelivered: boolean = true
  constructor(private productService: ProductService) { }

  status: string = "all"
  ngOnInit(): void {
    this.getOrderDetails(this.status)
  }


  getOrderDetails(status: any) {
    this.productService.getAllOrderDetails(status).subscribe(
      response => {
        this.orderDetails = response;
        if (this.orderDetails.length == 0) {
          this.isOrderIsEmpty = true
        }

      },
      error => {
        console.log(error);
      }
    );
  }

  orderIsDelivered(id: any): boolean {
    debugger
    let isDelivered = false;

    this.orderDetails.forEach((order: any) => {
      if (order.orderId === id) {
        if (order.orderStatus === 'Delivered') {
          isDelivered = true
        };
      }
    });

    return isDelivered;
  }

  markAsDeliverd(id: any) {
    this.productService.markOrderAsDelivered(id).subscribe(
      response => {
        this.getOrderDetails("Placed")
        this.notDelivered = false
      }
      ,
      error => {
        console.log(error);

      }
    )
  }
}
