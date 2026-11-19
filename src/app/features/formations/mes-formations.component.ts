import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { InscriptionResponse, CertificatResponse, SoumissionResponse } from '../../core/models/models';

@Component({
  selector: 'app-mes-formations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="section-py" style="min-height: 85vh; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container">
        
        <!-- Header -->
        <div style="margin-bottom: 3rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge badge-cyber" style="margin-bottom: 0.5rem;">Espace Apprenant</span>
            <h1 style="font-size: 2.5rem; margin-bottom: 0.25rem; color: #ffffff;">Mes Cours & Projets Pratiques</h1>
            <p style="color: #94a3b8; font-size: 1.05rem;">
              Suivez l'avancement de vos modules, vos soumissions GitHub et vos certificats obtenus.
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <a routerLink="/formations" class="btn btn-outline">
              📚 Explorer d'autres cours
            </a>
            <a routerLink="/portfolio/me" class="btn btn-cyber">
              💼 Voir mon Portfolio
            </a>
          </div>
        </div>

        <!-- Inscriptions Grid -->
        <div style="margin-bottom: 3.5rem;">
          <h2 style="font-size: 1.6rem; margin-bottom: 1.5rem; color: #ffffff;">
            Formations en cours & terminées ({{ inscriptions().length }})
          </h2>

          <div *ngIf="inscriptions().length > 0; else noInscriptionsTpl" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div *ngFor="let insc of inscriptions()" class="card card-hover" style="border-left: 5px solid var(--neon-cyan);">
              <div class="card-body">
                
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                  <span class="badge" [ngClass]="insc.progression === 100 ? 'badge-success' : 'badge-primary'">
                    {{ insc.progression === 100 ? 'TERMINÉE' : 'EN COURS' }}
                  </span>
                  <span style="font-size: 0.8rem; color: #64748b;">
                    Début : {{ insc.dateDebut | date:'mediumDate' }}
                  </span>
                </div>

                <h3 style="font-size: 1.35rem; margin-bottom: 1.25rem; color: #ffffff;">
                  {{ insc.formationTitre }}
                </h3>

                <!-- Progression bar -->
                <div style="margin-bottom: 1.5rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.45rem;">
                    <span style="color: #94a3b8;">Progression</span>
                    <span style="color: var(--neon-cyan); font-family: var(--font-display);">{{ insc.progression }}%</span>
                  </div>
                  <div class="progress-container">
                    <div class="progress-bar-fill" [style.width.%]="insc.progression"></div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1rem;">
                  <a [routerLink]="['/formations', insc.formationId]" class="btn btn-cyber btn-sm">
                    Continuer la pratique →
                  </a>
                  <a *ngIf="insc.progression === 100" routerLink="/mes-certificats" class="btn btn-accent btn-sm">
                    🏆 Certificat
                  </a>
                </div>

              </div>
            </div>
          </div>

          <ng-template #noInscriptionsTpl>
            <div class="card" style="padding: 4rem 2rem; text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">🎓</div>
              <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: #ffffff;">Vous n'êtes inscrit à aucune formation pour le moment</h3>
              <p style="color: #94a3b8; margin-bottom: 1.5rem;">
                Consultez notre catalogue et commencez à coder des projets concrets dès aujourd'hui.
              </p>
              <a routerLink="/formations" class="btn btn-cyber">
                Découvrir les formations
              </a>
            </div>
          </ng-template>
        </div>

        <!-- Soumissions Récentes -->
        <div style="margin-bottom: 3.5rem;" *ngIf="soumissions().length > 0">
          <h2 style="font-size: 1.6rem; margin-bottom: 1.5rem; color: #ffffff;">
            Historique des Soumissions de Code ({{ soumissions().length }})
          </h2>

          <div class="card">
            <div class="card-body" style="padding: 0;">
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                  <thead>
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); background: rgba(15, 23, 42, 0.6); color: #94a3b8; font-weight: 700; font-family: var(--font-display);">
                      <th style="padding: 1rem 1.4rem;">Exercice</th>
                      <th style="padding: 1rem 1.4rem;">Dépôt</th>
                      <th style="padding: 1rem 1.4rem;">Statut</th>
                      <th style="padding: 1rem 1.4rem;">Note</th>
                      <th style="padding: 1rem 1.4rem;">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let sub of soumissions()" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                      <td style="padding: 1.15rem 1.4rem; font-weight: 600; color: #ffffff;">
                        {{ sub.exerciceTitre }}
                      </td>
                      <td style="padding: 1.15rem 1.4rem;">
                        <a [href]="sub.lienDepot" target="_blank" rel="noopener" style="color: var(--neon-cyan); font-weight: 700;">
                          GitHub ↗
                        </a>
                      </td>
                      <td style="padding: 1.15rem 1.4rem;">
                        <span class="badge" [ngClass]="sub.statut === 'VALIDEE' ? 'badge-success' : (sub.statut === 'A_REVOIR' ? 'badge-danger' : 'badge-warning')">
                          {{ sub.statut }}
                        </span>
                      </td>
                      <td style="padding: 1.15rem 1.4rem; font-weight: 800; font-family: var(--font-display); color: #34d399;">
                        {{ sub.note !== undefined && sub.note !== null ? sub.note + '/100' : '—' }}
                      </td>
                      <td style="padding: 1.15rem 1.4rem; color: #64748b; font-size: 0.85rem;">
                        {{ sub.dateSoumission | date:'short' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class MesFormationsComponent implements OnInit {
  private api = inject(ApiService);

  public inscriptions = signal<InscriptionResponse[]>([]);
  public soumissions = signal<SoumissionResponse[]>([]);

  ngOnInit() {
    this.api.getMesInscriptions().subscribe({
      next: data => this.inscriptions.set(data),
      error: () => {}
    });

    this.api.getMesSoumissions().subscribe({
      next: data => this.soumissions.set(data),
      error: () => {}
    });
  }
}
