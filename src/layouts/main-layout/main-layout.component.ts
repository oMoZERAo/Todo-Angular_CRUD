import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../app/navbar/navbar.component';
import { FooterComponent } from '../../app/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styles: [
    `
      @media (min-width: 992px) {
        .custom-height {
          min-height: 75vh !important;
        }
      }

      @media (max-width: 991px) {
        .custom-height {
          min-height: 66vh !important;
        }
      }
    `,
  ],
})
export class MainLayoutComponent {}
