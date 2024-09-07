import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../Service/product.service';
import { Product } from '../../Interface/product';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserService } from '../../Service/user.service';
import { OrderDetails } from '../../Interface/orderdetails';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { filter } from 'rxjs';
import e, { response } from 'express';
import { error } from 'console';
import { UserAuthService } from '../../Service/user-auth.service';
// import Razorpay from 'razorpay';
declare var Razorpay: any;
@Component({
  selector: 'app-buy-product',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor],
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css']
})
export class BuyProductComponent implements OnInit {

  productQuantities: { [key: number]: number } = {};

  orderDetails: OrderDetails = {
    fullName: '',
    address: {},
    contactNumber: '',
    orderquantities: [],
    transactionId: ''
  };

  products: Product[] | undefined;
  user: any = {};

  isSingleProductCheckout: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private userAuthService: UserAuthService
  ) { }

  ngOnInit(): void {
    this.loadUserData();

    this.route.queryParams.subscribe(params => {
      this.isSingleProductCheckout = params['isSingleProductCheckout'] === 'true';
    });

    this.products = this.route.snapshot.data['productDetails'];

    if (this.products) {
      this.products.forEach(product => {
        this.productQuantities[product.id] = 1;
      });
    }
  }

  loadUserData() {
    if (typeof window !== 'undefined' && localStorage.getItem("basicAuth")) {
      this.userService.login().subscribe(
        response => {
          this.user = response;
          this.orderDetails.fullName = this.user.name;
          this.orderDetails.address = this.user.address;
          this.orderDetails.contactNumber = this.user.contactNumber;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  placeOrder(orderForm: NgForm) {
    const formValues = orderForm.value;

    this.orderDetails.fullName = formValues.fullName;
    this.orderDetails.address = {
      address: formValues.address,
      pincode: formValues.pincode,
      city: formValues.city,
      state: formValues.state
    };
    this.orderDetails.contactNumber = formValues.contactNumber;

    this.orderDetails.orderquantities = this.getQuntity()

    // console.log(this.orderDetails);

    this.productService.placeOrder(this.orderDetails, this.isSingleProductCheckout).subscribe(
      (response) => {
        alert("Order Placed successfully");
        this.userAuthService.setOrderPlaced(true);
        this.router.navigate(['/orderplaced']);
      },
      (error) => {
        console.log("Place error", error);
      }
    );
  }

  getQuntity() {
    return Object.keys(this.productQuantities).map(productId => {
      return { productId: Number(productId), quantity: this.productQuantities[Number(productId)] };
    });
  }


  getCalculateTotal(price: number, productId: number): number {
    const quantity = this.productQuantities[productId] || 1;

    return price * quantity;
  }



  calculateGrandTotal() {
    if (!this.products) return 0;

    const total = this.products.reduce((accumulator, product) => {
      const quantity = this.productQuantities[product.id] || 1;
      return accumulator + (product.price * quantity);
    }, 0);

    return total;
  }


  createTransactionAndPlaceOrder(orderForm: NgForm) {
    let grandTotal = this.calculateGrandTotal()
    this.productService.createTransaction(grandTotal).subscribe(
      response => {
        // console.log(response);
        this.openTransactionModel(response, orderForm);
      },
      error => {
        console.log(error);

      }
    )
  }

  openTransactionModel(response: any, orderForm: NgForm) {
    var options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'BuyFurn',
      description: 'Payment of your shopping',
      image: 'https://img.freepik.com/premium-photo/modern-living-living-room-interior-has-yellow-armchair-empty-dark-white-wall-backgroud-ai_1028299-275.jpg?w=740',
      handler: (response: any) => {
        if (response.razorpay_payment_id && response != null) {
          this.processResponse(response, orderForm)
        }
        else {
          alert("Payment failed")
        }
      },
      prefill: {
        name: 'BuyFurn',
        email: 'buyfurn@gmail.com',
        contact: '9664800705',

      },
      notes: {
        address: 'Online Shopping'
      },
      theme: {
        color: '#3b5d50',
      }
    };

    var razorPayObject = new Razorpay(options);
    razorPayObject.open();

  }

  processResponse(resp: any, orderForm: NgForm) {
    this.orderDetails.transactionId = resp.razorpay_payment_id;
    this.placeOrder(orderForm);
    console.log(this.orderDetails);

  }
}
