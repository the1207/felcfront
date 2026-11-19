import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { FormationResponse, OffreResponse } from '../../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="position: relative; overflow: hidden;">
      
      <!-- Ambient Background Glows -->
      <div class="ambient-glow-top"></div>

      <!-- Hero Section -->
      <section style="padding-top: 5rem; padding-bottom: 5.5rem; position: relative; z-index: 2;">
        <div class="app-container">
          
          <div style="max-width: 900px; margin: 0 auto; text-align: center;">
            
            <!-- Futuristic Badge -->
            <div class="badge badge-slate" style="margin-bottom: 1.5rem;">
              Formation pratique, preuve vérifiable, emploi en FCFA
            </div>

            <h1 style="font-size: 3.25rem; font-weight: 800; line-height: 1.08; margin-bottom: 1.25rem; letter-spacing: -0.04em;">
              Un métier se prouve<br>par ce que vous avez construit.
            </h1>

            <p style="font-size: 1.15rem; color: #94a3b8; line-height: 1.65; margin-bottom: 2rem; max-width: 680px; margin-left: auto; margin-right: auto;">
              FELC accompagne un jeune francophone du premier exercice jusqu’à une candidature, puis jusqu’à la réponse de l’entreprise.
            </p>

            <div style="display: flex; align-items: center; justify-content: center; gap: 0.85rem; flex-wrap: wrap;">
              <a routerLink="/parcours" class="btn btn-cyber btn-lg">Suivre le parcours</a>
              <a routerLink="/auth/register" class="btn btn-outline btn-lg">Commencer gratuitement</a>
              <a routerLink="/mes-candidatures" class="btn btn-ghost btn-lg">Suivre une candidature</a>
            </div>

          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4" style="margin-top: 3rem; text-align: left;">
            <a routerLink="/parcours" class="card card-hover"><div class="card-body"><strong>1. Apprendre</strong><p style="color: var(--text-muted); margin-top: 0.4rem;">Une formation, un livrable.</p></div></a>
            <a routerLink="/mes-formations" class="card card-hover"><div class="card-body"><strong>2. Prouver</strong><p style="color: var(--text-muted); margin-top: 0.4rem;">Dépôt relu, puis certificat.</p></div></a>
            <a routerLink="/portfolio/me" class="card card-hover"><div class="card-body"><strong>3. Montrer</strong><p style="color: var(--text-muted); margin-top: 0.4rem;">Portfolio et CV sur ces preuves.</p></div></a>
            <a routerLink="/offres" class="card card-hover"><div class="card-body"><strong>4. Postuler</strong><p style="color: var(--text-muted); margin-top: 0.4rem;">Offres et missions en FCFA.</p></div></a>
          </div>

        </div>
      </section>

      <!-- Key Metrics Hologram Bar -->
      <section style="background: rgba(15, 23, 42, 0.6); border-top: 1px solid rgba(255, 255, 255, 0.08); border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding: 2.25rem 0; backdrop-filter: blur(16px);">
        <div class="app-container">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6" style="text-align: center;">
            <div>
              <div style="font-size: 1.35rem; font-weight: 800; font-family: var(--font-display);">1. Apprendre</div>
              <div style="font-size: 0.85rem; color: #94a3b8;">Exercices et projet, pas un quiz isolé</div>
            </div>
            <div>
              <div style="font-size: 1.35rem; font-weight: 800; font-family: var(--font-display);">2. Prouver</div>
              <div style="font-size: 0.85rem; color: #94a3b8;">Dépôt relu, note, certificat vérifiable</div>
            </div>
            <div>
              <div style="font-size: 1.35rem; font-weight: 800; font-family: var(--font-display);">3. Se montrer</div>
              <div style="font-size: 0.85rem; color: #94a3b8;">Portfolio et CV construits sur ces preuves</div>
            </div>
            <div>
              <div style="font-size: 1.35rem; font-weight: 800; font-family: var(--font-display);">4. Postuler</div>
              <div style="font-size: 0.85rem; color: #94a3b8;">Offres et missions affichées en FCFA</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3 Piliers Technologiques -->
      <section class="section-py">
        <div class="app-container">
          
          <div style="text-align: center; max-width: 700px; margin: 0 auto 4rem auto;">
            <span class="badge badge-cyber" style="margin-bottom: 0.85rem;">Architecture Révolutionnaire</span>
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem; color: #ffffff;">
              Comment FELC élimine la fracture de l'emploi
            </h2>
            <p style="color: #94a3b8; font-size: 1.05rem;">
              En combinant IA générative, évaluation de code source et certification vérifiable, nous créons un pont direct entre formation et entreprises.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <!-- Pilier 1 -->
            <div class="card card-hover" style="border-top: 3px solid var(--neon-cyan);">
              <div class="card-body">
                <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-xl); background: rgba(6, 182, 212, 0.15); color: var(--neon-cyan); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.5rem; box-shadow: 0 0 20px rgba(6, 182, 212, 0.25);">
                  💻
                </div>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: #ffffff;">100% Pratique & Code Source</h3>
                <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">
                  Pas de quiz passifs à choix multiples. Chaque apprenant développe et déploie de véritables applications, soumet des dépôts GitHub publics et apprend les standards de l'industrie.
                </p>
              </div>
            </div>

            <!-- Pilier 2 -->
            <div class="card card-hover" style="border-top: 3px solid var(--neon-indigo);">
              <div class="card-body">
                <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-xl); background: rgba(99, 102, 241, 0.15); color: var(--neon-indigo); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.5rem; box-shadow: 0 0 20px rgba(99, 102, 241, 0.25);">
                  🤖
                </div>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: #ffffff;">Moteurs IA Haute Précision</h3>
                <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">
                  L'IA corrige automatiquement les exercices de code en quelques secondes et génère un parcours d'orientation sur-mesure <strong>strictement filtré anti-hallucination</strong> sur le catalogue réel.
                </p>
              </div>
            </div>

            <!-- Pilier 3 -->
            <div class="card card-hover" style="border-top: 3px solid var(--neon-amber);">
              <div class="card-body">
                <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-xl); background: rgba(245, 158, 11, 0.15); color: var(--neon-amber); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.5rem; box-shadow: 0 0 20px rgba(245, 158, 11, 0.25);">
                  🛡️
                </div>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: #ffffff;">Certification & Emploi Direct</h3>
                <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">
                  Chaque certificat est unique et vérifiable sans compte par les recruteurs. Un portfolio public regroupe les projets validés et connecte les talents aux offres d'entreprises en FCFA.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- Formations Phares Grid -->
      <section class="section-py" style="background: rgba(11, 17, 32, 0.4); border-top: 1px solid rgba(255, 255, 255, 0.06);">
        <div class="app-container">
          
          <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-primary" style="margin-bottom: 0.5rem;">Catalogue d'Excellence</span>
              <h2 style="font-size: 2.25rem; color: #ffffff;">Formations Pratiques Certifiantes</h2>
            </div>
            <a routerLink="/formations" class="btn btn-outline">
              Voir tout le catalogue →
            </a>
          </div>

          <div *ngIf="apiIndisponible() && formations().length === 0" class="card" style="margin-bottom: 1.5rem;">
            <div class="card-body">
              <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem;">Le catalogue n’est pas joignable</h3>
              <p style="color: var(--text-muted);">Le serveur des formations ne répond pas. Le parcours, la fiche de sept jours et le générateur de CV restent utilisables.</p>
              <a routerLink="/parcours" style="display: inline-block; margin-top: 0.8rem;">Continuer sur le parcours</a>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let formation of formations()" class="card card-hover">
              <div class="card-body" style="display: flex; flex-direction: column; height: 100%;">
                
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                  <span class="badge badge-primary">{{ formation.domaineCode || 'TECH' }}</span>
                  <span class="badge" [ngClass]="getNiveauBadgeClass(formation.niveau)">
                    {{ formation.niveau }}
                  </span>
                </div>
                
                <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem; color: #ffffff;">
                  {{ formation.titre }}
                </h3>
                
                <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; flex: 1;">
                  {{ formation.description }}
                </p>

                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.25rem; margin-top: auto;">
                  <div style="font-size: 0.8rem; color: #64748b;">
                    👨‍🏫 {{ formation.formateurPrenom }} {{ formation.formateurNom }}
                  </div>
                  <a [routerLink]="['/formations', formation.id]" class="btn btn-primary btn-sm">
                    Rejoindre →
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Offres d'Emploi Récentes -->
      <section class="section-py">
        <div class="app-container">
          
          <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-warning" style="margin-bottom: 0.5rem;">Marché Professionnel</span>
              <h2 style="font-size: 2.25rem; color: #ffffff;">Dernières Offres d'Emploi & Missions</h2>
            </div>
            <a routerLink="/offres" class="btn btn-outline">
              Toutes les opportunités ({{ offres().length }}) →
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let offre of offres().slice(0, 3)" class="card card-hover">
              <div class="card-body">
                
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                  <span class="badge" [ngClass]="offre.type === 'MISSION' ? 'badge-purple' : 'badge-primary'">
                    {{ offre.type }}
                  </span>
                  <span *ngIf="offre.remote" class="badge badge-success">🌐 Remote</span>
                </div>

                <h3 style="font-size: 1.25rem; margin-bottom: 0.4rem; color: #ffffff;">
                  {{ offre.titre }}
                </h3>

                <div style="font-size: 0.875rem; font-weight: 600; color: var(--neon-cyan); margin-bottom: 1rem;">
                  🏢 {{ offre.entrepriseNom }} • 📍 {{ offre.localisation }}
                </div>

                <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem;">
                  {{ apercu(offre.description, 115) }}
                </p>

                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1rem;">
                  <div>
                    <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Budget / Salaire</div>
                    <div style="font-weight: 800; color: #ffffff; font-size: 1.15rem; font-family: var(--font-display);">
                      {{ offre.budget | number }} FCFA
                    </div>
                  </div>
                  <a [routerLink]="['/offres', offre.id]" class="btn btn-cyber btn-sm">
                    Postuler
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Career Acceleration & Real Tools Section -->
      <section style="background: rgba(6, 182, 212, 0.03); border-top: 1px solid rgba(255, 255, 255, 0.08); border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding: 4.5rem 0;">
        <div class="app-container">
          <div style="text-align: center; max-width: 760px; margin: 0 auto 3.5rem;">
            <span class="badge badge-cyber" style="margin-bottom: 0.75rem;">Outils Concrets d'Emploi</span>
            <h2 style="font-size: 2.35rem; color: #ffffff; margin-bottom: 1rem;">
              Tout ce qu'il vous faut pour décrocher votre premier contrat
            </h2>
            <p style="color: #cbd5e1; font-size: 1.05rem; line-height: 1.6;">
              Au-delà des formations, FELC vous arme avec les outils professionnels utilisés par les candidats qui réussissent leurs recrutements.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6" style="margin-bottom: 3rem;">
            
            <div class="card card-hover" style="border-top: 3px solid var(--neon-cyan);">
              <div class="card-body">
                <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">🎯</div>
                <h3 style="font-size: 1.3rem; color: #ffffff; margin-bottom: 0.5rem;">Simulateur d'Entretien IA</h3>
                <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.25rem;">
                  Entraînez-vous face à des questions techniques et RH réelles. L'IA note votre réponse, détecte les manques et vous livre la réponse type attendue.
                </p>
                <a routerLink="/interview-coach" class="btn btn-ghost btn-sm" style="color: var(--neon-cyan); padding-left: 0;">
                  Tester un entretien ➔
                </a>
              </div>
            </div>

            <div class="card card-hover" style="border-top: 3px solid var(--neon-indigo);">
              <div class="card-body">
                <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">📄</div>
                <h3 style="font-size: 1.3rem; color: #ffffff; margin-bottom: 0.5rem;">Générateur de CV Certifié</h3>
                <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.25rem;">
                  Générez un CV technique au format ATS intégrant automatiquement vos dépôts GitHub et vos certificats vérifiés FELC. Prêt à imprimer en PDF.
                </p>
                <a routerLink="/cv-builder" class="btn btn-ghost btn-sm" style="color: var(--neon-indigo); padding-left: 0;">
                  Créer mon CV Pro ➔
                </a>
              </div>
            </div>

            <div class="card card-hover" style="border-top: 3px solid var(--neon-emerald);">
              <div class="card-body">
                <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">⚡</div>
                <h3 style="font-size: 1.3rem; color: #ffffff; margin-bottom: 0.5rem;">Frugal & Hors-Ligne</h3>
                <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.25rem;">
                  Économisez votre forfait internet avec le mode 2G/3G, écoutez vos cours en synthèse vocale et téléchargez vos fiches pratiques pour coder hors-ligne.
                </p>
                <a routerLink="/formations" class="btn btn-ghost btn-sm" style="color: var(--neon-emerald); padding-left: 0;">
                  Voir les cours ➔
                </a>
              </div>
            </div>

          </div>

          <div style="text-align: center; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a routerLink="/interview-coach" class="btn btn-cyber">
              🎯 Démarrer une Simulation d'Entretien
            </a>
            <a routerLink="/cv-builder" class="btn btn-outline">
              📄 Générer mon CV Technique
            </a>
          </div>
        </div>
      </section>

      <!-- Futuristic Call To Action -->
      <section style="padding: 5rem 0; position: relative; border-top: 1px solid rgba(255, 255, 255, 0.08); background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%);">
        <div class="app-container" style="max-width: 750px; text-align: center;">
            <h2 style="font-size: 2.4rem; color: #ffffff; margin-bottom: 1rem;">
            Une candidature ne doit pas disparaître après l’envoi.
          </h2>
          <p style="font-size: 1.05rem; color: #94a3b8; margin-bottom: 2rem; line-height: 1.65;">
            Le suivi indique si le dossier est reçu, vu, retenu ou écarté.
          </p>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a routerLink="/mes-candidatures" class="btn btn-cyber btn-lg">Ouvrir le suivi</a>
            <a routerLink="/offres" class="btn btn-outline btn-lg">Voir les offres</a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  public auth = inject(AuthService);

  public formations = signal<FormationResponse[]>([]);
  public offres = signal<OffreResponse[]>([]);
  public apiIndisponible = signal(false);

  ngOnInit() {
    this.api.getFormations().subscribe({
      next: data => this.formations.set(data),
      error: () => this.apiIndisponible.set(true)
    });

    this.api.getOffres().subscribe({
      next: data => this.offres.set(data),
      error: () => this.apiIndisponible.set(true)
    });
  }

  apercu(texte: string | undefined, max: number): string {
    if (!texte) return '';
    return texte.length > max ? texte.slice(0, max) + '…' : texte;
  }

  getNiveauBadgeClass(niveau: string): string {
    switch (niveau) {
      case 'DEBUTANT': return 'badge-success';
      case 'INTERMEDIAIRE': return 'badge-primary';
      case 'AVANCE': return 'badge-warning';
      default: return 'badge-slate';
    }
  }
}
