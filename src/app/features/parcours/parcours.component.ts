import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VoiceService } from '../../core/services/voice.service';

interface Etape {
  id: string;
  ordre: string;
  titre: string;
  detail: string;
  lien: string;
  libelleLien: string;
}

const ETAPES: Etape[] = [
  { id: 'compte', ordre: '01', titre: 'Ouvrir un compte', detail: 'Le compte suffit pour se former, prouver et postuler.', lien: '/auth/register', libelleLien: 'Créer le compte' },
  { id: 'orientation', ordre: '02', titre: 'Choisir une direction', detail: 'Le diagnostic s’appuie sur le catalogue réel et les offres ouvertes.', lien: '/orientation', libelleLien: 'Lancer l’orientation' },
  { id: 'formation', ordre: '03', titre: 'Faire un exercice réel', detail: 'Une formation est une suite de livrables, pas une série de questions fermées.', lien: '/formations', libelleLien: 'Ouvrir le catalogue' },
  { id: 'preuve', ordre: '04', titre: 'Déposer le travail', detail: 'Le dépôt est relu. Au-dessus du seuil, la progression avance. En dessous, on reprend.', lien: '/mes-formations', libelleLien: 'Voir mes formations' },
  { id: 'certificat', ordre: '05', titre: 'Obtenir une preuve publique', detail: 'Le certificat a un code que n’importe qui peut vérifier, sans compte.', lien: '/certificats/verify', libelleLien: 'Vérifier un code' },
  { id: 'montrer', ordre: '06', titre: 'Rendre le portfolio visible', detail: 'Les projets validés s’y retrouvent. On le publie seulement quand on le décide.', lien: '/portfolio/me', libelleLien: 'Mon portfolio' },
  { id: 'candidater', ordre: '07', titre: 'Postuler, puis suivre la réponse', detail: 'Le dossier reste visible : reçu, vu, retenu ou écarté.', lien: '/mes-candidatures', libelleLien: 'Ouvrir le suivi' },
  { id: 'entrainer', ordre: '08', titre: 'Répéter l’entretien et le CV', detail: 'L’analyse de réponse et l’export PDF du CV sont disponibles sans limite.', lien: '/interview-coach', libelleLien: 'S’entraîner' }
];

const FICHE = [
  'Jour 1. Lire la consigne à voix haute et écrire en une phrase ce que le livrable doit prouver.',
  'Jour 2. Découper le travail en trois tâches faisables sans réseau, sur papier si besoin.',
  'Jour 3. Produire un premier résultat incomplet et noter ce qui bloque.',
  'Jour 4. Reprendre le blocage avec une question précise pour le forum.',
  'Jour 5. Déposer le lien, lire le retour, corriger un seul point.',
  'Jour 6. Relire le portfolio : un projet, un certificat, une phrase claire.',
  'Jour 7. Envoyer une candidature courte qui cite ce projet.'
];

@Component({
  selector: 'app-parcours',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="section-py">
      <div class="app-container">
        <div style="max-width: 760px; margin-bottom: 2.5rem;">
          <span class="badge badge-success">Ordre du parcours</span>
          <h1 style="margin: 0.8rem 0 0.7rem;">Huit étapes, dans cet ordre.</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem;">
            On ne postule pas avant d’avoir quelque chose à montrer.
            Cochez une étape quand elle est faite : la liste reste dans ce navigateur, même hors ligne.
          </p>
        </div>

        <ol style="list-style: none; display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 2.5rem;">
          <li *ngFor="let etape of etapes" class="card">
            <div class="card-body" style="display: grid; grid-template-columns: auto 1fr; gap: 1rem; align-items: start;">
              <button type="button" (click)="basculer(etape.id)" [attr.aria-pressed]="fait(etape.id)" class="btn btn-sm" [ngClass]="fait(etape.id) ? 'btn-accent' : 'btn-outline'">
                {{ fait(etape.id) ? 'Fait' : etape.ordre }}
              </button>
              <div>
                <h2 style="font-size: 1.15rem; margin-bottom: 0.3rem;">{{ etape.titre }}</h2>
                <p style="color: var(--text-muted); margin-bottom: 0.7rem;">{{ etape.detail }}</p>
                <a [routerLink]="etape.lien">{{ etape.libelleLien }}</a>
              </div>
            </div>
          </li>
        </ol>

        <p style="margin-bottom: 2rem; color: var(--text-muted);">{{ faites() }} étape(s) cochée(s) sur {{ etapes.length }}.</p>

        <section class="card">
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; align-items: center; margin-bottom: 1rem;">
              <div>
                <h2 style="font-size: 1.35rem;">Fiche de sept jours, lisible sans réseau</h2>
                <p style="color: var(--text-muted);">Elle ne charge aucune donnée. On peut l’écouter.</p>
              </div>
              <button type="button" class="btn btn-outline" (click)="lireFiche()" [disabled]="!voice.isSupported()">
                {{ voice.isSpeaking() ? 'Arrêter la lecture' : 'Écouter la fiche' }}
              </button>
            </div>
            <ol style="display: flex; flex-direction: column; gap: 0.55rem; padding-left: 1.2rem; color: #d7e2dc;">
              <li *ngFor="let ligne of fiche">{{ ligne }}</li>
            </ol>
            <p style="margin-top: 1.25rem; color: var(--text-dim);">
              Le mode économie de données, dans la barre du haut, enlève les effets graphiques sur une connexion lente.
              <a routerLink="/bourses">Voir les bourses</a>
              ·
              <a routerLink="/mes-candidatures">Suivre une candidature</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  `
})
export class ParcoursComponent {
  readonly voice = inject(VoiceService);
  readonly etapes = ETAPES;
  readonly fiche = FICHE;
  private readonly storageKey = 'felc_parcours';
  private readonly coches = signal<string[]>(this.lire());
  readonly faites = computed(() => this.coches().length);

  fait(id: string): boolean {
    return this.coches().includes(id);
  }

  basculer(id: string) {
    const next = this.fait(id) ? this.coches().filter(item => item !== id) : [...this.coches(), id];
    this.coches.set(next);
    localStorage.setItem(this.storageKey, JSON.stringify(next));
  }

  lireFiche() {
    this.voice.toggle(this.fiche.join(' '));
  }

  private lire(): string[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string') : [];
    } catch {
      return [];
    }
  }
}
