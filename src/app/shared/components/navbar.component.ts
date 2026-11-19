import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataSaverService } from '../../core/services/data-saver.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header style="background: rgba(11, 17, 32, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); position: sticky; top: 0; z-index: 50;">
      <div class="app-container" style="display: flex; align-items: center; justify-content: space-between; height: 4.75rem;">
        
        <!-- Futuristic Brand Logo -->
        <a routerLink="/" style="display: flex; align-items: center; gap: 0.85rem; text-decoration: none;">
          <div style="width: 2.85rem; height: 2.85rem; border-radius: var(--radius-xl); background: var(--grad-cyber); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 1.15rem; font-family: var(--font-display);">
            F
          </div>
          <div>
            <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -0.04em; color: #ffffff; line-height: 1; display: flex; align-items: center; gap: 0.2rem;">
              FELC<span style="color: var(--neon-cyan);">.AI</span>
              <span class="pulsing-dot" style="margin-left: 0.4rem;" title="Système opérationnel"></span>
            </div>
            <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase;">
              Apprendre, prouver, être embauché
            </div>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-desktop" style="align-items: center; gap: 1.15rem;">
          <a routerLink="/parcours" routerLinkActive="active-nav" style="font-family: var(--font-display); font-weight: 600; font-size: 0.92rem; color: #cbd5e1;">
            Parcours
          </a>
          <a routerLink="/formations" routerLinkActive="active-nav" style="font-family: var(--font-display); font-weight: 600; font-size: 0.92rem; color: #cbd5e1;">
            Formations
          </a>
          <a routerLink="/offres" routerLinkActive="active-nav" style="font-family: var(--font-display); font-weight: 600; font-size: 0.92rem; color: #cbd5e1;">
            Emploi
          </a>
          <a routerLink="/forum" routerLinkActive="active-nav" style="font-family: var(--font-display); font-weight: 600; font-size: 0.92rem; color: #cbd5e1;">
            Forum
          </a>
          <a routerLink="/mes-candidatures" routerLinkActive="active-nav" style="font-family: var(--font-display); font-weight: 600; font-size: 0.92rem; color: #cbd5e1;">
            Candidatures
          </a>
          <a routerLink="/interview-coach" routerLinkActive="active-nav" style="font-family: var(--font-display); font-weight: 600; font-size: 0.92rem; color: #cbd5e1;">
            Entretien
          </a>
          <a 
            routerLink="/orientation" 
            routerLinkActive="active-nav" 
            class="badge badge-cyber"
            style="padding: 0.35rem 0.85rem; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; cursor: pointer;"
          >
            <span>✨</span> Moteur IA
          </a>
        </nav>

        <!-- Right Side: Data Saver & User Status & Actions -->
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          
          <!-- Data Saver Mode Toggle Button (Africa Low-Bandwidth Mode) -->
          <button 
            type="button"
            (click)="dataSaver.toggle()" 
            [title]="dataSaver.isEnabled() ? 'Mode Économie Data actif. Cliquez pour désactiver.' : 'Activer le mode économie data & frugal (recommandé pour 2G/3G)'"
            class="btn btn-sm"
            [ngClass]="dataSaver.isEnabled() ? 'btn-accent' : 'btn-ghost'"
            style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.78rem; padding: 0.35rem 0.65rem;"
          >
            <span>⚡</span>
            <span *ngIf="dataSaver.isEnabled()">Frugal ({{ dataSaver.savedMegabytes() }} Mo)</span>
            <span *ngIf="!dataSaver.isEnabled()">Éco Data</span>
          </button>

          <ng-container *ngIf="authService.isLoggedIn(); else guestTpl">
            
            <!-- Quick links according to role -->
            <div class="role-links" style="align-items: center; gap: 0.5rem;">
              <a 
                *ngIf="authService.userRole() === 'APPRENANT'" 
                routerLink="/mes-formations" 
                class="btn btn-outline btn-sm"
              >
                🎓 Mes Cours
              </a>
              <a 
                *ngIf="authService.userRole() === 'APPRENANT'" 
                routerLink="/portfolio/me" 
                class="btn btn-outline btn-sm"
              >
                💼 Mon Portfolio
              </a>
              <a 
                *ngIf="authService.userRole() === 'APPRENANT'" 
                routerLink="/mes-candidatures" 
                class="btn btn-outline btn-sm"
              >
                Suivi
              </a>
              <a 
                *ngIf="authService.userRole() === 'FORMATEUR'" 
                routerLink="/formateur/dashboard" 
                class="btn btn-outline btn-sm"
              >
                👨‍🏫 Espace Formateur
              </a>
              <a 
                *ngIf="authService.userRole() === 'ENTREPRISE'" 
                routerLink="/entreprise/offres" 
                class="btn btn-outline btn-sm"
              >
                🏢 Mes Offres
              </a>
              <a 
                *ngIf="authService.userRole() === 'ADMIN'" 
                routerLink="/admin" 
                class="btn btn-primary btn-sm"
              >
                ⚙️ Admin
              </a>
            </div>

            <!-- User Pill -->
            <div style="display: flex; align-items: center; gap: 0.65rem; padding: 0.35rem 0.75rem; background: rgba(255, 255, 255, 0.05); border-radius: var(--radius-full); border: 1px solid rgba(255, 255, 255, 0.12); backdrop-filter: blur(12px);">
              <div style="width: 2rem; height: 2rem; border-radius: 50%; background: var(--grad-cyber); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800; font-family: var(--font-display);">
                {{ authService.currentUser()?.prenom?.charAt(0) }}{{ authService.currentUser()?.nom?.charAt(0) }}
              </div>
              <div class="user-meta">
                <div style="font-size: 0.82rem; font-weight: 700; color: #ffffff; line-height: 1.1;">
                  {{ authService.userFullName() }}
                </div>
                <div style="font-size: 0.65rem; font-weight: 700;" [ngClass]="getRoleBadgeClass(authService.userRole())">
                  {{ authService.userRole() }}
                </div>
              </div>
              <button 
                (click)="authService.logout()" 
                title="Déconnexion"
                style="background: none; border: none; cursor: pointer; color: var(--text-dim); font-size: 1.1rem; padding: 0.1rem; line-height: 1;"
              >
                🚪
              </button>
            </div>

          </ng-container>

          <ng-template #guestTpl>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <a routerLink="/auth/login" class="btn btn-ghost btn-sm">
                Connexion
              </a>
              <a routerLink="/auth/register" class="btn btn-cyber btn-sm">
                Commencer
              </a>
            </div>
          </ng-template>

          <!-- Mobile Menu Button -->
          <button 
            (click)="toggleMobileMenu()" 
            class="btn btn-ghost btn-sm nav-burger"
            style="padding: 0.4rem; font-size: 1.25rem;"
          >
            ☰
          </button>

        </div>

      </div>

      <!-- Mobile Dropdown Navigation -->
      <div *ngIf="mobileMenuOpen()" style="border-top: 1px solid rgba(255, 255, 255, 0.1); background: rgba(11, 17, 32, 0.98); backdrop-filter: blur(24px); padding: 1.5rem;">
        <div style="display: flex; flex-direction: column; gap: 1.2rem;">
          <a routerLink="/parcours" (click)="mobileMenuOpen.set(false)" style="font-weight: 700; color: #ffffff;">Parcours</a>
          <a routerLink="/mes-candidatures" (click)="mobileMenuOpen.set(false)" style="font-weight: 700; color: #ffffff;">Mes candidatures</a>
          <a routerLink="/formations" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: #ffffff;">Catalogue Formations</a>
          <a routerLink="/offres" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: #ffffff;">💼 Offres & Missions Freelance</a>
          <a routerLink="/interview-coach" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: var(--neon-cyan);">🎯 Simulateur d'Entretien IA</a>
          <a routerLink="/cv-builder" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: #cbd5e1;">📄 Générateur de CV Pro</a>
          <a routerLink="/forum" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: #ffffff;">💬 Forum Communautaire</a>
          <a routerLink="/orientation" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: var(--neon-cyan);">✨ Moteur d'Orientation IA</a>
          <a routerLink="/certificats/verify" (click)="mobileMenuOpen.set(false)" style="font-weight: 600; color: #ffffff;">🛡️ Vérifier un Certificat</a>

          <div *ngIf="authService.isLoggedIn()" style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.85rem;">
            <a *ngIf="authService.userRole() === 'APPRENANT'" routerLink="/mes-formations" (click)="mobileMenuOpen.set(false)">🎓 Mes Cours & Exercices</a>
            <a *ngIf="authService.userRole() === 'APPRENANT'" routerLink="/portfolio/me" (click)="mobileMenuOpen.set(false)">📁 Mon Portfolio Public</a>
            <a *ngIf="authService.userRole() === 'FORMATEUR'" routerLink="/formateur/dashboard" (click)="mobileMenuOpen.set(false)">👨‍🏫 Espace Formateur</a>
            <a *ngIf="authService.userRole() === 'ENTREPRISE'" routerLink="/entreprise/offres" (click)="mobileMenuOpen.set(false)">🏢 Gérer mes Offres</a>
            <a *ngIf="authService.userRole() === 'ADMIN'" routerLink="/admin" (click)="mobileMenuOpen.set(false)">⚙️ Console Administrateur</a>
          </div>
        </div>
      </div>

    </header>
  `,
  styles: [`
    .active-nav {
      color: var(--neon-cyan) !important;
      text-shadow: 0 0 12px rgba(6, 182, 212, 0.6);
      border-bottom: 2px solid var(--neon-cyan);
      padding-bottom: 0.25rem;
    }
  `]
})
export class NavbarComponent {
  public authService = inject(AuthService);
  public dataSaver = inject(DataSaverService);
  public mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  getRoleBadgeClass(role: string | null): string {
    switch (role) {
      case 'ADMIN': return 'badge-danger';
      case 'FORMATEUR': return 'badge-purple';
      case 'ENTREPRISE': return 'badge-warning';
      default: return 'badge-success';
    }
  }
}

