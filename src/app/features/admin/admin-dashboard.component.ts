import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { AdminStatsResponse, AdminUserResponse, OffreResponse, DomaineResponse } from '../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="min-height: 85vh; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container">
        
        <!-- Header -->
        <div style="margin-bottom: 3rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.85rem; border-radius: var(--radius-full); background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; font-size: 0.8rem; font-weight: 800; font-family: var(--font-display); letter-spacing: 0.05em; margin-bottom: 0.5rem;">
              <span class="pulsing-dot" style="background-color: var(--neon-rose); box-shadow: 0 0 10px var(--neon-rose);"></span>
              <span>CONSOLE D'ADMINISTRATION CENTRALE</span>
            </div>
            <h1 style="font-size: 2.75rem; margin-bottom: 0.25rem; color: #ffffff;">Supervision Globale FELC</h1>
            <p style="color: #94a3b8; font-size: 1.05rem;">
              Métriques en temps réel, modération du catalogue, activation de comptes et création de filières.
            </p>
          </div>
          <button (click)="showNewDomaineModal = true" class="btn btn-cyber btn-lg">
            ➕ Nouveau Domaine Métier
          </button>
        </div>

        <!-- Metric Stat Cards with Neon Accents -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6" style="margin-bottom: 3.5rem;" *ngIf="stats() as s">
          <div class="card" style="border-top: 3px solid var(--neon-cyan); box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.8);">
            <div class="card-body">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Total Utilisateurs</div>
              <div style="font-size: 2.5rem; font-weight: 800; color: #ffffff; font-family: var(--font-display); margin: 0.35rem 0;">{{ s.utilisateurs }}</div>
              <div style="font-size: 0.8rem; color: var(--neon-cyan);">
                {{ s.apprenants }} apprenants · {{ s.formateurs }} formateurs · {{ s.entreprises }} entreprises
              </div>
            </div>
          </div>

          <div class="card" style="border-top: 3px solid var(--neon-emerald); box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.8);">
            <div class="card-body">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Formations & Soumissions</div>
              <div style="font-size: 2.5rem; font-weight: 800; color: #34d399; font-family: var(--font-display); margin: 0.35rem 0;">{{ s.formations }}</div>
              <div style="font-size: 0.8rem; color: #94a3b8;">
                {{ s.soumissionsEnAttente }} soumissions en attente · {{ s.inscriptions }} inscriptions
              </div>
            </div>
          </div>

          <div class="card" style="border-top: 3px solid var(--neon-amber); box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.8);">
            <div class="card-body">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Certificats Délivrés</div>
              <div style="font-size: 2.5rem; font-weight: 800; color: #facc15; font-family: var(--font-display); margin: 0.35rem 0;">{{ s.certificats }}</div>
              <div style="font-size: 0.8rem; color: #94a3b8;">
                📜 Diplômes uniques infalsifiables
              </div>
            </div>
          </div>

          <div class="card" style="border-top: 3px solid var(--neon-purple); box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.8);">
            <div class="card-body">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Offres & Candidatures</div>
              <div style="font-size: 2.5rem; font-weight: 800; color: #d8b4fe; font-family: var(--font-display); margin: 0.35rem 0;">{{ s.offresOuvertes }}</div>
              <div style="font-size: 0.8rem; color: #94a3b8;">
                {{ s.candidatures }} candidatures · {{ s.offresFermees }} offres fermées
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
          <button 
            (click)="activeTab = 'users'"
            [style.color]="activeTab === 'users' ? 'var(--neon-cyan)' : '#94a3b8'"
            [style.border-bottom]="activeTab === 'users' ? '2px solid var(--neon-cyan)' : 'none'"
            style="background: none; border: none; font-weight: 700; font-size: 1.1rem; font-family: var(--font-display); padding: 0.85rem 1.25rem; cursor: pointer;"
          >
            👥 Gestion des Utilisateurs ({{ users().length }})
          </button>
          <button 
            (click)="activeTab = 'offres'"
            [style.color]="activeTab === 'offres' ? 'var(--neon-cyan)' : '#94a3b8'"
            [style.border-bottom]="activeTab === 'offres' ? '2px solid var(--neon-cyan)' : 'none'"
            style="background: none; border: none; font-weight: 700; font-size: 1.1rem; font-family: var(--font-display); padding: 0.85rem 1.25rem; cursor: pointer;"
          >
            💼 Modération des Offres ({{ offres().length }})
          </button>
        </div>

        <!-- Tab 1: Users -->
        <div *ngIf="activeTab === 'users'" class="card">
          <div class="card-body" style="padding: 0;">
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                <thead>
                  <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); background: rgba(15, 23, 42, 0.6); color: #94a3b8; font-weight: 700; font-family: var(--font-display);">
                    <th style="padding: 1rem 1.4rem;">Nom & Prénom</th>
                    <th style="padding: 1rem 1.4rem;">Email</th>
                    <th style="padding: 1rem 1.4rem;">Rôle</th>
                    <th style="padding: 1rem 1.4rem;">Date Inscription</th>
                    <th style="padding: 1rem 1.4rem;">Statut</th>
                    <th style="padding: 1rem 1.4rem; text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let u of users()" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                    <td style="padding: 1.15rem 1.4rem; font-weight: 700; color: #ffffff;">
                      {{ u.prenom }} {{ u.nom }}
                    </td>
                    <td style="padding: 1.15rem 1.4rem; color: #cbd5e1;">
                      {{ u.email }}
                    </td>
                    <td style="padding: 1.15rem 1.4rem;">
                      <span class="badge" [ngClass]="getRoleBadgeClass(u.role)">
                        {{ u.role }}
                      </span>
                    </td>
                    <td style="padding: 1.15rem 1.4rem; color: #64748b; font-size: 0.85rem;">
                      {{ u.dateInscription | date:'shortDate' }}
                    </td>
                    <td style="padding: 1.15rem 1.4rem;">
                      <span class="badge" [ngClass]="u.actif ? 'badge-success' : 'badge-danger'">
                        {{ u.actif ? 'ACTIF' : 'DÉSACTIVÉ' }}
                      </span>
                    </td>
                    <td style="padding: 1.15rem 1.4rem; text-align: right;">
                      <button 
                        (click)="toggleActivation(u)" 
                        class="btn btn-sm"
                        [ngClass]="u.actif ? 'btn-danger' : 'btn-accent'"
                        [disabled]="u.role === 'ADMIN'"
                      >
                        {{ u.actif ? 'Bloquer' : 'Activer' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab 2: Offres -->
        <div *ngIf="activeTab === 'offres'" class="card">
          <div class="card-body" style="padding: 0;">
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                <thead>
                  <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); background: rgba(15, 23, 42, 0.6); color: #94a3b8; font-weight: 700; font-family: var(--font-display);">
                    <th style="padding: 1rem 1.4rem;">Titre</th>
                    <th style="padding: 1rem 1.4rem;">Entreprise</th>
                    <th style="padding: 1rem 1.4rem;">Type</th>
                    <th style="padding: 1rem 1.4rem;">Budget</th>
                    <th style="padding: 1rem 1.4rem;">Statut</th>
                    <th style="padding: 1rem 1.4rem; text-align: right;">Modération</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let off of offres()" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                    <td style="padding: 1.15rem 1.4rem; font-weight: 700; color: #ffffff;">
                      {{ off.titre }}
                    </td>
                    <td style="padding: 1.15rem 1.4rem; color: #cbd5e1;">
                      {{ off.entrepriseNom }}
                    </td>
                    <td style="padding: 1.15rem 1.4rem;">
                      <span class="badge badge-primary">{{ off.type }}</span>
                    </td>
                    <td style="padding: 1.15rem 1.4rem; font-weight: 800; font-family: var(--font-display); color: #facc15;">
                      {{ off.budget | number }} FCFA
                    </td>
                    <td style="padding: 1.15rem 1.4rem;">
                      <span class="badge" [ngClass]="off.statut === 'OUVERTE' ? 'badge-success' : 'badge-danger'">
                        {{ off.statut }}
                      </span>
                    </td>
                    <td style="padding: 1.15rem 1.4rem; text-align: right;">
                      <button (click)="toggleOffreStatut(off)" class="btn btn-outline btn-sm">
                        {{ off.statut === 'OUVERTE' ? '🔒 Fermer' : '🔓 Rouvrir' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Create Domaine Modal -->
    <div *ngIf="showNewDomaineModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.5rem; margin: 0; color: #ffffff;">Créer un nouveau Domaine Métier</h3>
          <button (click)="showNewDomaineModal = false" style="background: none; border: none; font-size: 1.75rem; color: #94a3b8; cursor: pointer;">×</button>
        </div>

        <form (ngSubmit)="creerDomaine()">
          <div class="form-group">
            <label class="form-label">Nom du Domaine (ex: Informatique & Web, Agriculture Intelligente)</label>
            <input type="text" name="nom" [(ngModel)]="nouveauDomaine.nom" required class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">Code Court (2 à 6 caractères, ex: INFO, AGRI, MKT, ENER)</label>
            <input type="text" name="code" [(ngModel)]="nouveauDomaine.code" required maxlength="6" class="form-input" style="text-transform: uppercase; font-family: var(--font-mono);">
          </div>

          <div class="form-group">
            <label class="form-label">Description du secteur</label>
            <textarea name="description" [(ngModel)]="nouveauDomaine.description" class="form-textarea"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.85rem; margin-top: 2rem;">
            <button type="button" (click)="showNewDomaineModal = false" class="btn btn-outline">Annuler</button>
            <button type="submit" [disabled]="submittingDomaine()" class="btn btn-cyber">
              <span *ngIf="submittingDomaine()" class="spinner"></span>
              <span *ngIf="!submittingDomaine()">Enregistrer le domaine ➔</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  public stats = signal<AdminStatsResponse | null>(null);
  public users = signal<AdminUserResponse[]>([]);
  public offres = signal<OffreResponse[]>([]);
  public activeTab: 'users' | 'offres' = 'users';

  // New Domaine Modal
  public showNewDomaineModal = false;
  public submittingDomaine = signal(false);
  public nouveauDomaine = {
    nom: '',
    code: '',
    description: ''
  };

  ngOnInit() {
    this.chargerDonnees();
  }

  chargerDonnees() {
    this.api.getAdminStats().subscribe({
      next: data => this.stats.set(data)
    });

    this.api.getAdminUsers().subscribe({
      next: data => this.users.set(data)
    });

    this.api.getAdminOffres().subscribe({
      next: data => this.offres.set(data)
    });
  }

  toggleActivation(u: AdminUserResponse) {
    const nouveauStatut = !u.actif;
    this.api.changerActivationUser(u.id, nouveauStatut).subscribe({
      next: () => {
        this.toast.success(`Utilisateur ${u.email} ${nouveauStatut ? 'activé' : 'désactivé'}.`);
        this.chargerDonnees();
      },
      error: () => this.toast.error('Erreur lors du changement de statut.')
    });
  }

  toggleOffreStatut(off: OffreResponse) {
    const nouveauStatut = off.statut === 'OUVERTE' ? 'FERMEE' : 'OUVERTE';
    this.api.changerStatutOffre(off.id, nouveauStatut).subscribe({
      next: () => {
        this.toast.success(`Offre passée à ${nouveauStatut}`);
        this.chargerDonnees();
      }
    });
  }

  creerDomaine() {
    if (!this.nouveauDomaine.nom || !this.nouveauDomaine.code) {
      this.toast.error('Veuillez renseigner le nom et le code du domaine.');
      return;
    }

    this.submittingDomaine.set(true);
    this.api.createDomaine(this.nouveauDomaine).subscribe({
      next: () => {
        this.submittingDomaine.set(false);
        this.showNewDomaineModal = false;
        this.toast.success('Domaine créé avec succès !');
        this.nouveauDomaine = { nom: '', code: '', description: '' };
        this.chargerDonnees();
      },
      error: (err) => {
        this.submittingDomaine.set(false);
        const msg = err.error?.message || 'Erreur lors de la création du domaine.';
        this.toast.error(msg);
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'badge-danger';
      case 'FORMATEUR': return 'badge-purple';
      case 'ENTREPRISE': return 'badge-warning';
      default: return 'badge-success';
    }
  }
}
