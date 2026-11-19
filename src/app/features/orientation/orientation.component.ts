import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { DomaineResponse, OrientationResponse } from '../../core/models/models';

@Component({
  selector: 'app-orientation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="min-height: 85vh; position: relative;">
      <div class="ambient-glow-top"></div>
      <div class="app-container" style="max-width: 950px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 3.5rem;">
          <div style="display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.4rem 1.25rem; border-radius: var(--radius-full); background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.35); color: #38bdf8; font-size: 0.85rem; font-weight: 700; font-family: var(--font-display); letter-spacing: 0.05em; margin-bottom: 1.25rem; box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);">
            <span class="pulsing-dot"></span>
            <span>MOTEUR D'ORIENTATION NEURAL & ANTI-HALLUCINATION</span>
          </div>
          <h1 style="font-size: 2.75rem; margin-bottom: 1rem; color: #ffffff;">
            Diagnostic d'Insertion & Parcours IA Sur-Mesure
          </h1>
          <p style="color: #94a3b8; font-size: 1.1rem; max-width: 700px; margin: 0 auto; line-height: 1.6;">
            Le diagnostic s’appuie sur le catalogue réel et les offres ouvertes.
          </p>
        </div>

        <!-- Sci-Fi Diagnostic Console (Form Card) -->
        <div *ngIf="!result() && !loading()" class="card" style="box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.8), var(--glow-cyan);">
          <div class="card-header" style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: #ffffff;">
              <span style="color: var(--neon-cyan);">[CONSOLE]</span> Paramétrage de votre profil d'apprentissage
            </div>
            <span class="badge badge-cyber">Mode Analyse Active</span>
          </div>

          <div class="card-body" style="padding: 2.5rem;">
            
            <form (ngSubmit)="lancerDiagnostic()">
              
              <!-- Domaine Selector -->
              <div class="form-group">
                <label class="form-label">1. Choisissez votre filière de prédilection</label>
                <select name="domaineId" [(ngModel)]="domaineId" class="form-select" required>
                  <option [ngValue]="null" disabled selected>-- Sélectionnez votre filière --</option>
                  <option *ngFor="let dom of domaines()" [ngValue]="dom.id">
                    {{ dom.nom }} ({{ dom.code }})
                  </option>
                </select>
                <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.4rem;">
                  FELC couvre le développement logiciel, l'IA, le marketing digital, l'agriculture connectée et bien plus.
                </div>
              </div>

              <!-- Current Level Selector with Cyber Buttons -->
              <div class="form-group">
                <label class="form-label">2. Votre niveau d'expérience actuel</label>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem;">
                  <button 
                    type="button" 
                    (click)="niveauActuel = 'DEBUTANT'"
                    [class.btn-cyber]="niveauActuel === 'DEBUTANT'"
                    [class.btn-outline]="niveauActuel !== 'DEBUTANT'"
                    class="btn"
                  >
                    🌱 Débutant
                  </button>
                  <button 
                    type="button" 
                    (click)="niveauActuel = 'INTERMEDIAIRE'"
                    [class.btn-cyber]="niveauActuel === 'INTERMEDIAIRE'"
                    [class.btn-outline]="niveauActuel !== 'INTERMEDIAIRE'"
                    class="btn"
                  >
                    🚀 Intermédiaire
                  </button>
                  <button 
                    type="button" 
                    (click)="niveauActuel = 'AVANCE'"
                    [class.btn-cyber]="niveauActuel === 'AVANCE'"
                    [class.btn-outline]="niveauActuel !== 'AVANCE'"
                    class="btn"
                  >
                    ⭐ Avancé
                  </button>
                </div>
              </div>

              <!-- Career Objectives -->
              <div class="form-group">
                <label class="form-label">3. Vos objectifs professionnels & métiers cibles</label>
                <textarea 
                  name="objectifs" 
                  [(ngModel)]="objectifs" 
                  class="form-textarea" 
                  required
                  placeholder="Ex : Je souhaite maîtriser Spring Boot, Angular et les microservices pour décrocher mon premier poste de développeur junior ou des contrats freelance à Lomé..."
                ></textarea>
              </div>

              <!-- Hours Slider -->
              <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <label class="form-label" style="margin: 0;">4. Temps disponible par semaine :</label>
                  <span style="font-family: var(--font-display); font-weight: 800; font-size: 1.15rem; color: var(--neon-cyan);">
                    {{ tempsDisponible }} Heures / Semaine
                  </span>
                </div>
                <input 
                  type="range" 
                  name="tempsDisponible" 
                  [(ngModel)]="tempsDisponible" 
                  min="5" 
                  max="40" 
                  step="5"
                  style="width: 100%; accent-color: var(--neon-cyan); cursor: pointer;"
                >
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; margin-top: 0.35rem;">
                  <span>5h (Études en parallèle)</span>
                  <span>20h (Temps partiel engagé)</span>
                  <span>40h (Bootcamp intensif)</span>
                </div>
              </div>

              <div style="margin-top: 2.5rem;">
                <button 
                  type="submit" 
                  class="btn btn-cyber btn-lg" 
                  style="width: 100%; font-size: 1.15rem; box-shadow: 0 0 35px rgba(6, 182, 212, 0.5);"
                >
                  ⚡ Lancer le Calcul Neural d'Orientation
                </button>
              </div>

            </form>

          </div>
        </div>

        <!-- Futuristic Scanner Animation State -->
        <div *ngIf="loading()" class="card" style="padding: 4.5rem 2rem; text-align: center; box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.9), var(--glow-cyan);">
          <div style="margin-bottom: 2rem;">
            <div class="spinner" style="width: 4rem; height: 4rem; border-width: 4px; border-top-color: var(--neon-cyan);"></div>
          </div>
          <h2 style="font-size: 1.85rem; margin-bottom: 0.75rem; color: #ffffff;">
            Analyse Neurale en Cours...
          </h2>
          <p style="color: #94a3b8; font-size: 1rem; max-width: 520px; margin: 0 auto 2.5rem auto;">
            Calcul des vecteurs de compétences, filtrage anti-hallucination sur les cours réels et alignement avec les offres d'emploi en FCFA.
          </p>

          <div style="max-width: 440px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; text-align: left; font-size: 0.95rem; font-family: var(--font-mono); color: #cbd5e1;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="color: var(--neon-emerald);">✔</span> Profil & objectifs modélisés
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="pulsing-dot"></span> Filtrage strict des formations FELC existantes
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="color: var(--neon-cyan);">⚡</span> Extraction des opportunités du marché togolais
            </div>
          </div>
        </div>

        <!-- Futuristic Result Console -->
        <div *ngIf="result()" style="display: flex; flex-direction: column; gap: 2.25rem;">
          
          <!-- Top Card: Diagnostic & Summary -->
          <div class="card" style="border-left: 5px solid var(--neon-cyan); box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.8), var(--glow-cyan);">
            <div class="card-body">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
                <span class="badge badge-cyber" style="font-size: 0.85rem; padding: 0.4rem 0.9rem;">
                  Niveau Estimé : {{ result()?.niveauEstime }}
                </span>
                <span style="font-size: 0.9rem; font-weight: 700; color: #34d399; font-family: var(--font-display);">
                  ⏱️ Durée prévisionnelle : ~{{ result()?.dureeEstimeeSemaines }} semaines
                </span>
              </div>

              <h2 style="font-size: 1.75rem; margin-bottom: 0.85rem; color: #ffffff;">
                Synthèse Neurale du Diagnostic
              </h2>
              <p style="color: #cbd5e1; font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.75rem;">
                {{ result()?.resumeDiagnostic }}
              </p>

              <!-- Competences Cibles -->
              <div>
                <div style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">
                  Compétences techniques cibles à verrouiller :
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                  <span *ngFor="let comp of result()?.competencesCibles" class="badge badge-primary" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">
                    {{ comp }}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <!-- Recommended Real Formations -->
          <div class="card">
            <div class="card-header">
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 1.2rem; color: #ffffff;">
                🎓 Parcours Pédagogique Recommandé (Catalogue Réel Vérifié)
              </div>
              <span class="badge badge-success">Anti-Hallucination Garantie</span>
            </div>
            <div class="card-body">
              <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div *ngFor="let form of result()?.formationsRecommandees; let idx = index" style="display: flex; align-items: center; justify-content: space-between; padding: 1.4rem; border-radius: var(--radius-xl); background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); flex-wrap: wrap; gap: 1rem;">
                  <div style="display: flex; align-items: center; gap: 1.25rem; flex: 1; min-width: 260px;">
                    <div style="width: 2.75rem; height: 2.75rem; border-radius: 50%; background: var(--grad-cyber); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; font-family: var(--font-display); box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);">
                      {{ idx + 1 }}
                    </div>
                    <div>
                      <h4 style="font-size: 1.2rem; margin-bottom: 0.25rem; color: #ffffff;">{{ form.titre }}</h4>
                      <p style="font-size: 0.875rem; color: #94a3b8;">{{ form.description }}</p>
                      <span class="badge badge-slate" style="margin-top: 0.4rem;">Niveau {{ form.niveau }}</span>
                    </div>
                  </div>
                  <div>
                    <a [routerLink]="['/formations', form.id]" class="btn btn-cyber btn-sm">
                      Démarrer cette formation →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Suggested Projects -->
          <div class="card" *ngIf="result()?.projetsSuggerees?.length">
            <div class="card-header">
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 1.2rem; color: #ffffff;">
                💡 Projets Porteurs & Développements Clés
              </div>
            </div>
            <div class="card-body">
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 1rem;">
                <li *ngFor="let proj of result()?.projetsSuggerees" style="display: flex; align-items: flex-start; gap: 0.85rem; font-size: 1rem; color: #cbd5e1;">
                  <span style="color: var(--neon-cyan); font-weight: 800; font-size: 1.2rem;">➔</span>
                  <span>{{ proj }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Market Job Opportunities in FCFA -->
          <div class="card" *ngIf="result()?.opportunitesMarche?.length">
            <div class="card-header" style="background: rgba(245, 158, 11, 0.08); border-bottom-color: rgba(245, 158, 11, 0.2);">
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 1.2rem; color: #fde68a;">
                💼 Débouchés Directs : Offres Ouvertes dans votre Filière
              </div>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div *ngFor="let off of result()?.opportunitesMarche" style="border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-lg); padding: 1.25rem; background: rgba(15, 23, 42, 0.8);">
                  <span class="badge badge-warning" style="margin-bottom: 0.5rem;">{{ off.type }}</span>
                  <h4 style="font-size: 1.15rem; margin-bottom: 0.35rem; color: #ffffff;">{{ off.titre }}</h4>
                  <div style="font-size: 0.85rem; color: var(--neon-cyan); margin-bottom: 0.85rem;">
                    🏢 {{ off.entrepriseNom }} • 📍 {{ off.localisation }}
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 0.85rem;">
                    <strong style="color: #facc15; font-size: 1.05rem; font-family: var(--font-display);">{{ off.budget | number }} FCFA</strong>
                    <a [routerLink]="['/offres', off.id]" class="btn btn-outline btn-sm">
                      Voir l'offre
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reset Button -->
          <div style="text-align: center; margin-top: 1.5rem;">
            <button (click)="result.set(null)" class="btn btn-outline">
              🔄 Réinitialiser & Nouveau Diagnostic
            </button>
          </div>

        </div>

      </div>
    </div>
  `
})
export class OrientationComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  public domaines = signal<DomaineResponse[]>([]);
  public domaineId: number | null = null;
  public niveauActuel = 'DEBUTANT';
  public objectifs = '';
  public tempsDisponible = 15;

  public loading = signal(false);
  public result = signal<OrientationResponse | null>(null);

  ngOnInit() {
    this.api.getDomaines().subscribe({
      next: data => {
        this.domaines.set(data);
        if (data.length > 0) {
          this.domaineId = data[0].id;
        }
      },
      error: () => {}
    });
  }

  lancerDiagnostic() {
    if (!this.auth.isLoggedIn()) {
      this.toast.info('Veuillez vous connecter pour enregistrer votre profil et lancer le diagnostic.');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/orientation' } });
      return;
    }

    const domaineId = this.domaineId;
    if (!domaineId || !this.objectifs) {
      this.toast.error('Veuillez sélectionner un domaine et préciser vos objectifs.');
      return;
    }

    this.loading.set(true);
    this.api.orienterProfil({
      domaineId,
      niveau: this.niveauActuel,
      objectif: this.objectifs,
      heuresParSemaine: Number(this.tempsDisponible)
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.result.set(res);
        this.toast.success('Diagnostic neural calculé avec succès !');
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || 'Erreur lors du calcul de votre orientation IA.';
        this.toast.error(msg);
      }
    });
  }
}
