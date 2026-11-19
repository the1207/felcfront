import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SujetResponse, SujetDetailResponse, DomaineResponse } from '../../core/models/models';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="min-height: 85vh; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container">
        
        <!-- Header -->
        <div style="margin-bottom: 3rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge badge-cyber" style="margin-bottom: 0.5rem;">Entraide & Mentorat</span>
            <h1 style="font-size: 2.75rem; margin-bottom: 0.25rem; color: #ffffff;">Forum Communautaire FELC</h1>
            <p style="color: #94a3b8; font-size: 1.05rem;">
              Échangez avec vos pairs, résolvez vos blocages techniques et recevez l'aide d'experts et de formateurs.
            </p>
          </div>
          <button (click)="openNewTopicModal()" class="btn btn-cyber btn-lg">
            💬 Poser une question
          </button>
        </div>

        <!-- Filter Pills -->
        <div class="card" style="margin-bottom: 2.5rem; padding: 1.25rem; box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.8);">
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
            <span style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Filière :</span>
            <button 
              (click)="selectDomaine(null)" 
              class="badge" 
              [ngClass]="selectedDomaineId === null ? 'badge-cyber' : 'badge-slate'"
              style="cursor: pointer; border: none; padding: 0.45rem 1rem;"
            >
              Toutes les discussions
            </button>
            <button 
              *ngFor="let dom of domaines()" 
              (click)="selectDomaine(dom.id)" 
              class="badge" 
              [ngClass]="selectedDomaineId === dom.id ? 'badge-cyber' : 'badge-slate'"
              style="cursor: pointer; border: none; padding: 0.45rem 1rem;"
            >
              {{ dom.nom }}
            </button>
          </div>
        </div>

        <!-- Layout: If a topic is selected, view detail. Otherwise list topics -->
        <div *ngIf="selectedSujet(); else listTpl">
          
          <div style="margin-bottom: 2rem;">
            <button (click)="selectedSujet.set(null)" class="btn btn-outline btn-sm">
              ← Retour à toutes les discussions
            </button>
          </div>

          <!-- Main Question Card -->
          <div class="card" style="margin-bottom: 2.5rem; border-left: 6px solid var(--neon-cyan); box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.8), var(--glow-cyan);">
            <div class="card-body" style="padding: 2.5rem;">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span class="badge badge-primary">{{ selectedSujet()?.domaineNom }}</span>
                  <span class="badge" [ngClass]="selectedSujet()?.resolu ? 'badge-success' : 'badge-warning'">
                    {{ selectedSujet()?.resolu ? 'RÉSOLU ✓' : 'EN DISCUSSION' }}
                  </span>
                </div>
                <div style="font-size: 0.85rem; color: #64748b;">
                  Publié le {{ selectedSujet()?.dateCreation | date:'medium' }}
                </div>
              </div>

              <h2 style="font-size: 2.25rem; margin-bottom: 1.25rem; color: #ffffff;">
                {{ selectedSujet()?.titre }}
              </h2>

              <div style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.7; margin-bottom: 2rem; white-space: pre-wrap;">
                {{ selectedSujet()?.contenu }}
              </div>

              <div style="display: flex; align-items: center; gap: 0.85rem; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.25rem;">
                <div style="width: 2.5rem; height: 2.5rem; border-radius: 50%; background: var(--grad-cyber); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: var(--font-display);">
                  {{ selectedSujet()?.auteurPrenom?.charAt(0) }}
                </div>
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: #ffffff;">
                    {{ selectedSujet()?.auteurPrenom }} {{ selectedSujet()?.auteurNom }}
                  </div>
                  <span class="badge badge-slate" style="font-size: 0.7rem;">
                    {{ selectedSujet()?.auteurRole }}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <!-- Answers List -->
          <div style="margin-bottom: 3rem;">
            <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: #ffffff;">
              Réponses & Échanges ({{ selectedSujet()?.messages?.length || 0 }})
            </h3>

            <div *ngIf="selectedSujet()?.messages?.length; else noRepliesTpl" style="display: flex; flex-direction: column; gap: 1.5rem;">
              <div 
                *ngFor="let msg of selectedSujet()?.messages" 
                class="card"
                [style.border]="msg.estSolution ? '2px solid var(--neon-emerald)' : '1px solid rgba(255, 255, 255, 0.08)'"
                [style.box-shadow]="msg.estSolution ? '0 0 30px rgba(16, 185, 129, 0.25)' : 'none'"
              >
                <div class="card-body">
                  
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div style="width: 2.25rem; height: 2.25rem; border-radius: 50%; background: rgba(255, 255, 255, 0.1); color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
                        {{ msg.auteurPrenom?.charAt(0) }}
                      </div>
                      <div>
                        <strong style="color: #ffffff;">{{ msg.auteurPrenom }} {{ msg.auteurNom }}</strong>
                        <span class="badge badge-slate" style="margin-left: 0.5rem; font-size: 0.7rem;">{{ msg.auteurRole }}</span>
                      </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <span *ngIf="msg.estSolution" class="badge badge-success" style="font-size: 0.8rem;">
                        🏆 SOLUTION ACCEPTÉE
                      </span>
                      <span style="font-size: 0.8rem; color: #64748b;">
                        {{ msg.dateCreation | date:'short' }}
                      </span>
                    </div>
                  </div>

                  <div style="font-size: 1rem; line-height: 1.7; color: #cbd5e1; white-space: pre-wrap; margin-bottom: 1rem;">
                    {{ msg.contenu }}
                  </div>

                  <!-- Mark as solution button -->
                  <div *ngIf="!msg.estSolution && (auth.currentUser()?.email === selectedSujet()?.auteurNom || auth.userRole() === 'ADMIN')" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 0.75rem;">
                    <button (click)="marquerSolution(msg.id)" class="btn btn-outline btn-sm" style="color: #34d399; border-color: rgba(16, 185, 129, 0.4);">
                      ✅ Marquer comme solution validée
                    </button>
                  </div>

                </div>
              </div>
            </div>

            <ng-template #noRepliesTpl>
              <div class="card" style="padding: 2.5rem; text-align: center; color: #64748b;">
                Aucune réponse pour le moment. Soyez le premier à apporter votre aide !
              </div>
            </ng-template>
          </div>

          <!-- Reply Form -->
          <div class="card">
            <div class="card-body">
              <h4 style="font-size: 1.25rem; margin-bottom: 1rem; color: #ffffff;">Ajouter votre réponse</h4>
              
              <div *ngIf="auth.isLoggedIn(); else loginToReplyTpl">
                <form (ngSubmit)="envoyerReponse()">
                  <div class="form-group">
                    <textarea 
                      name="reponseContenu" 
                      [(ngModel)]="reponseContenu" 
                      required 
                      class="form-textarea" 
                      placeholder="Partagez votre solution, des extraits de code ou vos conseils bienveillants..."
                    ></textarea>
                  </div>
                  <div style="text-align: right;">
                    <button type="submit" [disabled]="submittingReply()" class="btn btn-cyber">
                      <span *ngIf="submittingReply()" class="spinner"></span>
                      <span *ngIf="!submittingReply()">Envoyer ma réponse ➔</span>
                    </button>
                  </div>
                </form>
              </div>

              <ng-template #loginToReplyTpl>
                <div style="font-size: 0.95rem; color: #94a3b8;">
                  <a routerLink="/auth/login" style="font-weight: 700; color: var(--neon-cyan);">Connectez-vous</a> pour participer à cette discussion.
                </div>
              </ng-template>

            </div>
          </div>

        </div>

        <!-- Discussion Topics List -->
        <ng-template #listTpl>
          <div *ngIf="sujets().length > 0; else noTopicsTpl" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div *ngFor="let s of sujets()" (click)="ouvrirSujet(s.id)" class="card card-hover" style="cursor: pointer;">
              <div class="card-body" style="padding: 1.75rem;">
                
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem; flex-wrap: wrap; gap: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <span class="badge badge-primary">{{ s.domaineNom }}</span>
                    <span class="badge" [ngClass]="s.resolu ? 'badge-success' : 'badge-slate'">
                      {{ s.resolu ? 'RÉSOLU ✓' : 'EN COURS' }}
                    </span>
                  </div>
                  <div style="font-size: 0.8rem; color: #64748b;">
                    Dernière activité : {{ s.dateDerniereActivite | date:'short' }}
                  </div>
                </div>

                <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; color: #ffffff;">
                  {{ s.titre }}
                </h3>

                <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
                  {{ apercu(s.contenu) }}
                </p>

                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1rem; font-size: 0.85rem; color: #64748b;">
                  <div>
                    Par <strong style="color: #cbd5e1;">{{ s.auteurPrenom }} {{ s.auteurNom }}</strong> ({{ s.auteurRole }})
                  </div>
                  <div style="font-weight: 700; color: var(--neon-cyan); display: flex; align-items: center; gap: 0.4rem;">
                    💬 {{ s.nbReponses }} réponse(s)
                  </div>
                </div>

              </div>
            </div>
          </div>

          <ng-template #noTopicsTpl>
            <div class="card" style="padding: 4.5rem 2rem; text-align: center;">
              <div style="font-size: 3.5rem; margin-bottom: 1rem;">💬</div>
              <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; color: #ffffff;">Aucun sujet de discussion dans cette filière</h3>
              <p style="color: #94a3b8; margin-bottom: 1.5rem;">
                Soyez le premier à poser une question pour lancer la conversation !
              </p>
              <button (click)="openNewTopicModal()" class="btn btn-cyber">
                Poser une question
              </button>
            </div>
          </ng-template>
        </ng-template>

      </div>
    </div>

    <!-- New Topic Cyber Modal -->
    <div *ngIf="showNewTopicModal" class="modal-overlay">
      <div class="modal-content" style="padding: 2.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.5rem; margin: 0; color: #ffffff;">Poser une question sur le Forum</h3>
          <button (click)="showNewTopicModal = false" style="background: none; border: none; font-size: 1.75rem; color: #94a3b8; cursor: pointer;">×</button>
        </div>

        <form (ngSubmit)="creerNouveauSujet()">
          <div class="form-group">
            <label class="form-label">Titre de votre question</label>
            <input type="text" name="titre" [(ngModel)]="nouveauSujetTitre" required class="form-input" placeholder="Ex : Comment gérer l'authentification Stateless JWT avec Spring Security 6 ?">
          </div>

          <div class="form-group">
            <label class="form-label">Filière / Domaine</label>
            <select name="domaineId" [(ngModel)]="nouveauSujetDomaineId" class="form-select" required>
              <option *ngFor="let dom of domaines()" [ngValue]="dom.id">{{ dom.nom }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Détaillez votre question ou problème technique</label>
            <textarea name="contenu" [(ngModel)]="nouveauSujetContenu" required class="form-textarea" style="min-height: 150px;" placeholder="Donnez le contexte, vos tests déjà réalisés et des extraits de code si pertinent..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.85rem; margin-top: 2rem;">
            <button type="button" (click)="showNewTopicModal = false" class="btn btn-outline">Annuler</button>
            <button type="submit" [disabled]="submittingTopic()" class="btn btn-cyber">
              <span *ngIf="submittingTopic()" class="spinner"></span>
              <span *ngIf="!submittingTopic()">Publier la discussion ➔</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ForumComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);

  public sujets = signal<SujetResponse[]>([]);
  public domaines = signal<DomaineResponse[]>([]);
  public selectedDomaineId: number | null = null;
  public selectedSujet = signal<SujetDetailResponse | null>(null);

  // New topic modal
  public showNewTopicModal = false;
  public nouveauSujetTitre = '';
  public nouveauSujetDomaineId = 1;
  public nouveauSujetContenu = '';
  public submittingTopic = signal(false);

  // Reply form
  public reponseContenu = '';
  public submittingReply = signal(false);

  ngOnInit() {
    this.chargerSujets();
    this.api.getDomaines().subscribe({
      next: data => {
        this.domaines.set(data);
        if (data.length > 0) this.nouveauSujetDomaineId = data[0].id;
      }
    });
  }

  chargerSujets() {
    this.api.getSujets(this.selectedDomaineId || undefined).subscribe({
      next: data => this.sujets.set(data)
    });
  }

  selectDomaine(id: number | null) {
    this.selectedDomaineId = id;
    this.selectedSujet.set(null);
    this.chargerSujets();
  }

  ouvrirSujet(id: number) {
    this.api.getSujetById(id).subscribe({
      next: data => this.selectedSujet.set(data)
    });
  }

  openNewTopicModal() {
    if (!this.auth.isLoggedIn()) {
      this.toast.info('Veuillez vous connecter pour poser une question sur le forum.');
      return;
    }
    this.showNewTopicModal = true;
  }

  creerNouveauSujet() {
    if (!this.nouveauSujetTitre || !this.nouveauSujetContenu) {
      this.toast.error('Veuillez renseigner un titre et un contenu.');
      return;
    }

    this.submittingTopic.set(true);
    this.api.creerSujet({
      titre: this.nouveauSujetTitre,
      contenu: this.nouveauSujetContenu,
      domaineId: this.nouveauSujetDomaineId
    }).subscribe({
      next: (res) => {
        this.submittingTopic.set(false);
        this.showNewTopicModal = false;
        this.toast.success('Discussion publiée avec succès !');
        this.chargerSujets();
        this.ouvrirSujet(res.id);
      },
      error: (err) => {
        this.submittingTopic.set(false);
        const msg = err.error?.message || 'Erreur lors de la création du sujet.';
        this.toast.error(msg);
      }
    });
  }

  envoyerReponse() {
    const sId = this.selectedSujet()?.id;
    if (!sId || !this.reponseContenu.trim()) return;

    this.submittingReply.set(true);
    this.api.repondreSujet(sId, { contenu: this.reponseContenu }).subscribe({
      next: () => {
        this.submittingReply.set(false);
        this.reponseContenu = '';
        this.toast.success('Votre réponse a été postée !');
        this.ouvrirSujet(sId);
      },
      error: (err) => {
        this.submittingReply.set(false);
        const msg = err.error?.message || 'Erreur lors de l\'envoi de la réponse.';
        this.toast.error(msg);
      }
    });
  }

  apercu(texte?: string): string {
    if (!texte) return 'Ouvrir la discussion pour lire le message.';
    return texte.length > 160 ? texte.slice(0, 160) + '…' : texte;
  }

  marquerSolution(messageId: number) {
    const sujetId = this.selectedSujet()?.id;
    if (!sujetId) return;
    this.api.marquerSolution(sujetId, messageId).subscribe({
      next: () => {
        this.toast.success('Réponse validée comme solution acceptée ! 🏆');
        const sId = this.selectedSujet()?.id;
        if (sId) this.ouvrirSujet(sId);
      }
    });
  }
}
