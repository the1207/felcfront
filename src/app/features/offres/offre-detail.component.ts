import { Component, OnInit, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { OffreResponse, CandidatureResponse } from '../../core/models/models';

@Component({
  selector: 'app-offre-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div *ngIf="offre()" class="section-py" style="min-height: 85vh; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container" style="max-width: 920px;">
        
        <div style="margin-bottom: 2rem;">
          <a routerLink="/offres" style="font-size: 0.95rem; font-weight: 700; color: var(--neon-cyan); display: inline-flex; align-items: center; gap: 0.4rem; font-family: var(--font-display);">
            ← Retour aux offres d'emploi
          </a>
        </div>

        <div class="card" style="margin-bottom: 2.5rem; box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.8), var(--glow-cyan);">
          <div class="card-body" style="padding: 3rem 2.5rem;">
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span class="badge" [ngClass]="offre()?.type === 'MISSION' ? 'badge-purple' : 'badge-primary'">
                  {{ offre()?.type }}
                </span>
                <span *ngIf="offre()?.remote" class="badge badge-success">🌐 Télétravail autorisé</span>
                <span class="badge badge-slate">{{ offre()?.domaineNom }}</span>
              </div>
              <span class="badge" [ngClass]="offre()?.statut === 'OUVERTE' ? 'badge-success' : 'badge-danger'">
                {{ offre()?.statut === 'OUVERTE' ? 'OFFRE ACTIVE' : 'FERMÉE' }}
              </span>
            </div>

            <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem; color: #ffffff;">
              {{ offre()?.titre }}
            </h1>

            <div style="font-size: 1.15rem; font-weight: 600; color: var(--neon-cyan); margin-bottom: 2rem;">
              🏢 {{ offre()?.entrepriseNom }} • 📍 {{ offre()?.localisation }}
            </div>

            <!-- Highlights Matrix Box -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 2.5rem;" class="md:grid-cols-3">
              <div>
                <div style="font-size: 0.75rem; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Budget / Rémunération</div>
                <div style="font-size: 1.6rem; font-weight: 800; color: #facc15; font-family: var(--font-display);">
                  {{ offre()?.budget | number }} FCFA
                </div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Expérience requise</div>
                <div style="font-size: 1.25rem; font-weight: 700; color: #ffffff; margin-top: 0.25rem;">
                  {{ offre()?.experienceMin }} an(s)
                </div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Date de publication</div>
                <div style="font-size: 1.05rem; font-weight: 700; color: #ffffff; margin-top: 0.25rem;">
                  {{ offre()?.datePublication | date:'mediumDate' }}
                </div>
              </div>
            </div>

            <!-- Description -->
            <div style="margin-bottom: 3rem;">
              <h3 style="font-size: 1.35rem; margin-bottom: 1.25rem; color: #ffffff; font-family: var(--font-display);">Description de la mission / du poste</h3>
              <div style="color: #cbd5e1; font-size: 1.05rem; line-height: 1.8; white-space: pre-wrap;">
                {{ offre()?.description }}
              </div>
            </div>

            <!-- Postuler CTA -->
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
              <div *ngIf="existingCandidature(); else notAppliedTpl" style="display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap;">
                <span class="badge badge-success" style="font-size: 0.95rem; padding: 0.5rem 1rem;">
                  ✓ Vous avez postulé à cette offre (Statut : {{ existingCandidature()?.statut }})
                </span>
                <a routerLink="/mes-candidatures" class="btn btn-outline btn-sm">Voir le suivi</a>
              </div>

              <ng-template #notAppliedTpl>
                <div *ngIf="offre()?.statut === 'OUVERTE'; else closedTpl">
                  <button 
                    *ngIf="auth.userRole() === 'APPRENANT'" 
                    (click)="showApplyModal = true" 
                    class="btn btn-cyber btn-lg"
                    style="box-shadow: 0 0 30px rgba(6, 182, 212, 0.4);"
                  >
                    📩 Postuler à cette offre
                  </button>
                  <div *ngIf="!auth.isLoggedIn()" style="font-size: 0.95rem; color: #94a3b8;">
                    <a routerLink="/auth/login" style="font-weight: 700; color: var(--neon-cyan);">Connectez-vous en tant qu'apprenant</a> pour soumettre votre candidature.
                  </div>
                </div>
                <ng-template #closedTpl>
                  <span class="badge badge-danger">Cette offre est fermée aux candidatures</span>
                </ng-template>
              </ng-template>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Application Cyber Modal -->
    <div *ngIf="showApplyModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.5rem; margin: 0; color: #ffffff;">Postuler : {{ offre()?.titre }}</h3>
          <button (click)="showApplyModal = false" style="background: none; border: none; font-size: 1.75rem; color: #94a3b8; cursor: pointer;">×</button>
        </div>

        <form (ngSubmit)="envoyerCandidature()">
          <div class="form-group">
            <label class="form-label">Message de motivation pour l'entreprise</label>
            <textarea 
              name="message" 
              [(ngModel)]="applyMessage" 
              required 
              class="form-textarea"
              style="min-height: 130px;"
              placeholder="Expliquez pourquoi vos compétences pratiques et projets validés sur FELC correspondent aux attentes de la mission..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Lien vers votre portfolio ou profil public (optionnel)</label>
            <input 
              type="url" 
              name="portfolioLink" 
              [(ngModel)]="applyPortfolio" 
              class="form-input" 
              placeholder="https://felc.tg/portfolio/42 ou lien GitHub"
            >
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.85rem; margin-top: 2rem;">
            <button type="button" (click)="showApplyModal = false" class="btn btn-outline">
              Annuler
            </button>
            <button type="submit" [disabled]="submitting()" class="btn btn-cyber">
              <span *ngIf="submitting()" class="spinner"></span>
              <span *ngIf="!submitting()">Envoyer ma candidature ➔</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class OffreDetailComponent implements OnInit {
  id = input.required<string>();

  private api = inject(ApiService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  public offre = signal<OffreResponse | null>(null);
  public existingCandidature = signal<CandidatureResponse | null>(null);

  // Modal
  public showApplyModal = false;
  public applyMessage = '';
  public applyPortfolio = '';
  public submitting = signal(false);

  ngOnInit() {
    const offreId = Number(this.id());
    if (isNaN(offreId)) return;

    this.api.getOffreById(offreId).subscribe({
      next: data => {
        this.offre.set(data);
        this.verifierCandidature(offreId);
      },
      error: () => {
        this.toast.error('Offre introuvable.');
        this.router.navigate(['/offres']);
      }
    });
  }

  verifierCandidature(offreId: number) {
    if (!this.auth.isLoggedIn() || this.auth.userRole() !== 'APPRENANT') return;

    this.api.getMesCandidatures().subscribe({
      next: (list) => {
        const found = list.find(c => c.offreId === offreId);
        if (found) {
          this.existingCandidature.set(found);
        }
      }
    });
  }

  envoyerCandidature() {
    const offId = this.offre()?.id;
    if (!offId || !this.applyMessage.trim()) {
      this.toast.error('Veuillez renseigner votre message de candidature.');
      return;
    }

    this.submitting.set(true);
    this.api.postuler(offId, {
      message: this.applyMessage,
      lienPortfolio: this.applyPortfolio
    }).subscribe({
      next: (cand) => {
        this.submitting.set(false);
        this.showApplyModal = false;
        this.existingCandidature.set(cand);
        this.toast.success('Votre candidature a été transmise à l\'entreprise avec succès !');
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err.error?.message || 'Erreur lors de l\'envoi de votre candidature.';
        this.toast.error(msg);
      }
    });
  }
}
