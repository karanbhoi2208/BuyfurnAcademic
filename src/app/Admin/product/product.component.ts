import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ProductService } from '../../Service/product.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent implements OnInit {

  products: any = []
  loading: boolean = true;

  pageNumber: number = 0;
  searchKey: string = '';
  showLoadButton: boolean = false;
  constructor(private productService: ProductService) { }
  ngOnInit(): void {
    this.getAllProducts()
  }

  getAllProducts() {
    this.loading = true
    this.productService.getAllProducts(this.pageNumber, this.searchKey).subscribe(response => {
      if (response.length == 12) {
        this.showLoadButton = true;
      }
      else {
        this.showLoadButton = false;
      }
      this.products = [...this.products, ...response];
      this.loading = false
    },
      error => {
        console.log(error);
        this.loading = false;

      })
  }
  deleteProduct(id: any) {
    this.productService.deleteProductById(id).subscribe(
      response => {

        Swal.fire("Product deleted!");

        this.products = this.products.filter((product: any) => product.id !== id);
      }, error => {
        console.log(error);

      });

  }

  loadMoreProducts() {

    this.pageNumber++;
    this.getAllProducts()

  }

  onSearch(event: Event) {
    event.preventDefault();
    this.pageNumber = 0; // Reset page number for new search
    this.products = []; // Clear current products
    this.getAllProducts();
  }

  onSearchChange(searchKey: string) {
    this.searchKey = searchKey;
  }


}
