import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { FormationResponse, DomaineResponse, SoumissionResponse } from '../../core/models/models';

@Component({
  selector: 'app-formateur-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="min-height: 85vh; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container">
        
        <!-- Header -->
        <div style="margin-bottom: 3rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge badge-purple" style="margin-bottom: 0.5rem;">Espace Pédagogique</span>
            <h1 style="font-size: 2.75rem; margin-bottom: 0.25rem; color: #ffffff;">Console Formateur & Mentor</h1>
            <p style="color: #94a3b8; font-size: 1.05rem;">
              Créez des cours 100% pratiques et supervisez les projets de code soumis par les apprenants.
            </p>
          </div>
          <button (click)="openCreateCourseModal()" class="btn btn-cyber btn-lg">
            ➕ Créer une Formation Pratique
          </button>
        </div>

        <!-- Section: Soumissions à Évaluer -->
        <div style="margin-bottom: 4rem;">
          <h2 style="font-size: 1.6rem; color: #ffffff; display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.5rem;">
            <span>📝</span> Soumissions de Code en Attente d'Évaluation ({{ aEvaluer().length }})
          </h2>

          <div *ngIf="aEvaluer().length > 0; else noPendingTpl" class="card">
            <div class="card-body" style="padding: 0;">
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                  <thead>
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); background: rgba(15, 23, 42, 0.6); color: #94a3b8; font-weight: 700; font-family: var(--font-display);">
                      <th style="padding: 1rem 1.4rem;">Apprenant</th>
                      <th style="padding: 1rem 1.4rem;">Exercice</th>
                      <th style="padding: 1rem 1.4rem;">Dépôt GitHub</th>
                      <th style="padding: 1rem 1.4rem;">Date</th>
                      <th style="padding: 1rem 1.4rem; text-align: right;">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let sub of aEvaluer()" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                      <td style="padding: 1.15rem 1.4rem; font-weight: 700; color: #ffffff;">
                        {{ sub.apprenantNom }}
                      </td>
                      <td style="padding: 1.15rem 1.4rem; color: #cbd5e1;">
                        {{ sub.exerciceTitre }}
                      </td>
                      <td style="padding: 1.15rem 1.4rem;">
                        <a [href]="sub.lienDepot" target="_blank" rel="noopener" style="color: var(--neon-cyan); font-weight: 700;">
                          Inspecter GitHub ↗
                        </a>
                      </td>
                      <td style="padding: 1.15rem 1.4rem; color: #64748b; font-size: 0.85rem;">
                        {{ sub.dateSoumission | date:'short' }}
                      </td>
                      <td style="padding: 1.15rem 1.4rem; text-align: right;">
                        <button (click)="openEvalModal(sub)" class="btn btn-accent btn-sm">
                          Évaluer & Noter
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <ng-template #noPendingTpl>
            <div class="card" style="padding: 3rem; text-align: center; color: #64748b;">
              ✓ Aucune soumission en attente d'évaluation manuelle pour le moment.
            </div>
          </ng-template>
        </div>

        <!-- Section: Mes Formations -->
        <div>
          <h2 style="font-size: 1.6rem; color: #ffffff; margin-bottom: 1.5rem;">
            Mes Formations Actives ({{ mesFormations().length }})
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let form of mesFormations()" class="card card-hover">
              <div class="card-body">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                  <span class="badge badge-primary">{{ form.domaineCode }}</span>
                  <span class="badge badge-slate">{{ form.niveau }}</span>
                </div>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; color: #ffffff;">{{ form.titre }}</h3>
                <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem;">
                  {{ apercu(form.description) }}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1rem;">
                  <a [routerLink]="['/formations', form.id]" class="btn btn-outline btn-sm">
                    Gérer le contenu
                  </a>
                  <button (click)="openAddExoModal(form.id)" class="btn btn-cyber btn-sm">
                    ➕ Exercice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Create Course Modal -->
    <div *ngIf="showCreateModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.5rem; margin: 0; color: #ffffff;">Créer une formation pratique</h3>
          <button (click)="showCreateModal = false" style="background: none; border: none; font-size: 1.75rem; color: #94a3b8; cursor: pointer;">×</button>
        </div>

        <form (ngSubmit)="creerFormation()">
          <div class="form-group">
            <label class="form-label">Titre de la formation</label>
            <input type="text" name="titre" [(ngModel)]="nouvelleFormation.titre" required class="form-input" placeholder="Ex : Microservices Spring Boot & Déploiement Cloud">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Niveau</label>
              <select name="niveau" [(ngModel)]="nouvelleFormation.niveau" class="form-select">
                <option value="DEBUTANT">Débutant</option>
                <option value="INTERMEDIAIRE">Intermédiaire</option>
                <option value="AVANCE">Avancé</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Domaine / Filière</label>
              <select name="domaineId" [(ngModel)]="nouvelleFormation.domaineId" class="form-select" required>
                <option *ngFor="let dom of domaines()" [ngValue]="dom.id">{{ dom.nom }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description pédagogique et compétences visées</label>
            <textarea name="description" [(ngModel)]="nouvelleFormation.description" required class="form-textarea" placeholder="Détaillez le fil conducteur pratique de la formation..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.85rem; margin-top: 2rem;">
            <button type="button" (click)="showCreateModal = false" class="btn btn-outline">Annuler</button>
            <button type="submit" [disabled]="submittingForm()" class="btn btn-cyber">
              <span *ngIf="submittingForm()" class="spinner"></span>
              <span *ngIf="!submittingForm()">Créer la formation ➔</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Evaluation Modal -->
    <div *ngIf="showEvalModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.5rem; margin: 0; color: #ffffff;">Évaluation de la soumission</h3>
          <button (click)="showEvalModal = false" style="background: none; border: none; font-size: 1.75rem; color: #94a3b8; cursor: pointer;">×</button>
        </div>

        <div style="margin-bottom: 1.5rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 1.25rem; border-radius: var(--radius-lg);">
          <div style="color: #ffffff;">Apprenant : <strong style="color: var(--neon-cyan);">{{ currentSub?.apprenantNom }}</strong></div>
          <div style="color: #cbd5e1; margin-top: 0.25rem;">Exercice : <strong>{{ currentSub?.exerciceTitre }}</strong></div>
          <div style="margin-top: 0.25rem;">Dépôt : <a [href]="currentSub?.lienDepot" target="_blank" rel="noopener" style="color: var(--neon-cyan); font-weight: 700;">{{ currentSub?.lienDepot }} ↗</a></div>
        </div>

        <form (ngSubmit)="validerEvaluation()">
          <div class="form-group">
            <label class="form-label">Note attribuée (0 à 100) — Note &ge; 70 valide l'exercice</label>
            <input type="number" name="evalNote" [(ngModel)]="evalNote" min="0" max="100" required class="form-input" placeholder="85">
          </div>

          <div class="form-group">
            <label class="form-label">Feedback constructif pour l'apprenant</label>
            <textarea name="evalFeedback" [(ngModel)]="evalFeedback" required class="form-textarea" placeholder="Remarques sur le code, conformité aux critères, axes de perfectionnement..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.85rem; margin-top: 2rem;">
            <button type="button" (click)="showEvalModal = false" class="btn btn-outline">Annuler</button>
            <button type="submit" [disabled]="evaluating()" class="btn btn-accent">
              <span *ngIf="evaluating()" class="spinner"></span>
              <span *ngIf="!evaluating()">Enregistrer l'évaluation ➔</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Exercise Modal -->
    <div *ngIf="showAddExoModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.5rem; margin: 0; color: #ffffff;">Ajouter un exercice pratique</h3>
          <button (click)="showAddExoModal = false" style="background: none; border: none; font-size: 1.75rem; color: #94a3b8; cursor: pointer;">×</button>
        </div>

        <form (ngSubmit)="creerExercice()">
          <div class="form-group">
            <label class="form-label">Titre de l'exercice</label>
            <input type="text" name="exoTitre" [(ngModel)]="nouvelExercice.titre" required class="form-input" placeholder="Ex : Implémentation des Repositories & Tests JPA">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Numéro d'ordre</label>
              <input type="number" name="exoOrdre" [(ngModel)]="nouvelExercice.ordre" min="1" required class="form-input">
            </div>
            <div class="form-group" style="display: flex; align-items: center; gap: 0.6rem; margin-top: 1.75rem;">
              <input type="checkbox" id="modalFinal" name="projetFinal" [(ngModel)]="nouvelExercice.projetFinal" style="width: 1.25rem; height: 1.25rem; accent-color: var(--neon-cyan);">
              <label for="modalFinal" style="font-size: 0.95rem; font-weight: 700; color: #fde68a;">🏆 Projet Final Certifiant</label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Consigne détaillée</label>
            <textarea name="exoConsigne" [(ngModel)]="nouvelExercice.consigne" required class="form-textarea" placeholder="Décrivez les fonctionnalités concrètes à développer..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Critères de validation (pour l'IA Claude et le formateur)</label>
            <textarea name="exoCriteres" [(ngModel)]="nouvelExercice.criteres" required class="form-textarea" placeholder="Spécifiez les classes, méthodes ou tests obligatoires..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.85rem; margin-top: 2rem;">
            <button type="button" (click)="showAddExoModal = false" class="btn btn-outline">Annuler</button>
            <button type="submit" [disabled]="submittingExo()" class="btn btn-cyber">
              <span *ngIf="submittingExo()" class="spinner"></span>
              <span *ngIf="!submittingExo()">Ajouter l'exercice ➔</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FormateurDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  public mesFormations = signal<FormationResponse[]>([]);
  public aEvaluer = signal<SoumissionResponse[]>([]);
  public domaines = signal<DomaineResponse[]>([]);

  // Create course
  public showCreateModal = false;
  public submittingForm = signal(false);
  public nouvelleFormation = {
    titre: '',
    description: '',
    niveau: 'DEBUTANT',
    domaineId: 1
  };

  // Eval
  public showEvalModal = false;
  public currentSub: SoumissionResponse | null = null;
  public evalNote = 80;
  public evalFeedback = '';
  public evaluating = signal(false);

  // Add exercise
  public showAddExoModal = false;
  public targetFormationId: number | null = null;
  public submittingExo = signal(false);
  public nouvelExercice = {
    titre: '',
    consigne: '',
    criteres: '',
    ordre: 1,
    projetFinal: false
  };

  apercu(texte?: string): string {
    if (!texte) return '';
    return texte.length > 110 ? texte.slice(0, 110) + '…' : texte;
  }

  ngOnInit() {
    this.chargerDonnees();
    this.api.getDomaines().subscribe({
      next: data => {
        this.domaines.set(data);
        if (data.length > 0) this.nouvelleFormation.domaineId = data[0].id;
      }
    });
  }

  chargerDonnees() {
    this.api.getFormations().subscribe({
      next: data => this.mesFormations.set(data)
    });

    this.api.getSoumissionsAEvaluer().subscribe({
      next: data => this.aEvaluer.set(data)
    });
  }

  openCreateCourseModal() {
    this.showCreateModal = true;
  }

  creerFormation() {
    this.submittingForm.set(true);
    this.api.createFormation(this.nouvelleFormation).subscribe({
      next: () => {
        this.submittingForm.set(false);
        this.showCreateModal = false;
        this.toast.success('Formation créée avec succès !');
        this.chargerDonnees();
      },
      error: (err) => {
        this.submittingForm.set(false);
        const msg = err.error?.message || 'Erreur lors de la création.';
        this.toast.error(msg);
      }
    });
  }

  openEvalModal(sub: SoumissionResponse) {
    this.currentSub = sub;
    this.evalNote = sub.note || 80;
    this.evalFeedback = sub.feedback || '';
    this.showEvalModal = true;
  }

  validerEvaluation() {
    if (!this.currentSub) return;

    this.evaluating.set(true);
    this.api.evaluerSoumission(this.currentSub.id, {
      note: this.evalNote,
      feedback: this.evalFeedback
    }).subscribe({
      next: () => {
        this.evaluating.set(false);
        this.showEvalModal = false;
        this.toast.success('Évaluation enregistrée avec succès !');
        this.chargerDonnees();
      },
      error: (err) => {
        this.evaluating.set(false);
        const msg = err.error?.message || 'Erreur lors de l\'évaluation.';
        this.toast.error(msg);
      }
    });
  }

  openAddExoModal(formationId: number) {
    this.targetFormationId = formationId;
    this.nouvelExercice = {
      titre: '',
      consigne: '',
      criteres: '',
      ordre: 1,
      projetFinal: false
    };
    this.showAddExoModal = true;
  }

  creerExercice() {
    if (!this.targetFormationId) return;

    this.submittingExo.set(true);
    this.api.createExercice(this.targetFormationId, this.nouvelExercice).subscribe({
      next: () => {
        this.submittingExo.set(false);
        this.showAddExoModal = false;
        this.toast.success('Exercice ajouté avec succès à la formation !');
      },
      error: (err) => {
        this.submittingExo.set(false);
        const msg = err.error?.message || 'Erreur lors de l\'ajout de l\'exercice.';
        this.toast.error(msg);
      }
    });
  }
}
