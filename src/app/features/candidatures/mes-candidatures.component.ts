import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CandidatureResponse, StatutCandidature } from '../../core/models/models';

@Component({
  selector: 'app-mes-candidatures',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="section-py">
      <div class="app-container" style="max-width: 920px;">
        <div style="margin-bottom: 2rem;">
          <span class="badge badge-primary">Après la candidature</span>
          <h1 style="margin: 0.8rem 0 0.6rem;">Où en sont mes candidatures</h1>
          <p style="color: var(--text-muted); max-width: 640px;">
            Chaque envoi reste visible ici. Le statut change quand l’entreprise ouvre, retient ou écarte le dossier.
          </p>
        </div>

        <div *ngIf="chargement()" class="card"><div class="card-body">Chargement des candidatures…</div></div>

        <div *ngIf="!chargement() && erreur()" class="card">
          <div class="card-body">
            <p>Les candidatures ne sont pas joignables pour le moment.</p>
            <button type="button" class="btn btn-outline" style="margin-top: 1rem;" (click)="charger()">Réessayer</button>
          </div>
        </div>

        <div *ngIf="!chargement() && !erreur() && candidatures().length === 0" class="card">
          <div class="card-body">
            <h2 style="font-size: 1.25rem; margin-bottom: 0.4rem;">Aucune candidature envoyée</h2>
            <p style="color: var(--text-muted); margin-bottom: 1rem;">Le suivi commence au premier envoi.</p>
            <a routerLink="/offres" class="btn btn-cyber">Voir les offres</a>
          </div>
        </div>

        <div *ngIf="!chargement() && candidatures().length > 0" style="display: flex; flex-direction: column; gap: 0.85rem;">
          <article *ngFor="let c of candidatures()" class="card">
            <div class="card-body" style="display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
              <div>
                <h2 style="font-size: 1.2rem; margin-bottom: 0.35rem;">{{ c.offreTitre }}</h2>
                <p style="color: var(--text-muted); font-size: 0.92rem;">Envoyée le {{ c.dateCandidature | date:'medium' }}</p>
                <p *ngIf="c.message" style="margin-top: 0.7rem; color: #d7e2dc;">{{ c.message }}</p>
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.6rem;">
                <span class="badge" [ngClass]="classeStatut(c.statut)">{{ libelle(c.statut) }}</span>
                <a [routerLink]="['/offres', c.offreId]" class="btn btn-outline btn-sm">Revoir l’offre</a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  `
})
export class MesCandidaturesComponent implements OnInit {
  private api = inject(ApiService);
  readonly candidatures = signal<CandidatureResponse[]>([]);
  readonly chargement = signal(true);
  readonly erreur = signal(false);

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.chargement.set(true);
    this.erreur.set(false);
    this.api.getMesCandidatures().subscribe({
      next: data => {
        this.candidatures.set(data);
        this.chargement.set(false);
      },
      error: () => {
        this.chargement.set(false);
        this.erreur.set(true);
      }
    });
  }

  libelle(statut: StatutCandidature): string {
    switch (statut) {
      case 'RECUE': return 'Reçue';
      case 'VUE': return 'Vue par l’entreprise';
      case 'ACCEPTEE': return 'Retenue';
      case 'REFUSEE': return 'Non retenue';
      default: return statut;
    }
  }

  classeStatut(statut: StatutCandidature): string {
    switch (statut) {
      case 'ACCEPTEE': return 'badge-success';
      case 'REFUSEE': return 'badge-danger';
      case 'VUE': return 'badge-primary';
      default: return 'badge-warning';
    }
  }
}
