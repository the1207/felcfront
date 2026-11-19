import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { CertificatResponse, InscriptionResponse } from '../../core/models/models';

interface ExperienceItem {
  titre: string;
  entreprise: string;
  periode: string;
  description: string;
}

@Component({
  selector: 'app-cv-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="position: relative; min-height: 85vh;">
      <div class="ambient-glow-top"></div>

      <div class="app-container">
        
        <!-- Header -->
        <div class="no-print" style="max-width: 820px; margin: 0 auto 2.5rem; text-align: center;">
          <div class="badge badge-cyber" style="margin-bottom: 0.85rem; font-size: 0.825rem; padding: 0.35rem 1rem;">
            <span>📄</span> Outil Professionnel d'Emploi
          </div>
          <h1 style="font-size: 2.75rem; margin-bottom: 0.85rem; line-height: 1.15;">
            Générateur de CV <span style="background: var(--grad-cyber); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Technique & Certifié</span>
          </h1>
          <p style="color: #94a3b8; font-size: 1.05rem; line-height: 1.6;">
            Générez un CV conforme aux standards internationaux intégrant automatiquement vos projets réels, dépôts GitHub et certificats infalsifiables FELC. Prêt à imprimer ou exporter en PDF.
          </p>

          <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.75rem;">
            <button (click)="imprimerCv()" class="btn btn-cyber btn-lg">
              Télécharger en PDF / Imprimer
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Left Column: Form Editor (hidden when printing) -->
          <div class="lg:col-span-5 no-print">
            <div class="card" style="border: 1px solid rgba(255, 255, 255, 0.1);">
              <div class="card-body" style="padding: 1.75rem;">
                
                <h3 style="font-size: 1.25rem; color: #ffffff; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
                  <span>⚙️</span> Informations du Profil
                </h3>

                <div class="form-group">
                  <label class="form-label">Titre professionnel visé</label>
                  <input type="text" [(ngModel)]="titrePoste" class="form-input" placeholder="Ex: Développeur Backend Java & Spring Boot">
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="form-group">
                    <label class="form-label">Ville & Pays</label>
                    <input type="text" [(ngModel)]="localisation" class="form-input" placeholder="Lomé, Togo">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Téléphone / WhatsApp</label>
                    <input type="text" [(ngModel)]="telephone" class="form-input" placeholder="+228 90 00 00 00">
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Lien GitHub personnel</label>
                  <input type="url" [(ngModel)]="lienGithub" class="form-input" placeholder="https://github.com/votre-nom">
                </div>

                <div class="form-group">
                  <label class="form-label">Lien LinkedIn (optionnel)</label>
                  <input type="url" [(ngModel)]="lienLinkedin" class="form-input" placeholder="https://linkedin.com/in/votre-nom">
                </div>

                <div class="form-group">
                  <label class="form-label">Résumé professionnel & Objectif</label>
                  <textarea [(ngModel)]="resumeBio" rows="4" class="form-textarea" placeholder="Développeur rigoureux formé par la pratique sur Spring Boot et PostgreSQL. Passionné par l'architecture logicielle propre et le code maintenable..."></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Compétences clés (séparées par des virgules)</label>
                  <input type="text" [(ngModel)]="competencesTexte" class="form-input" placeholder="Java 21, Spring Boot, PostgreSQL, Angular, Git, Docker, REST APIs">
                </div>

                <!-- Add Experience -->
                <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.25rem; margin-top: 1.5rem;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                    <strong style="color: #ffffff; font-size: 0.95rem;">Expériences ou Projets</strong>
                    <button type="button" (click)="ajouterExperience()" class="btn btn-ghost btn-sm" style="color: var(--neon-cyan);">
                      + Ajouter
                    </button>
                  </div>

                  <div *ngFor="let exp of experiences; let idx = index" style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                      <input type="text" [(ngModel)]="exp.titre" class="form-input" style="padding: 0.3rem 0.5rem; font-size: 0.85rem;" placeholder="Poste ou Projet">
                      <button (click)="supprimerExperience(idx)" style="background: none; border: none; color: var(--neon-rose); cursor: pointer; font-size: 1.1rem; margin-left: 0.5rem;">×</button>
                    </div>
                    <div class="grid grid-cols-2 gap-2" style="margin-bottom: 0.4rem;">
                      <input type="text" [(ngModel)]="exp.entreprise" class="form-input" style="padding: 0.3rem 0.5rem; font-size: 0.8rem;" placeholder="Entreprise / Freelance">
                      <input type="text" [(ngModel)]="exp.periode" class="form-input" style="padding: 0.3rem 0.5rem; font-size: 0.8rem;" placeholder="2025 - Présent">
                    </div>
                    <textarea [(ngModel)]="exp.description" rows="2" class="form-textarea" style="padding: 0.3rem 0.5rem; font-size: 0.8rem;" placeholder="Tâches clés, technologies utilisées et résultats obtenus..."></textarea>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Right Column: Live CV Paper Preview -->
          <div class="lg:col-span-7">
            
            <div id="cv-paper" class="cv-document">
              
              <!-- CV Header -->
              <div class="cv-header">
                <div>
                  <h1 class="cv-name">{{ auth.userFullName() || 'Votre Nom et Prénom' }}</h1>
                  <div class="cv-title">{{ titrePoste || 'Développeur Logiciel & Solutions Web' }}</div>
                </div>

                <div class="cv-contacts">
                  <div *ngIf="telephone">📞 {{ telephone }}</div>
                  <div>✉️ {{ auth.currentUser()?.email || 'email@exemple.com' }}</div>
                  <div *ngIf="localisation">📍 {{ localisation }}</div>
                  <div *ngIf="lienGithub">🐙 {{ lienGithub }}</div>
                </div>
              </div>

              <!-- Profile Summary -->
              <div class="cv-section">
                <h2 class="cv-section-title">Profil & Synthèse</h2>
                <p class="cv-bio">{{ resumeBio }}</p>
              </div>

              <!-- Skills -->
              <div class="cv-section">
                <h2 class="cv-section-title">Compétences Techniques</h2>
                <div class="cv-skills-chips">
                  <span *ngFor="let s of getCompetencesList()" class="cv-chip">{{ s }}</span>
                </div>
              </div>

              <!-- Verified FELC Projects & Certifications -->
              <div class="cv-section">
                <h2 class="cv-section-title">Projets Pratiques & Certifications FELC (Vérifiables)</h2>
                
                <div *ngIf="certificats().length > 0; else demoProjectsTpl">
                  <div *ngFor="let c of certificats()" class="cv-item">
                    <div class="cv-item-header">
                      <strong class="cv-item-title">{{ c.formationTitre }}</strong>
                      <span class="cv-badge-code">ID: {{ c.code }}</span>
                    </div>
                    <div class="cv-item-sub">Certifié FELC • Score officiel : {{ c.score }}/100 • Émis le {{ c.dateEmission | date:'mediumDate' }}</div>
                    <div style="font-size: 0.8rem; color: #475569; margin-top: 0.2rem;">
                      Vérification publique sécurisée sans compte : felc.com/certificats/verify/{{ c.code }}
                    </div>
                  </div>
                </div>

                <ng-template #demoProjectsTpl>
                  <div class="cv-item">
                    <div class="cv-item-header">
                      <strong class="cv-item-title">Plateforme E-Commerce & API REST Sécurisée</strong>
                      <span class="cv-badge-code">Projet Réel Vérifié</span>
                    </div>
                    <div class="cv-item-sub">Spring Boot 4, Java 21, PostgreSQL, Spring Security JWT, Docker</div>
                    <ul class="cv-bullets">
                      <li>Conception en architecture hexagonale avec GlobalExceptionHandler et validation Jakarta.</li>
                      <li>Tests d'intégration avec Testcontainers et documentation Swagger OpenAPI.</li>
                    </ul>
                  </div>

                  <div class="cv-item">
                    <div class="cv-item-header">
                      <strong class="cv-item-title">Application Web Responsive & Moteur de Données</strong>
                      <span class="cv-badge-code">Projet Frontend</span>
                    </div>
                    <div class="cv-item-sub">Angular 22, TypeScript, RxJS & Signals, Design System Cyber/Dark</div>
                    <ul class="cv-bullets">
                      <li>Gestion réactive de l'état avec Signals, Lazy Loading et intercepteurs HTTP JWT.</li>
                      <li>Mode basse connectivité pour réseaux 2G/3G réduisant la consommation de bande passante.</li>
                    </ul>
                  </div>
                </ng-template>

              </div>

              <!-- Work Experience -->
              <div *ngIf="experiences.length > 0" class="cv-section">
                <h2 class="cv-section-title">Expériences Professionnelles</h2>
                
                <div *ngFor="let exp of experiences" class="cv-item">
                  <div class="cv-item-header">
                    <strong class="cv-item-title">{{ exp.titre }}</strong>
                    <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">{{ exp.periode }}</span>
                  </div>
                  <div class="cv-item-sub">{{ exp.entreprise }}</div>
                  <p style="font-size: 0.85rem; color: #334155; margin-top: 0.3rem; line-height: 1.5;">
                    {{ exp.description }}
                  </p>
                </div>
              </div>

              <!-- Education -->
              <div class="cv-section" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0;">
                <h2 class="cv-section-title">Formation & Diplômes</h2>
                <div class="cv-item">
                  <div class="cv-item-header">
                    <strong class="cv-item-title">Parcours Certifiant FELC — Formation & Emploi en Communauté</strong>
                    <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">2026</span>
                  </div>
                  <div class="cv-item-sub">Validation 100% pratique sur code source réel & revue assistée par IA</div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    /* Clean, Professional ATS-Compliant Resume Paper Styling */
    .cv-document {
      background: #ffffff;
      color: #0f172a;
      border-radius: var(--radius-xl);
      padding: 3rem 2.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    .cv-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .cv-name {
      font-size: 1.95rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin-bottom: 0.35rem;
    }

    .cv-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .cv-contacts {
      text-align: right;
      font-size: 0.825rem;
      color: #475569;
      line-height: 1.5;
    }

    .cv-section {
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .cv-section-title {
      font-size: 0.95rem;
      font-weight: 800;
      color: #0369a1;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.75rem;
    }

    .cv-bio {
      font-size: 0.88rem;
      color: #334155;
      line-height: 1.6;
    }

    .cv-skills-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .cv-chip {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
      font-size: 0.78rem;
      padding: 0.25rem 0.65rem;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
    }

    .cv-item {
      margin-bottom: 1rem;
    }

    .cv-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.2rem;
    }

    .cv-item-title {
      font-size: 0.925rem;
      color: #0f172a;
    }

    .cv-badge-code {
      font-size: 0.75rem;
      font-family: monospace;
      font-weight: 700;
      background: #e0f2fe;
      color: #0369a1;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      border: 1px solid #bae6fd;
    }

    .cv-item-sub {
      font-size: 0.82rem;
      color: #64748b;
      font-weight: 600;
    }

    .cv-bullets {
      margin-top: 0.35rem;
      padding-left: 1.2rem;
      font-size: 0.825rem;
      color: #334155;
      line-height: 1.5;
    }

    /* Print Styles: Hide UI, print clean sheet */
    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
      }

      .no-print, header, footer, app-navbar, app-footer {
        display: none !important;
      }

      .cv-document {
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
      }
    }
  `]
})
export class CvBuilderComponent implements OnInit {
  public auth = inject(AuthService);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  public titrePoste = 'Développeur Backend Java & Architecture Cloud';
  public localisation = 'Lomé, Togo';
  public telephone = '+228 91 23 45 67';
  public lienGithub = 'https://github.com/the1207';
  public lienLinkedin = '';
  public resumeBio = 'Développeur passionné formé par la pratique réelle sur l\'écosystème Spring Boot, PostgreSQL et Angular. Capable de concevoir des API REST robustes, de respecter les principes SOLID et de collaborer avec Git en environnement agile.';
  public competencesTexte = 'Java 21, Spring Boot 4, PostgreSQL, Angular, TypeScript, Git, Docker, REST APIs, JUnit';

  public experiences: ExperienceItem[] = [
    {
      titre: 'Développeur Stagiaire / Freelance',
      entreprise: 'Projets d\'application réels FELC',
      periode: '2025 - 2026',
      description: 'Développement de micro-services Spring Boot pour la gestion des utilisateurs et catalogue de formations. Déploiement de bases PostgreSQL sur le Cloud.'
    }
  ];

  public certificats = signal<CertificatResponse[]>([]);

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      const user = this.auth.currentUser();
      if (user) {
        if (user.nom || user.prenom) {
          this.localisation = 'Lomé, Togo';
        }
      }
      this.chargerCertificats();
    }
  }

  chargerCertificats() {
    this.api.getMesCertificats().subscribe({
      next: (list) => {
        if (list && list.length > 0) {
          this.certificats.set(list);
        }
      }
    });
  }

  getCompetencesList(): string[] {
    return this.competencesTexte
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  ajouterExperience() {
    this.experiences.push({
      titre: 'Nouveau Poste / Projet',
      entreprise: 'Entreprise ou Client',
      periode: '2026',
      description: 'Description des réalisations clés et impact mesurable...'
    });
  }

  supprimerExperience(index: number) {
    this.experiences.splice(index, 1);
  }

  imprimerCv() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
