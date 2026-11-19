import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { FooterComponent } from './shared/components/footer.component';
import { ToastContainerComponent } from './shared/components/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastContainerComponent],
  template: `
    <a class="skip-link" href="#contenu">Aller au contenu</a>
    <app-navbar></app-navbar>
    <main id="contenu" class="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-toast-container></app-toast-container>
  `
})
export class AppComponent {}
