import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Role } from '../../core/models/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="min-height: 85vh; display: flex; align-items: center; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container" style="max-width: 650px; width: 100%;">
        
        <div class="card" style="box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9), var(--glow-cyan);">
          <div class="card-body" style="padding: 2.75rem 2.5rem;">
            
            <div style="text-align: center; margin-bottom: 2.25rem;">
              <h1 style="font-size: 2.15rem; margin-bottom: 0.5rem; color: #ffffff;">Créer votre profil FELC</h1>
              <p style="color: #94a3b8; font-size: 0.95rem;">
                Rejoignez l'écosystème d'apprentissage pratique et d'insertion professionnelle
              </p>
            </div>

            <form (ngSubmit)="onSubmit()">
              
              <!-- Role Selector Cyber Tabs -->
              <div class="form-group">
                <label class="form-label">Sélectionnez votre rôle :</label>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem;">
                  <button 
                    type="button" 
                    (click)="selectedRole = 'APPRENANT'"
                    [class.btn-cyber]="selectedRole === 'APPRENANT'"
                    [class.btn-outline]="selectedRole !== 'APPRENANT'"
                    class="btn"
                  >
                    🎓 Apprenant
                  </button>
                  <button 
                    type="button" 
                    (click)="selectedRole = 'FORMATEUR'"
                    [class.btn-cyber]="selectedRole === 'FORMATEUR'"
                    [class.btn-outline]="selectedRole !== 'FORMATEUR'"
                    class="btn"
                  >
                    👨‍🏫 Formateur
                  </button>
                  <button 
                    type="button" 
                    (click)="selectedRole = 'ENTREPRISE'"
                    [class.btn-cyber]="selectedRole === 'ENTREPRISE'"
                    [class.btn-outline]="selectedRole !== 'ENTREPRISE'"
                    class="btn"
                  >
                    🏢 Entreprise
                  </button>
                </div>
              </div>

              <!-- Name and Surname -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label">Prénom</label>
                  <input type="text" name="prenom" [(ngModel)]="prenom" required class="form-input" placeholder="Koffi">
                </div>
                <div class="form-group">
                  <label class="form-label">Nom</label>
                  <input type="text" name="nom" [(ngModel)]="nom" required class="form-input" placeholder="Mensah">
                </div>
              </div>

              <!-- Email -->
              <div class="form-group">
                <label class="form-label">Adresse E-mail</label>
                <input type="email" name="email" [(ngModel)]="email" required class="form-input" placeholder="koffi@exemple.tg">
              </div>

              <!-- Password -->
              <div class="form-group">
                <label class="form-label">Mot de passe (minimum 6 caractères)</label>
                <input type="password" name="motDePasse" [(ngModel)]="motDePasse" required minlength="6" class="form-input" placeholder="••••••••">
              </div>

              <!-- Localisation -->
              <div class="form-group">
                <label class="form-label">Localisation / Ville</label>
                <input type="text" name="localisation" [(ngModel)]="localisation" class="form-input" placeholder="Lomé, Togo">
              </div>

              <!-- Extra fields if Entreprise -->
              <div *ngIf="selectedRole === 'ENTREPRISE'" style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 2rem;">
                <div style="font-weight: 800; color: #fde68a; margin-bottom: 1rem; font-size: 0.95rem; font-family: var(--font-display);">
                  🏢 Informations de l'Entreprise Recruteuse
                </div>
                <div class="form-group">
                  <label class="form-label">Nom de l'Entreprise</label>
                  <input type="text" name="nomEntreprise" [(ngModel)]="nomEntreprise" required class="form-input" placeholder="Tech Togo SAS">
                </div>
                <div class="form-group">
                  <label class="form-label">Secteur d'activité</label>
                  <input type="text" name="secteur" [(ngModel)]="secteur" class="form-input" placeholder="Informatique, EdTech, Fintech...">
                </div>
                <div class="form-group">
                  <label class="form-label">Site Web (optionnel)</label>
                  <input type="url" name="siteWeb" [(ngModel)]="siteWeb" class="form-input" placeholder="https://techtogo.tg">
                </div>
              </div>

              <button 
                type="submit" 
                [disabled]="loading()" 
                class="btn btn-cyber" 
                style="width: 100%; padding: 0.85rem; font-size: 1.05rem; margin-top: 1rem;"
              >
                <span *ngIf="loading()" class="spinner"></span>
                <span *ngIf="!loading()">Créer mon compte ➔</span>
              </button>

            </form>

            <div style="text-align: center; margin-top: 2rem; font-size: 0.9rem; color: #94a3b8;">
              Vous avez déjà un compte ? 
              <a routerLink="/auth/login" style="font-weight: 700; color: var(--neon-cyan);">
                Se connecter
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  public selectedRole: Role = 'APPRENANT';
  public prenom = '';
  public nom = '';
  public email = '';
  public motDePasse = '';
  public localisation = 'Lomé, Togo';

  // Entreprise
  public nomEntreprise = '';
  public secteur = '';
  public siteWeb = '';

  public loading = signal(false);

  onSubmit() {
    if (!this.email || !this.motDePasse || !this.nom || !this.prenom) {
      this.toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (this.selectedRole === 'ENTREPRISE' && !this.nomEntreprise) {
      this.toast.error('Veuillez renseigner le nom de votre entreprise.');
      return;
    }

    const payload: any = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      motDePasse: this.motDePasse,
      role: this.selectedRole,
      localisation: this.localisation
    };

    if (this.selectedRole === 'ENTREPRISE') {
      payload.nomEntreprise = this.nomEntreprise;
      payload.secteur = this.secteur;
      payload.siteWeb = this.siteWeb;
    }

    this.loading.set(true);
    this.authService.register(payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.toast.success(`Compte créé avec succès ! Bienvenue ${res.prenom}.`);
        if (res.role === 'ENTREPRISE') {
          this.router.navigate(['/entreprise/offres']);
        } else if (res.role === 'FORMATEUR') {
          this.router.navigate(['/formateur/dashboard']);
        } else {
          this.router.navigate(['/orientation']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || 'Erreur lors de la création du compte.';
        this.toast.error(msg);
      }
    });
  }
}
