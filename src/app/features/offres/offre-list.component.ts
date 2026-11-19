import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { OffreResponse, DomaineResponse, TypeOffre } from '../../core/models/models';

@Component({
  selector: 'app-offre-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="min-height: 85vh; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container">
        
        <!-- Header -->
        <div style="margin-bottom: 3rem;">
          <span class="badge badge-warning" style="margin-bottom: 0.75rem;">Marché & Débouchés</span>
          <h1 style="font-size: 2.75rem; margin-bottom: 0.75rem; color: #ffffff;">
            Offres d'Emploi & Missions Freelance
          </h1>
          <p style="color: #94a3b8; font-size: 1.1rem; max-width: 750px;">
            Accédez à des opportunités concrètes publiées par des entreprises togolaises et régionales qui recrutent sur la base de vos projets réels.
          </p>
        </div>

        <!-- Filter Card -->
        <div class="card" style="margin-bottom: 3rem; padding: 1.5rem; box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.8);">
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;" class="md:grid-cols-3">
              <div>
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery" 
                  placeholder="🔍 Rechercher (ex: Développeur, Lomé...)" 
                  class="form-input"
                >
              </div>

              <div>
                <select [(ngModel)]="selectedType" class="form-select">
                  <option value="">Tous types (Emploi & Freelance)</option>
                  <option value="EMPLOI">💼 Emploi (CDI, CDD, Stage)</option>
                  <option value="MISSION">⚡ Mission Freelance</option>
                </select>
              </div>

              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <input 
                  type="checkbox" 
                  id="remoteOnly" 
                  [(ngModel)]="remoteOnly"
                  style="width: 1.25rem; height: 1.25rem; accent-color: var(--neon-cyan); cursor: pointer;"
                >
                <label for="remoteOnly" style="font-size: 0.95rem; font-weight: 600; color: #cbd5e1; cursor: pointer;">
                  🌐 Télétravail autorisé uniquement
                </label>
              </div>
            </div>

            <!-- Domaine filter buttons -->
            <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
              <span style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Filière :</span>
              <button 
                (click)="selectedDomaineId = null" 
                class="badge" 
                [ngClass]="selectedDomaineId === null ? 'badge-cyber' : 'badge-slate'"
                style="cursor: pointer; border: none; padding: 0.45rem 1rem;"
              >
                Toutes
              </button>
              <button 
                *ngFor="let dom of domaines()" 
                (click)="selectedDomaineId = dom.id" 
                class="badge" 
                [ngClass]="selectedDomaineId === dom.id ? 'badge-cyber' : 'badge-slate'"
                style="cursor: pointer; border: none; padding: 0.45rem 1rem;"
              >
                {{ dom.nom }}
              </button>
            </div>

          </div>
        </div>

        <!-- Offres Grid -->
        <div *ngIf="filteredOffres().length > 0; else noOffresTpl" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let off of filteredOffres()" class="card card-hover" style="display: flex; flex-direction: column;">
            <div class="card-body" style="display: flex; flex-direction: column; height: 100%;">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                <span class="badge" [ngClass]="off.type === 'MISSION' ? 'badge-purple' : 'badge-primary'">
                  {{ off.type }}
                </span>
                <span *ngIf="off.remote" class="badge badge-success">🌐 Télétravail</span>
              </div>

              <h2 style="font-size: 1.35rem; margin-bottom: 0.4rem; color: #ffffff;">
                {{ off.titre }}
              </h2>

              <div style="font-size: 0.9rem; font-weight: 600; color: var(--neon-cyan); margin-bottom: 1rem;">
                🏢 {{ off.entrepriseNom }} • 📍 {{ off.localisation }}
              </div>

              <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; flex: 1;">
                {{ apercu(off.description) }}
              </p>

              <div style="background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-lg); padding: 0.75rem 1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; font-size: 0.85rem; color: #94a3b8;">
                <span>Expérience : <strong style="color: #ffffff;">{{ off.experienceMin }} an(s)</strong></span>
                <span>Filière : <strong style="color: #ffffff;">{{ off.domaineNom }}</strong></span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.25rem; margin-top: auto;">
                <div>
                  <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">Rémunération / Budget</div>
                  <div style="font-weight: 800; color: #facc15; font-size: 1.15rem; font-family: var(--font-display);">
                    {{ off.budget | number }} FCFA
                  </div>
                </div>
                <a [routerLink]="['/offres', off.id]" class="btn btn-cyber btn-sm">
                  Voir l'offre →
                </a>
              </div>

            </div>
          </div>
        </div>

        <ng-template #noOffresTpl>
          <div class="card" style="padding: 4.5rem 2rem; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">💼</div>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; color: #ffffff;">Aucune offre ne correspond à vos filtres</h3>
            <p style="color: #94a3b8; margin-bottom: 1.5rem;">
              Modifiez vos critères pour afficher d'autres opportunités.
            </p>
            <button (click)="resetFilters()" class="btn btn-outline">
              Réinitialiser les filtres
            </button>
          </div>
        </ng-template>

      </div>
    </div>
  `
})
export class OffreListComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  public allOffres = signal<OffreResponse[]>([]);
  public domaines = signal<DomaineResponse[]>([]);

  public searchQuery = '';
  public selectedType = '';
  public selectedDomaineId: number | null = null;
  public remoteOnly = false;

  public filteredOffres = computed(() => {
    let list = this.allOffres();

    if (this.selectedType) {
      list = list.filter(o => o.type === this.selectedType);
    }

    if (this.selectedDomaineId) {
      list = list.filter(o => o.domaineId === this.selectedDomaineId);
    }

    if (this.remoteOnly) {
      list = list.filter(o => o.remote === true);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(o => 
        o.titre.toLowerCase().includes(q) || 
        o.description.toLowerCase().includes(q) ||
        o.entrepriseNom.toLowerCase().includes(q) ||
        o.localisation.toLowerCase().includes(q)
      );
    }

    return list;
  });

  apercu(texte?: string): string {
    if (!texte) return '';
    return texte.length > 120 ? texte.slice(0, 120) + '…' : texte;
  }

  ngOnInit() {
    this.api.getOffres().subscribe({
      next: data => this.allOffres.set(data),
      error: () => {}
    });

    this.api.getDomaines().subscribe({
      next: data => this.domaines.set(data),
      error: () => {}
    });

    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.selectedType = params['type'];
      }
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedDomaineId = null;
    this.remoteOnly = false;
  }
}
