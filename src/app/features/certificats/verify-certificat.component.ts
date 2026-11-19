import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { CertificatVerificationResponse } from '../../core/models/models';

@Component({
  selector: 'app-verify-certificat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="min-height: 85vh; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container" style="max-width: 720px;">
        
        <div style="text-align: center; margin-bottom: 3rem;">
          <div style="width: 4rem; height: 4rem; border-radius: var(--radius-2xl); background: var(--grad-cyber); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1.25rem auto; box-shadow: 0 0 30px rgba(6, 182, 212, 0.5);">
            🛡️
          </div>
          <h1 style="font-size: 2.5rem; margin-bottom: 0.75rem; color: #ffffff;">
            Registre Public de Certification
          </h1>
          <p style="color: #94a3b8; font-size: 1.05rem; line-height: 1.6;">
            Vérifiez l'authenticité d'un diplôme FELC en temps réel. Accessible instantanément par tout recruteur ou institution dans le monde sans création de compte.
          </p>
        </div>

        <!-- Verification Search Card -->
        <div class="card" style="box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.8), var(--glow-cyan); margin-bottom: 2.5rem;">
          <div class="card-body" style="padding: 2.25rem;">
            <form (ngSubmit)="verifier()">
              <label class="form-label" style="font-size: 0.95rem; margin-bottom: 0.6rem;">
                Entrez le code d'identification unique du certificat :
              </label>
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <input 
                  type="text" 
                  name="code" 
                  [(ngModel)]="code" 
                  required 
                  placeholder="Ex : FELC-INFO-000001" 
                  class="form-input"
                  style="font-family: var(--font-mono); font-size: 1.15rem; letter-spacing: 0.08em; text-transform: uppercase; flex: 1; min-width: 240px;"
                >
                <button type="submit" [disabled]="loading()" class="btn btn-cyber" style="padding: 0.85rem 1.75rem;">
                  <span *ngIf="loading()" class="spinner"></span>
                  <span *ngIf="!loading()">🔍 Vérifier l'Empreinte</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Holographic Certificate Document: Valid -->
        <div *ngIf="result() && result()?.valide" class="card" style="border: 2px solid var(--neon-cyan); box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 40px rgba(6, 182, 212, 0.4); background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(3, 7, 18, 0.98) 100%); position: relative; overflow: hidden;">
          
          <!-- Holographic Shimmer Line -->
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--grad-cyber);"></div>

          <div class="card-body" style="padding: 3rem 2.5rem; text-align: center;">
            
            <div class="cert-seal" style="margin: 0 auto 1.5rem auto;">
              <span style="font-size: 2.25rem;">🏅</span>
            </div>

            <span class="badge badge-success" style="font-size: 0.85rem; padding: 0.45rem 1.25rem; margin-bottom: 1rem; letter-spacing: 0.08em;">
              ✓ DIPLÔME OFFICIELLEMENT VALIDÉ & AUTHENTIQUE
            </span>

            <div style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 800; color: var(--neon-cyan); text-shadow: 0 0 15px rgba(6, 182, 212, 0.5); margin-bottom: 2rem;">
              {{ result()?.code }}
            </div>

            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-xl); padding: 1.75rem; text-align: left; display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem;">
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Titulaire du Certificat</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #ffffff; font-family: var(--font-display);">
                  {{ result()?.apprenantPrenom }} {{ result()?.apprenantNom }}
                </div>
              </div>

              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Formation Pratique Validée</div>
                <div style="font-size: 1.2rem; font-weight: 700; color: #38bdf8;">
                  {{ result()?.formationTitre }}
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 1.25rem;">
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Score d'Évaluation Pratique</div>
                  <div style="font-size: 1.75rem; font-weight: 800; color: #34d399; font-family: var(--font-display); text-shadow: 0 0 15px rgba(52, 211, 153, 0.4);">
                    {{ result()?.score }} / 100
                  </div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Date d'Émission Officielle</div>
                  <div style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-top: 0.35rem;">
                    {{ result()?.dateEmission | date:'longDate' }}
                  </div>
                </div>
              </div>
            </div>

            <div style="font-size: 0.85rem; color: #94a3b8; line-height: 1.6;">
              Ce document atteste que le titulaire a complété l'intégralité des modules, validé tous les exercices pratiques et le projet certifiant avec inspection de code source et tests unitaires.
            </div>

          </div>
        </div>

        <!-- Verification Result: Not Found -->
        <div *ngIf="errorState()" class="card" style="border: 2px solid var(--neon-rose); box-shadow: 0 20px 45px -10px rgba(244, 63, 94, 0.3); background: rgba(15, 23, 42, 0.95);">
          <div class="card-body" style="padding: 3rem 2rem; text-align: center;">
            <div style="width: 4.5rem; height: 4.5rem; border-radius: 50%; background: rgba(244, 63, 94, 0.15); color: var(--neon-rose); display: flex; align-items: center; justify-content: center; font-size: 2.25rem; margin: 0 auto 1.25rem auto;">
              ✕
            </div>
            <span class="badge badge-danger" style="font-size: 0.85rem; padding: 0.4rem 1.25rem; margin-bottom: 1rem;">
              CERTIFICAT INTROUVABLE DANS LE REGISTRE
            </span>
            <p style="color: #cbd5e1; font-size: 1.05rem; margin-top: 1rem; line-height: 1.6;">
              Aucun diplôme ne correspond au code <strong style="color: #ffffff;">"{{ lastSearchedCode }}"</strong>. Veuillez vérifier le code ou contacter l'émetteur.
            </p>
          </div>
        </div>

      </div>
    </div>
  `
})
export class VerifyCertificatComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  public code = '';
  public lastSearchedCode = '';
  public loading = signal(false);
  public result = signal<CertificatVerificationResponse | null>(null);
  public errorState = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.code = params['code'];
        this.verifier();
      }
    });
  }

  verifier() {
    if (!this.code.trim()) {
      this.toast.error('Veuillez saisir un code de certificat.');
      return;
    }

    this.loading.set(true);
    this.errorState.set(false);
    this.result.set(null);
    this.lastSearchedCode = this.code.trim();

    this.api.verifierCertificat(this.lastSearchedCode).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.result.set(res);
        this.toast.success('Certificat vérifié et authentifié !');
      },
      error: () => {
        this.loading.set(false);
        this.errorState.set(true);
        this.toast.error('Certificat introuvable.');
      }
    });
  }
}
