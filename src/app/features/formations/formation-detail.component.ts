import { Component, OnInit, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { VoiceService } from '../../core/services/voice.service';
import {
  FormationDetailResponse,
  InscriptionResponse,
  SoumissionResponse,
  ExerciceResponse,
  ModuleResponse
} from '../../core/models/models';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div *ngIf="formation()" class="section-py" style="min-height: 85vh; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container">
        
        <!-- Header Hero Card -->
        <div class="card" style="margin-bottom: 2.5rem; border-left: 6px solid var(--neon-cyan); box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.8), var(--glow-cyan);">
          <div class="card-body" style="padding: 2.5rem;">
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <span class="badge badge-primary">{{ formation()?.domaineNom }}</span>
                <span class="badge badge-success">Niveau {{ formation()?.niveau }}</span>
              </div>
              <div style="font-size: 0.9rem; color: #94a3b8;">
                Formateur : <strong style="color: #ffffff;">{{ formation()?.formateurPrenom }} {{ formation()?.formateurNom }}</strong>
              </div>
            </div>

            <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #ffffff;">
              {{ formation()?.titre }}
            </h1>

            <p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.7; margin-bottom: 2rem; max-width: 880px;">
              {{ formation()?.description }}
            </p>

            <!-- Enrollment / Progress Bar -->
            <div *ngIf="inscription(); else notEnrolledTpl" style="background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-xl); padding: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.08);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; font-size: 1rem; color: #ffffff; font-family: var(--font-display); display: flex; align-items: center; gap: 0.5rem;">
                  <span class="pulsing-dot"></span> Progression Pédagogique
                </span>
                <span style="font-weight: 800; font-size: 1.3rem; color: var(--neon-cyan); font-family: var(--font-display);">
                  {{ inscription()?.progression }}%
                </span>
              </div>
              <div class="progress-container">
                <div class="progress-bar-fill" [style.width.%]="inscription()?.progression"></div>
              </div>

              <!-- Finished Banner if 100% -->
              <div *ngIf="inscription()?.progression === 100" style="margin-top: 1.5rem; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: var(--radius-xl); padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; box-shadow: 0 0 25px rgba(16, 185, 129, 0.2);">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <span style="font-size: 2rem;">🏆</span>
                  <div>
                    <strong style="color: #6ee7b7; font-size: 1.1rem; font-family: var(--font-display);">Félicitations ! Formation complétée à 100%</strong>
                    <div style="font-size: 0.9rem; color: #cbd5e1;">Votre certificat officiel FELC a été validé et enregistré.</div>
                  </div>
                </div>
                <a routerLink="/mes-certificats" class="btn btn-accent btn-sm">
                  Voir mon Certificat ➔
                </a>
              </div>
            </div>

            <ng-template #notEnrolledTpl>
              <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                <button 
                  *ngIf="auth.userRole() === 'APPRENANT'" 
                  (click)="sInscrire()" 
                  [disabled]="inscribing()" 
                  class="btn btn-cyber btn-lg"
                  style="box-shadow: 0 0 30px rgba(6, 182, 212, 0.4);"
                >
                  <span *ngIf="inscribing()" class="spinner"></span>
                  <span *ngIf="!inscribing()">⚡ S'inscrire à cette formation (Gratuit)</span>
                </button>
                <div *ngIf="!auth.isLoggedIn()" style="font-size: 0.95rem; color: #94a3b8;">
                  <a routerLink="/auth/login" style="font-weight: 700; color: var(--neon-cyan);">Connectez-vous</a> pour démarrer les projets et soumettre votre code.
                </div>
              </div>
            </ng-template>

            <!-- Quick Action Bar -->
            <div style="display: flex; align-items: center; justify-content: flex-end; margin-top: 1.25rem;">
              <button 
                type="button"
                (click)="imprimerFicheCours()" 
                class="btn btn-ghost btn-sm" 
                style="border: 1px solid rgba(255, 255, 255, 0.15); color: #94a3b8; font-size: 0.82rem;"
                title="Enregistrez ou imprimez cette fiche complète pour travailler hors-ligne sans connexion"
              >
                🖨️ Fiche de Cours & Exercices (PDF / Hors-Ligne)
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
          <button 
            (click)="activeTab = 'exercices'"
            [style.color]="activeTab === 'exercices' ? 'var(--neon-cyan)' : '#94a3b8'"
            [style.border-bottom]="activeTab === 'exercices' ? '2px solid var(--neon-cyan)' : 'none'"
            style="background: none; border: none; font-weight: 700; font-size: 1.1rem; font-family: var(--font-display); padding: 0.85rem 1.25rem; cursor: pointer; display: flex; align-items: center; gap: 0.6rem;"
          >
            <span>💻</span> Exercices & Projets Pratiques ({{ formation()?.exercices?.length || 0 }})
          </button>
          <button 
            (click)="activeTab = 'modules'"
            [style.color]="activeTab === 'modules' ? 'var(--neon-cyan)' : '#94a3b8'"
            [style.border-bottom]="activeTab === 'modules' ? '2px solid var(--neon-cyan)' : 'none'"
            style="background: none; border: none; font-weight: 700; font-size: 1.1rem; font-family: var(--font-display); padding: 0.85rem 1.25rem; cursor: pointer; display: flex; align-items: center; gap: 0.6rem;"
          >
            <span>📖</span> Modules de Cours ({{ formation()?.modules?.length || 0 }})
          </button>
        </div>

        <!-- Inclusive Audio Assistant Banner (Orality & Low-Literacy Inclusion) -->
        <div *ngIf="voice.isSupported()" style="background: rgba(6, 182, 212, 0.07); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: var(--radius-xl); padding: 0.85rem 1.25rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 2.25rem; height: 2.25rem; border-radius: 50%; background: rgba(6, 182, 212, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              🎙️
            </div>
            <div>
              <div style="font-weight: 700; color: #ffffff; font-size: 0.95rem; font-family: var(--font-display); display: flex; align-items: center; gap: 0.4rem;">
                Assistant Vocal Inclusif & Oralité
                <span class="badge badge-cyber" style="font-size: 0.68rem; padding: 0.15rem 0.5rem;">Accessibilité</span>
              </div>
              <div style="color: #94a3b8; font-size: 0.82rem;">
                Écoutez les consignes d'exercices et les cours sans avoir à lire sur petit écran
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 0.8rem; color: #94a3b8;">Vitesse :</span>
            <button 
              type="button" 
              (click)="speechRate.set(0.9)" 
              class="btn btn-ghost btn-sm" 
              [style.color]="speechRate() === 0.9 ? 'var(--neon-cyan)' : '#94a3b8'"
              style="padding: 0.25rem 0.5rem; font-size: 0.8rem;"
            >0.9x</button>
            <button 
              type="button" 
              (click)="speechRate.set(1.0)" 
              class="btn btn-ghost btn-sm" 
              [style.color]="speechRate() === 1.0 ? 'var(--neon-cyan)' : '#94a3b8'"
              style="padding: 0.25rem 0.5rem; font-size: 0.8rem;"
            >1.0x</button>
            <button 
              type="button" 
              (click)="speechRate.set(1.2)" 
              class="btn btn-ghost btn-sm" 
              [style.color]="speechRate() === 1.2 ? 'var(--neon-cyan)' : '#94a3b8'"
              style="padding: 0.25rem 0.5rem; font-size: 0.8rem;"
            >1.2x</button>

            <button 
              *ngIf="voice.isSpeaking()" 
              (click)="arreterVocal()" 
              class="btn btn-outline btn-sm" 
              style="border-color: var(--neon-rose); color: var(--neon-rose); padding: 0.35rem 0.75rem;"
            >
              ⏹️ Stop Vocal
            </button>
          </div>
        </div>

        <!-- Tab 1: Exercices & Soumissions -->
        <div *ngIf="activeTab === 'exercices'" style="display: flex; flex-direction: column; gap: 1.75rem;">
          
          <div *ngFor="let exo of formation()?.exercices; let i = index" class="card" [style.border-left]="exo.projetFinal ? '5px solid var(--neon-amber)' : '1px solid rgba(255, 255, 255, 0.08)'">
            <div class="card-body">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="font-weight: 800; font-family: var(--font-display); color: #64748b;">#{{ exo.ordre }}</span>
                  <span *ngIf="exo.projetFinal" class="badge badge-warning">🏆 Projet Final Certifiant</span>
                  <span *ngIf="!exo.projetFinal" class="badge badge-slate">Exercice Pratique</span>
                </div>

                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <!-- Voice audio button -->
                  <button 
                    *ngIf="voice.isSupported()"
                    type="button"
                    (click)="toggleVocalExo(exo)"
                    class="btn btn-ghost btn-sm"
                    style="border: 1px solid rgba(6, 182, 212, 0.3); color: var(--neon-cyan); padding: 0.25rem 0.65rem; font-size: 0.8rem;"
                  >
                    <span *ngIf="voice.isSpeaking() && activeVoiceTarget() === ('exo_' + exo.id)">⏹️ Stop Audio</span>
                    <span *ngIf="!voice.isSpeaking() || activeVoiceTarget() !== ('exo_' + exo.id)">🔊 Écouter l'exercice</span>
                  </button>

                  <!-- Soumission status badge -->
                  <div *ngIf="getSoumission(exo.id) as sub">
                    <span class="badge" [ngClass]="getSoumissionBadgeClass(sub.statut)">
                      {{ sub.statut }} ({{ sub.note ?? 0 }}/100)
                    </span>
                  </div>
                </div>
              </div>

              <h3 style="font-size: 1.4rem; margin-bottom: 0.85rem; color: #ffffff;">
                {{ exo.titre }}
              </h3>

              <!-- Consignes & Critères Box -->
              <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-xl); padding: 1.4rem; margin-bottom: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem;">
                  Consigne :
                </div>
                <div style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap;">
                  {{ exo.consigne }}
                </div>

                <div style="margin-top: 1.25rem; border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 1rem;">
                  <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem;">
                    Critères d'évaluation de code :
                  </div>
                  <div style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; white-space: pre-wrap;">
                    {{ exo.criteres }}
                  </div>
                </div>
              </div>

              <!-- Soumission Area if Enrolled -->
              <div *ngIf="inscription()">
                
                <!-- If already submitted -->
                <div *ngIf="getSoumission(exo.id) as sub" style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-xl); padding: 1.4rem; margin-top: 1.25rem;">
                  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                      <span style="font-size: 0.8rem; color: #64748b;">Dépôt analysé :</span>
                      <a [href]="sub.lienDepot" target="_blank" rel="noopener" style="font-weight: 700; margin-left: 0.5rem; word-break: break-all; color: var(--neon-cyan);">
                        🔗 {{ sub.lienDepot }} ↗
                      </a>
                    </div>

                    <!-- Cyber AI Correction Button -->
                    <button 
                      *ngIf="sub.statut !== 'VALIDEE'" 
                      (click)="corrigerAvecIa(sub.id)" 
                      [disabled]="correctingIaId() === sub.id" 
                      class="btn btn-cyber btn-sm"
                    >
                      <span *ngIf="correctingIaId() === sub.id" class="spinner"></span>
                      <span *ngIf="correctingIaId() !== sub.id">✨ Corriger Immédiatement avec l'IA</span>
                    </button>
                  </div>

                  <!-- Feedback section -->
                  <div *ngIf="sub.feedback" style="background: rgba(255, 255, 255, 0.03); border-left: 4px solid var(--neon-indigo); padding: 1rem 1.25rem; border-radius: var(--radius-md); font-size: 0.925rem; margin-top: 0.75rem;">
                    <strong style="color: #ffffff;">Feedback d'évaluation de code (Note : {{ sub.note }}/100) :</strong>
                    <div style="color: #cbd5e1; margin-top: 0.4rem; white-space: pre-wrap; line-height: 1.6;">{{ sub.feedback }}</div>
                  </div>

                  <!-- Re-submit if A_REVOIR -->
                  <div *ngIf="sub.statut === 'A_REVOIR'" style="margin-top: 1.25rem;">
                    <button (click)="openSubmitModal(exo)" class="btn btn-outline btn-sm">
                      🔄 Resoumettre une version corrigée
                    </button>
                  </div>
                </div>

                <!-- If not submitted yet -->
                <div *ngIf="!getSoumission(exo.id)" style="margin-top: 1rem;">
                  <button (click)="openSubmitModal(exo)" class="btn btn-primary btn-sm">
                    📤 Soumettre mon lien de projet (GitHub)
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

        <!-- Tab 2: Modules de Cours -->
        <div *ngIf="activeTab === 'modules'" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div *ngFor="let mod of formation()?.modules" class="card">
            <div class="card-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <span class="badge badge-primary">Module {{ mod.ordre }}</span>
                <h3 style="font-size: 1.25rem; margin: 0; color: #ffffff;">{{ mod.titre }}</h3>
              </div>
              <button 
                *ngIf="voice.isSupported()"
                type="button"
                (click)="toggleVocalModule(mod)"
                class="btn btn-ghost btn-sm"
                style="border: 1px solid rgba(6, 182, 212, 0.3); color: var(--neon-cyan); padding: 0.25rem 0.65rem; font-size: 0.8rem;"
              >
                <span *ngIf="voice.isSpeaking() && activeVoiceTarget() === ('mod_' + mod.id)">⏹️ Stop Audio</span>
                <span *ngIf="!voice.isSpeaking() || activeVoiceTarget() !== ('mod_' + mod.id)">🔊 Écouter le cours</span>
              </button>
            </div>
            <div class="card-body">
              <div style="color: #cbd5e1; font-size: 1rem; line-height: 1.7; white-space: pre-wrap;">
                {{ mod.contenu }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Cyber Submission Modal -->
    <div *ngIf="showSubmitModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.5rem; margin: 0; color: #ffffff;">Soumettre votre travail</h3>
          <button (click)="showSubmitModal = false" style="background: none; border: none; font-size: 1.75rem; color: #94a3b8; cursor: pointer;">×</button>
        </div>

        <div style="margin-bottom: 1.5rem; font-size: 0.95rem; color: #94a3b8;">
          Exercice sélectionné : <strong style="color: var(--neon-cyan);">{{ currentExercice?.titre }}</strong>
        </div>

        <form (ngSubmit)="envoyerSoumission()">
          <div class="form-group">
            <label class="form-label">Lien du dépôt GitHub public</label>
            <input 
              type="url" 
              name="lienDepot" 
              [(ngModel)]="submissionLien" 
              required 
              class="form-input" 
              placeholder="https://github.com/votre-compte/votre-projet"
            >
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.4rem;">
              Le dépôt doit être public pour permettre l'inspection automatique par l'IA et le formateur.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Commentaire ou notes techniques (optionnel)</label>
            <textarea 
              name="commentaire" 
              [(ngModel)]="submissionCommentaire" 
              class="form-textarea" 
              placeholder="Ex : J'ai respecté l'architecture en couches, ajouté les endpoints avec validation et configuré les tests..."
            ></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.85rem; margin-top: 2rem;">
            <button type="button" (click)="showSubmitModal = false" class="btn btn-outline">
              Annuler
            </button>
            <button type="submit" [disabled]="submitting()" class="btn btn-cyber">
              <span *ngIf="submitting()" class="spinner"></span>
              <span *ngIf="!submitting()">Valider & Soumettre</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FormationDetailComponent implements OnInit {
  id = input.required<string>();

  private api = inject(ApiService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  public voice = inject(VoiceService);

  public formation = signal<FormationDetailResponse | null>(null);
  public inscription = signal<InscriptionResponse | null>(null);
  public mesSoumissions = signal<SoumissionResponse[]>([]);

  public activeTab: 'exercices' | 'modules' = 'exercices';
  public inscribing = signal(false);
  public correctingIaId = signal<number | null>(null);

  // Inclusive Voice accessibility state
  public activeVoiceTarget = signal<string | null>(null);
  public speechRate = signal<number>(1.0);

  // Modal
  public showSubmitModal = false;
  public currentExercice: ExerciceResponse | null = null;
  public submissionLien = '';
  public submissionCommentaire = '';
  public submitting = signal(false);

  ngOnInit() {
    const formationId = Number(this.id());
    if (isNaN(formationId)) return;

    this.api.getFormationById(formationId).subscribe({
      next: data => {
        this.formation.set(data);
        this.verifierInscription(formationId);
      },
      error: () => {
        this.toast.error('Formation introuvable.');
        this.router.navigate(['/formations']);
      }
    });
  }

  verifierInscription(formationId: number) {
    if (!this.auth.isLoggedIn() || this.auth.userRole() !== 'APPRENANT') return;

    this.api.getMesInscriptions().subscribe({
      next: (list) => {
        const found = list.find(i => i.formationId === formationId);
        if (found) {
          this.inscription.set(found);
          this.chargerMesSoumissions();
        }
      }
    });
  }

  chargerMesSoumissions() {
    this.api.getMesSoumissions().subscribe({
      next: data => this.mesSoumissions.set(data)
    });
  }

  getSoumission(exerciceId: number): SoumissionResponse | undefined {
    return this.mesSoumissions().find(s => s.exerciceId === exerciceId);
  }

  sInscrire() {
    const formId = this.formation()?.id;
    if (!formId) return;

    this.inscribing.set(true);
    this.api.inscrire(formId).subscribe({
      next: (insc) => {
        this.inscribing.set(false);
        this.inscription.set(insc);
        this.toast.success('Félicitations, vous êtes inscrit à cette formation !');
        this.chargerMesSoumissions();
      },
      error: (err) => {
        this.inscribing.set(false);
        const msg = err.error?.message || 'Erreur lors de l\'inscription.';
        this.toast.error(msg);
      }
    });
  }

  openSubmitModal(exo: ExerciceResponse) {
    this.currentExercice = exo;
    this.submissionLien = '';
    this.submissionCommentaire = '';
    this.showSubmitModal = true;
  }

  envoyerSoumission() {
    if (!this.currentExercice || !this.submissionLien) {
      this.toast.error('Veuillez renseigner le lien de votre dépôt GitHub.');
      return;
    }

    this.submitting.set(true);
    this.api.soumettreExercice(this.currentExercice.id, {
      lienDepot: this.submissionLien,
      commentaire: this.submissionCommentaire
    }).subscribe({
      next: (sub) => {
        this.submitting.set(false);
        this.showSubmitModal = false;
        this.toast.success('Projet soumis avec succès ! Vous pouvez lancer la correction IA.');
        this.chargerMesSoumissions();
        this.actualiserInscription();
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err.error?.message || 'Erreur lors de la soumission.';
        this.toast.error(msg);
      }
    });
  }

  corrigerAvecIa(soumissionId: number) {
    this.correctingIaId.set(soumissionId);
    this.toast.info('L\'IA Claude inspecte actuellement votre dépôt GitHub...');

    this.api.corrigerSoumissionIa(soumissionId).subscribe({
      next: (res) => {
        this.correctingIaId.set(null);
        if (res.statut === 'VALIDEE') {
          this.toast.success(`Exercice validé avec succès ! Note : ${res.note}/100 🏆`);
        } else {
          this.toast.error(`Exercice à revoir (Note : ${res.note}/100).`);
        }
        this.chargerMesSoumissions();
        this.actualiserInscription();
      },
      error: (err) => {
        this.correctingIaId.set(null);
        const msg = err.error?.message || 'Erreur lors de la correction par l\'IA.';
        this.toast.error(msg);
      }
    });
  }

  actualiserInscription() {
    const formId = this.formation()?.id;
    if (formId) {
      this.verifierInscription(formId);
    }
  }

  toggleVocalExo(exo: ExerciceResponse) {
    const targetKey = 'exo_' + exo.id;
    if (this.voice.isSpeaking() && this.activeVoiceTarget() === targetKey) {
      this.arreterVocal();
    } else {
      this.activeVoiceTarget.set(targetKey);
      const speech = `Exercice ${exo.ordre} : ${exo.titre}. Consigne : ${exo.consigne}. Critères d'évaluation : ${exo.criteres}.`;
      this.voice.speak(speech, 'fr-FR', this.speechRate());
    }
  }

  toggleVocalModule(mod: ModuleResponse) {
    const targetKey = 'mod_' + mod.id;
    if (this.voice.isSpeaking() && this.activeVoiceTarget() === targetKey) {
      this.arreterVocal();
    } else {
      this.activeVoiceTarget.set(targetKey);
      const speech = `Module ${mod.ordre} : ${mod.titre}. ${mod.contenu}`;
      this.voice.speak(speech, 'fr-FR', this.speechRate());
    }
  }

  imprimerFicheCours() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  arreterVocal() {
    this.voice.stop();
    this.activeVoiceTarget.set(null);
  }

  getSoumissionBadgeClass(statut: string): string {
    switch (statut) {
      case 'VALIDEE': return 'badge-success';
      case 'A_REVOIR': return 'badge-danger';
      default: return 'badge-warning';
    }
  }
}
