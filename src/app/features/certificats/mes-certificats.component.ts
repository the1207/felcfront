import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CertificatResponse } from '../../core/models/models';

@Component({
  selector: 'app-mes-certificats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="section-py" style="min-height: 85vh; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container">
        
        <div style="margin-bottom: 3rem; text-align: center; max-width: 700px; margin-left: auto; margin-right: auto;">
          <span class="badge badge-warning" style="margin-bottom: 0.75rem;">Registre Officiel</span>
          <h1 style="font-size: 2.75rem; margin-bottom: 0.75rem; color: #ffffff;">
            Mes Certificats FELC
          </h1>
          <p style="color: #94a3b8; font-size: 1.05rem;">
            Chaque certificat est unique, infalsifiable et vérifiable instantanément par les recruteurs du monde entier sans mot de passe.
          </p>
        </div>

        <div *ngIf="certificats().length > 0; else noCertsTpl" class="grid grid-cols-1 md:grid-cols-2 gap-8" style="max-width: 1000px; margin: 0 auto;">
          <div *ngFor="let cert of certificats()" class="card" style="border: 1px solid rgba(245, 158, 11, 0.4); box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.8), var(--glow-amber); background: linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(3, 7, 18, 0.95) 100%);">
            <div class="card-body" style="padding: 2.25rem;">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem;">
                <div class="cert-seal">
                  <span style="font-size: 2rem;">🏅</span>
                </div>
                <div style="text-align: right;">
                  <span class="badge badge-success">DIPLÔME HOMOLOGUÉ</span>
                  <div style="font-family: var(--font-mono); font-weight: 800; font-size: 1.15rem; color: #facc15; margin-top: 0.4rem; text-shadow: 0 0 10px rgba(250, 204, 21, 0.4);">
                    {{ cert.code }}
                  </div>
                </div>
              </div>

              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem;">
                Formation Pratique Validée
              </div>
              <h2 style="font-size: 1.5rem; color: #ffffff; margin-bottom: 1.25rem;">
                {{ cert.formationTitre }}
              </h2>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px dashed rgba(255, 255, 255, 0.12); padding-top: 1.25rem; margin-top: 1.5rem;">
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">Score d'Évaluation</div>
                  <div style="font-size: 1.75rem; font-weight: 800; color: #34d399; font-family: var(--font-display); text-shadow: 0 0 15px rgba(52, 211, 153, 0.4);">
                    {{ cert.score }} / 100
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">Date d'Émission</div>
                  <div style="font-size: 1rem; font-weight: 700; color: #ffffff; margin-top: 0.2rem;">
                    {{ cert.dateEmission | date:'mediumDate' }}
                  </div>
                </div>
              </div>

              <div style="margin-top: 1.75rem; display: flex; gap: 0.75rem;">
                <a [routerLink]="['/certificats/verify']" [queryParams]="{ code: cert.code }" class="btn btn-outline btn-sm" style="flex: 1; border-color: rgba(245, 158, 11, 0.35); color: #fde68a;">
                  🛡️ Vérification Publique
                </a>
                <a routerLink="/portfolio/me" class="btn btn-cyber btn-sm">
                  💼 Mon Portfolio
                </a>
              </div>

            </div>
          </div>
        </div>

        <ng-template #noCertsTpl>
          <div class="card" style="padding: 4.5rem 2rem; text-align: center; max-width: 650px; margin: 0 auto;">
            <div style="font-size: 3.5rem; margin-bottom: 1.25rem;">📜</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #ffffff;">Aucun certificat obtenu pour le moment</h3>
            <p style="color: #94a3b8; margin-bottom: 2rem;">
              Complétez les exercices pratiques et le projet final certifiant d'une formation pour débloquer votre premier titre vérifiable.
            </p>
            <a routerLink="/formations" class="btn btn-cyber btn-lg">
              Explorer le catalogue de formations
            </a>
          </div>
        </ng-template>

      </div>
    </div>
  `
})
export class MesCertificatsComponent implements OnInit {
  private api = inject(ApiService);
  public certificats = signal<CertificatResponse[]>([]);

  ngOnInit() {
    this.api.getMesCertificats().subscribe({
      next: data => this.certificats.set(data),
      error: () => {}
    });
  }
}
