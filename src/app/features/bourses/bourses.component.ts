import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

interface BoursePack {
  id: string;
  titre: string;
  coutFcfa: number;
  coutEur: number;
  badge: string;
  badgeClass: string;
  icon: string;
  impactDirect: string;
  points: string[];
}

interface Beneficiaire {
  prenom: string;
  initialeNom: string;
  region: string;
  filiere: string;
  parrainType: string;
  statut: string;
  temoignage: string;
}

@Component({
  selector: 'app-bourses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="position: relative; min-height: 90vh;">
      <div class="ambient-glow-top"></div>
      <div class="ambient-glow-bottom"></div>

      <div class="app-container">
        
        <!-- Header Hero -->
        <div style="text-align: center; max-width: 840px; margin: 0 auto 3.5rem;">
          <div class="badge badge-warning" style="margin-bottom: 1.25rem; font-size: 0.85rem; padding: 0.4rem 1.25rem;">
            <span>🤝</span> Égalité des Chances & Solidarité Panafricaine
          </div>
          <h1 style="font-size: 3rem; margin-bottom: 1.25rem; line-height: 1.15;">
            Bourses Tremplin & <span style="background: var(--grad-sunset); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Micro-Parrainage Solidaire</span>
          </h1>
          <p style="font-size: 1.15rem; color: #cbd5e1; line-height: 1.7;">
            Le talent est universellement réparti, mais pas la bande passante ni le matériel. Diaspora, entreprises et mécènes financent directement la data 4G et les PC reconditionnés pour les apprenants les plus méritants.
          </p>
        </div>

        <!-- 3 Transparent Sponsorship Packs -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6" style="margin-bottom: 4.5rem;">
          
          <div *ngFor="let pack of packs" class="card" [style.border-top]="pack.id === 'data' ? '4px solid var(--neon-cyan)' : pack.id === 'pc' ? '4px solid var(--neon-amber)' : '4px solid var(--neon-purple)'">
            <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between; padding: 2rem;">
              
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                  <span class="badge" [ngClass]="pack.badgeClass">{{ pack.badge }}</span>
                  <span style="font-size: 2rem;">{{ pack.icon }}</span>
                </div>

                <h3 style="font-size: 1.45rem; color: #ffffff; margin-bottom: 0.5rem;">
                  {{ pack.titre }}
                </h3>

                <div style="margin-bottom: 1.25rem; display: flex; align-items: baseline; gap: 0.5rem;">
                  <span style="font-size: 2rem; font-weight: 800; color: #ffffff; font-family: var(--font-display);">
                    {{ pack.coutFcfa | number:'1.0-0' }} FCFA
                  </span>
                  <span style="font-size: 0.9rem; color: #94a3b8;">
                    (~{{ pack.coutEur }} €)
                  </span>
                </div>

                <p style="color: var(--neon-cyan); font-weight: 600; font-size: 0.92rem; margin-bottom: 1.5rem; line-height: 1.5;">
                  ⚡ {{ pack.impactDirect }}
                </p>

                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.88rem; color: #cbd5e1; margin-bottom: 2rem;">
                  <li *ngFor="let pt of pack.points" style="display: flex; align-items: flex-start; gap: 0.5rem;">
                    <span style="color: var(--neon-emerald); font-weight: 800;">✓</span>
                    <span>{{ pt }}</span>
                  </li>
                </ul>
              </div>

              <button (click)="openParrainerModal(pack)" class="btn btn-cyber" style="width: 100%;">
                Parrainer ce Pack ➔
              </button>

            </div>
          </div>

        </div>

        <!-- Transparency & Anti-Waste Guarantee -->
        <div class="card" style="margin-bottom: 4.5rem; border: 1px solid rgba(255, 255, 255, 0.1);">
          <div class="card-body" style="padding: 2.5rem;">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div style="display: flex; gap: 1rem; align-items: flex-start;">
                <div style="width: 3rem; height: 3rem; border-radius: var(--radius-lg); background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--neon-emerald); flex-shrink: 0;">
                  🎯
                </div>
                <div>
                  <h4 style="font-size: 1.1rem; color: #ffffff; margin-bottom: 0.4rem;">Critère de Mérite Strict</h4>
                  <p style="color: #94a3b8; font-size: 0.88rem; line-height: 1.6;">
                    Aucun don à l'aveugle : la bourse 4G n'est débloquée que pour les apprenants ayant validé au moins 2 exercices avec l'IA ou le formateur.
                  </p>
                </div>
              </div>

              <div style="display: flex; gap: 1rem; align-items: flex-start;">
                <div style="width: 3rem; height: 3rem; border-radius: var(--radius-lg); background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.4); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--neon-cyan); flex-shrink: 0;">
                  📱
                </div>
                <div>
                  <h4 style="font-size: 1.1rem; color: #ffffff; margin-bottom: 0.4rem;">Recharge Directe Sans Fuite</h4>
                  <p style="color: #94a3b8; font-size: 0.88rem; line-height: 1.6;">
                    Le forfait data est injecté directement sur le numéro mobile de l'étudiant (Togocel / Moov Africa) sous forme de pass internet non monnayable.
                  </p>
                </div>
              </div>

              <div style="display: flex; gap: 1rem; align-items: flex-start;">
                <div style="width: 3rem; height: 3rem; border-radius: var(--radius-lg); background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--neon-amber); flex-shrink: 0;">
                  📊
                </div>
                <div>
                  <h4 style="font-size: 1.1rem; color: #ffffff; margin-bottom: 0.4rem;">Traçabilité & Certificat</h4>
                  <p style="color: #94a3b8; font-size: 0.88rem; line-height: 1.6;">
                    Le parrain reçoit une notification lorsque son filleul soumet son projet final et décroche son certificat officiel vérifiable FELC-ID.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Recent Beneficiaries Stories -->
        <div style="margin-bottom: 4rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
            <div>
              <span class="badge badge-cyber" style="margin-bottom: 0.4rem;">Témoignages du Terrain</span>
              <h2 style="font-size: 2rem; color: #ffffff;">
                Ils se sont formés grâce à une Bourse Tremplin
              </h2>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let b of beneficiaires" class="card">
              <div class="card-body" style="padding: 1.75rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 2.5rem; height: 2.5rem; border-radius: 50%; background: var(--grad-cyber); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800;">
                      {{ b.prenom.charAt(0) }}
                    </div>
                    <div>
                      <div style="font-weight: 700; color: #ffffff;">{{ b.prenom }} {{ b.initialeNom }}.</div>
                      <div style="font-size: 0.78rem; color: var(--neon-cyan);">📍 {{ b.region }}</div>
                    </div>
                  </div>
                  <span class="badge badge-success" style="font-size: 0.72rem;">{{ b.statut }}</span>
                </div>

                <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.85rem;">
                  Filière : <strong style="color: #ffffff;">{{ b.filiere }}</strong>
                </div>

                <p style="color: #cbd5e1; font-size: 0.88rem; font-style: italic; line-height: 1.6; margin-bottom: 1rem;">
                  "{{ b.temoignage }}"
                </p>

                <div style="border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 0.75rem; font-size: 0.75rem; color: #64748b;">
                  Soutenu par : <strong style="color: #94a3b8;">{{ b.parrainType }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Parrainage Simulation Modal -->
    <div *ngIf="showModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.5rem; margin: 0; color: #ffffff;">
            Parrainer un talent : {{ currentPack?.titre }}
          </h3>
          <button (click)="showModal = false" style="background: none; border: none; font-size: 1.75rem; color: #94a3b8; cursor: pointer;">×</button>
        </div>

        <p style="color: #94a3b8; font-size: 0.92rem; margin-bottom: 1.75rem;">
          Montant : <strong style="color: var(--neon-cyan); font-size: 1.15rem;">{{ currentPack?.coutFcfa | number:'1.0-0' }} FCFA</strong> (~{{ currentPack?.coutEur }} €)
        </p>

        <form (ngSubmit)="validerParrainage()">
          <div class="form-group">
            <label class="form-label">Votre nom ou nom de votre organisation</label>
            <input type="text" [(ngModel)]="parrainNom" name="parrainNom" required class="form-input" placeholder="Ex: Koffi Mensah (Diaspora Paris) / Association Espoir Togo">
          </div>

          <div class="form-group">
            <label class="form-label">Votre adresse e-mail (pour le suivi de l'étudiant)</label>
            <input type="email" [(ngModel)]="parrainEmail" name="parrainEmail" required class="form-input" placeholder="votre.email@domaine.com">
          </div>

          <div class="form-group">
            <label class="form-label">Cibler une région prioritaire (optionnel)</label>
            <select [(ngModel)]="parrainRegion" name="parrainRegion" class="form-select">
              <option value="TOUTES">Peu importe (Priorité à l'étudiant le plus actif)</option>
              <option value="MARITIME">Région Maritime (Lomé)</option>
              <option value="PLATEAUX">Région des Plateaux (Kpalimé, Atakpamé)</option>
              <option value="CENTRALE">Région Centrale (Sokodé)</option>
              <option value="KARA">Région de la Kara (Kara, Bassar)</option>
              <option value="SAVANES">Région des Savanes (Dapaong)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Un message d'encouragement pour votre filleul</label>
            <textarea [(ngModel)]="parrainMessage" name="parrainMessage" class="form-textarea" placeholder="Ex: Bravo pour ton travail sur le module Spring Boot, continue jusqu'au certificat !"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
            <button type="button" (click)="showModal = false" class="btn btn-outline">Annuler</button>
            <button type="submit" [disabled]="isSubmitting()" class="btn btn-cyber">
              <span *ngIf="isSubmitting()" class="spinner"></span>
              <span *ngIf="!isSubmitting()">Confirmer le Parrainage ⚡</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class BoursesComponent {
  private toast = inject(ToastService);

  public showModal = false;
  public currentPack: BoursePack | null = null;
  public isSubmitting = signal(false);

  public parrainNom = '';
  public parrainEmail = '';
  public parrainRegion = 'TOUTES';
  public parrainMessage = '';

  public packs: BoursePack[] = [
    {
      id: 'data',
      titre: 'Pack Connectivité 4G',
      coutFcfa: 5000,
      coutEur: 7.5,
      badge: 'Le plus populaire',
      badgeClass: 'badge-cyber',
      icon: '📡',
      impactDirect: '15 Go d\'internet mobile pour terminer 1 formation certifiante',
      points: [
        'Financement d\'un pass 4G Moov / Togocel',
        'Débloqué après validation du 1er exercice',
        'Permet de cloner les dépôts et soumettre les projets',
        'Rapport de progression envoyé par e-mail au parrain'
      ]
    },
    {
      id: 'pc',
      titre: 'Pack Ordinateur Reconditionné',
      coutFcfa: 85000,
      coutEur: 130,
      badge: 'Impact Maximal',
      badgeClass: 'badge-warning',
      icon: '💻',
      impactDirect: '1 PC portable reconditionné remis en main propre au Togo',
      points: [
        'PC testé, équipé de Linux/VS Code/Java/NodeJS',
        'Attribué aux apprenants ayant validé 3 modules complets',
        'Remise officielle avec convention de travail',
        'Garantie de 1 an et accompagnement technique'
      ]
    },
    {
      id: 'mentorat',
      titre: 'Parrainage Mentorat Diaspora',
      coutFcfa: 0,
      coutEur: 0,
      badge: 'Bénévolat de Compétences',
      badgeClass: 'badge-purple',
      icon: '🧠',
      impactDirect: '1 heure par semaine de revue de code et coaching carrière',
      points: [
        'Mise en relation avec un ingénieur ou pro expérimenté',
        'Conseils pour préparer les entretiens techniques',
        'Revue approfondie des bonnes pratiques d\'architecture',
        'Partage de réseau professionnel international'
      ]
    }
  ];

  public beneficiaires: Beneficiaire[] = [
    {
      prenom: 'Afi',
      initialeNom: 'A.',
      region: 'Kara',
      filiere: 'Développement Full-Stack & APIs Spring Boot',
      parrainType: 'Ingénieure de la diaspora (Bruxelles)',
      statut: 'Certifiée & En Stage',
      temoignage: 'Sans le forfait data de 15 Go offert, je devais attendre la nuit pour avoir le WiFi gratuit à l\'université. J\'ai pu finir mon projet final et j\'ai été recrutée comme développeuse junior.'
    },
    {
      prenom: 'Komla',
      initialeNom: 'D.',
      region: 'Kpalimé',
      filiere: 'Agrotechnologie & IoT Frugal',
      parrainType: 'Entreprise partenaire locale (Lomé)',
      statut: 'En mission freelance',
      temoignage: 'Le pack PC reconditionné m\'a permis de coder mon application de gestion de coopérative de cacao. Aujourd\'hui je facture mes services à 3 groupements agricoles.'
    },
    {
      prenom: 'Essi',
      initialeNom: 'T.',
      region: 'Lomé',
      filiere: 'Architecture Logicielle & Micro-services',
      parrainType: 'Donateur solidaire anonyme',
      statut: 'Certifiée FELC-ID',
      temoignage: 'Le fait de savoir qu\'un parrain croyait en moi m\'a donné la force de terminer tous les modules. Le certificat FELC m\'a permis de prouver mes compétences sans avoir de relations.'
    }
  ];

  openParrainerModal(pack: BoursePack) {
    this.currentPack = pack;
    this.showModal = true;
  }

  validerParrainage() {
    if (!this.parrainNom || !this.parrainEmail) {
      this.toast.error('Veuillez remplir votre nom et votre adresse e-mail.');
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.showModal = false;
      this.toast.success(
        `Merci infiniment ${this.parrainNom} ! Votre engagement pour le ${this.currentPack?.titre} a été enregistré. Un e-mail de confirmation vous a été adressé.`
      );
      this.parrainNom = '';
      this.parrainEmail = '';
      this.parrainMessage = '';
    }, 700);
  }
}
