import { Component, OnInit, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { PortfolioResponse } from '../../core/models/models';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="section-py" style="min-height: 85vh; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container" style="max-width: 980px;">
        
        <!-- Toggle Bar for Owner -->
        <div *ngIf="isOwner" class="card" style="margin-bottom: 2.5rem; border-left: 5px solid var(--neon-cyan); box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);">
          <div class="card-body" style="padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <strong style="color: #ffffff; font-size: 1.15rem; font-family: var(--font-display);">Visibilité de votre Portfolio Public</strong>
              <p style="color: #94a3b8; font-size: 0.9rem; margin: 0.25rem 0 0 0;">
                Permettez aux recruteurs et entreprises partenaires de consulter vos compétences et vos projets sans compte.
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span class="badge" [ngClass]="portfolioPublic() ? 'badge-success' : 'badge-slate'">
                {{ portfolioPublic() ? 'EN LIGNE (PUBLIC)' : 'PRIVÉ' }}
              </span>
              <button 
                (click)="toggleVisibilite()" 
                class="btn btn-sm"
                [ngClass]="portfolioPublic() ? 'btn-outline' : 'btn-cyber'"
              >
                {{ portfolioPublic() ? 'Rendre Privé' : 'Activer Publiquement ⚡' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Portfolio Content Card -->
        <div *ngIf="portfolio(); else loadingTpl" class="card" style="box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9), var(--glow-indigo); overflow: hidden;">
          
          <!-- Cyber Cover Banner -->
          <div style="height: 160px; background: var(--grad-cyber); position: relative;">
            <div style="position: absolute; bottom: -40px; left: 2.5rem; width: 85px; height: 85px; border-radius: 50%; background: #0b1120; border: 4px solid #030712; display: flex; align-items: center; justify-content: center; font-size: 2.25rem; font-weight: 800; font-family: var(--font-display); color: var(--neon-cyan); box-shadow: 0 0 25px rgba(6, 182, 212, 0.5);">
              {{ portfolio()?.prenom?.charAt(0) }}{{ portfolio()?.nom?.charAt(0) }}
            </div>
          </div>

          <div class="card-body" style="padding: 3.5rem 2.5rem 2.5rem 2.5rem;">
            
            <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
              <div>
                <h1 style="font-size: 2.5rem; color: #ffffff; margin-bottom: 0.35rem;">
                  {{ portfolio()?.prenom }} {{ portfolio()?.nom }}
                </h1>
                <div style="font-size: 1rem; color: #94a3b8; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                  <span *ngIf="portfolio()?.localisation">📍 {{ portfolio()?.localisation }}</span>
                  <span class="badge badge-success">Profil Développeur Certifié</span>
                </div>
              </div>

              <!-- Social Links -->
              <div style="display: flex; gap: 0.75rem;">
                <a *ngIf="portfolio()?.lienGithub" [href]="portfolio()?.lienGithub" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                  GitHub ↗
                </a>
                <a *ngIf="portfolio()?.lienLinkedin" [href]="portfolio()?.lienLinkedin" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                  LinkedIn ↗
                </a>
              </div>
            </div>

            <!-- Bio -->
            <p *ngIf="portfolio()?.bio" style="font-size: 1.1rem; color: #cbd5e1; line-height: 1.7; margin-bottom: 2.5rem; border-left: 3px solid var(--neon-cyan); padding-left: 1.25rem;">
              {{ portfolio()?.bio }}
            </p>

            <!-- Compétences Maîtrisées -->
            <div style="margin-bottom: 3rem;" *ngIf="portfolio()?.competences?.length">
              <h3 style="font-size: 1.35rem; margin-bottom: 1rem; color: #ffffff; font-family: var(--font-display);">
                🛠️ Compétences Pratiques Certifiées
              </h3>
              <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
                <span *ngFor="let comp of portfolio()?.competences" class="badge badge-primary" style="font-size: 0.9rem; padding: 0.45rem 0.9rem;">
                  {{ comp }}
                </span>
              </div>
            </div>

            <!-- Projets Pratiques Validés -->
            <div style="margin-bottom: 3rem;">
              <h3 style="font-size: 1.35rem; margin-bottom: 1.25rem; color: #ffffff; font-family: var(--font-display);">
                💻 Projets Pratiques Validés par l'IA et les Formateurs
              </h3>

              <div *ngIf="portfolio()?.projetsValides?.length; else noProjectsTpl" style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div *ngFor="let proj of portfolio()?.projetsValides" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-xl); padding: 1.5rem;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                      <h4 style="font-size: 1.25rem; color: #ffffff; margin: 0;">{{ proj.exerciceTitre }}</h4>
                      <div style="font-size: 0.85rem; color: var(--neon-cyan); font-weight: 600;">Formation : {{ proj.formationTitre }}</div>
                    </div>
                    <span class="badge badge-success" style="font-size: 0.85rem;">
                      Note : {{ proj.note }} / 100
                    </span>
                  </div>

                  <div style="font-size: 0.925rem; color: #cbd5e1; line-height: 1.6; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-lg); padding: 1rem; margin: 1rem 0;">
                    <strong style="color: #ffffff;">Feedback de validation :</strong> {{ proj.feedback }}
                  </div>

                  <div style="display: flex; justify-content: flex-end;">
                    <a [href]="proj.lienDepot" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                      Inspecter le code source (GitHub) ↗
                    </a>
                  </div>
                </div>
              </div>

              <ng-template #noProjectsTpl>
                <div style="font-size: 0.95rem; color: #64748b; font-style: italic;">
                  Aucun projet pratique validé pour le moment.
                </div>
              </ng-template>
            </div>

            <!-- Certificats Officiels FELC -->
            <div *ngIf="portfolio()?.certificats?.length">
              <h3 style="font-size: 1.35rem; margin-bottom: 1.25rem; color: #ffffff; font-family: var(--font-display);">
                🏆 Certificats Officiels Décrochés
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div *ngFor="let c of portfolio()?.certificats" style="border: 1px solid rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.05); border-radius: var(--radius-xl); padding: 1.5rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <span class="badge badge-success">CERTIFIÉ FELC</span>
                    <strong style="font-family: var(--font-mono); font-size: 0.95rem; color: #facc15;">{{ c.code }}</strong>
                  </div>
                  <h4 style="font-size: 1.15rem; margin-bottom: 0.75rem; color: #ffffff;">{{ c.formationTitre }}</h4>
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #94a3b8;">
                    <span>Score : <strong style="color: #34d399;">{{ c.score }}/100</strong></span>
                    <span>Émis le {{ c.dateEmission | date:'mediumDate' }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <ng-template #loadingTpl>
          <div class="card" style="padding: 5rem; text-align: center;">
            <div class="spinner" style="width: 3.5rem; height: 3.5rem; border-top-color: var(--neon-cyan);"></div>
            <p style="margin-top: 1.25rem; color: #94a3b8;">Chargement du portfolio en cours...</p>
          </div>
        </ng-template>

      </div>
    </div>
  `
})
export class PortfolioComponent implements OnInit {
  id = input<string>();

  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  public portfolio = signal<PortfolioResponse | null>(null);
  public portfolioPublic = signal(true);
  public isOwner = false;

  ngOnInit() {
    const routeId = this.id();
    this.isOwner = !routeId || routeId === 'me';

    if (this.isOwner) {
      if (!this.auth.isLoggedIn()) {
        this.router.navigate(['/auth/login']);
        return;
      }
      this.api.getMonPortfolio().subscribe({
        next: data => {
          this.portfolio.set(data);
          this.chargerStatutUser();
        },
        error: () => this.toast.error('Impossible de charger votre portfolio.')
      });
    } else {
      const targetUserId = Number(routeId);
      if (isNaN(targetUserId)) {
        this.router.navigate(['/']);
        return;
      }
      this.api.getPortfolioPublic(targetUserId).subscribe({
        next: data => this.portfolio.set(data),
        error: () => {
          this.toast.error('Portfolio introuvable ou configuré comme privé.');
          this.router.navigate(['/']);
        }
      });
    }
  }

  chargerStatutUser() {
    this.api.getMonProfil().subscribe({
      next: user => this.portfolioPublic.set(user.portfolioPublic)
    });
  }

  toggleVisibilite() {
    const newState = !this.portfolioPublic();
    this.api.changerVisibilitePortfolio(newState).subscribe({
      next: () => {
        this.portfolioPublic.set(newState);
        this.toast.success(newState ? 'Votre portfolio est maintenant public et partageable !' : 'Votre portfolio est maintenant privé.');
      }
    });
  }
}
