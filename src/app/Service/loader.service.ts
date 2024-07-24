import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }
  private isLoading = false;

  show() {
    if (!this.isLoading) {
      this.isLoading = true;
      Swal.fire({
        title: 'Loading...',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    }
  }

  hide() {
    if (this.isLoading) {
      Swal.close();
      this.isLoading = false;
    }
  }
}
