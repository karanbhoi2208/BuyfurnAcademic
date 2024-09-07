import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../Service/product.service';
import { LoadingComponent } from '../loading/loading.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [RouterLink, LoadingComponent, NgFor, NgIf],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.css'
})
export class ProductSectionComponent implements OnChanges {
  isLoading: boolean = false;
  pageNumber: number = 0;
  showLoadButton: boolean = false;
  nofiltereditem: boolean = false;
  products: any[] = [];
  @Input() filterText: string = '';

  constructor(private productService: ProductService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterText']) {
      this.pageNumber = 0;
      this.products = [];
      this.getAllProducts();
    }
  }

  getAllProducts() {
    this.isLoading = true;
    this.productService.getAllProducts(this.pageNumber, this.filterText).subscribe(
      (response) => {
        if (response.length > 0) {
          this.products = [...this.products, ...response];
          this.showLoadButton = response.length === 12;
          this.nofiltereditem = false;
        } else {
          this.showLoadButton = false;
          this.nofiltereditem = this.pageNumber === 0;
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching products', error);
        this.isLoading = false;
      }
    );
  }

  loadMoreProducts() {
    this.pageNumber++;
    this.getAllProducts();
  }
}
