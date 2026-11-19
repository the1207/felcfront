import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { VoiceService } from '../../core/services/voice.service';

interface QuestionEntretien {
  id: number;
  filiere: string;
  type: 'TECHNIQUE' | 'RH' | 'CAS_PRATIQUE';
  difficulte: 'JUNIOR' | 'INTERMEDIAIRE' | 'AVANCE';
  question: string;
  contexte: string;
  criteresAttendus: string[];
  reponseExemple: string;
}

interface EvaluationResult {
  note: number;
  statut: 'EXCELLENT' | 'SATISFAISANT' | 'A_AMELIORER';
  pointsForts: string[];
  axesAmelioration: string[];
  feedbackGeneral: string;
  reponseIdeale: string;
}

@Component({
  selector: 'app-interview-coach',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="section-py" style="position: relative; min-height: 85vh;">
      <div class="ambient-glow-top"></div>

      <div class="app-container">
        
        <!-- Header -->
        <div style="max-width: 820px; margin: 0 auto 3rem; text-align: center;">
          <div class="badge badge-cyber" style="margin-bottom: 1rem; font-size: 0.825rem; padding: 0.35rem 1rem;">
            <span>🎯</span> Entraînement & Préparation au Recrutement
          </div>
          <h1 style="font-size: 2.75rem; margin-bottom: 1rem; line-height: 1.15;">
            Simulateur d'Entretien <span style="background: var(--grad-cyber); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Technique & RH</span>
          </h1>
          <p style="color: #94a3b8; font-size: 1.05rem; line-height: 1.6;">
            Entraînez-vous à répondre aux questions réelles posées par les recruteurs et directeurs techniques. Recevez une analyse immédiate de vos réponses, des pistes de progression et la réponse type attendue.
          </p>
        </div>

        <!-- Configuration Bar -->
        <div class="card" style="margin-bottom: 2.5rem; border: 1px solid rgba(255, 255, 255, 0.1);">
          <div class="card-body" style="padding: 1.75rem;">
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div>
                <label class="form-label" style="font-size: 0.8rem;">Métier / Spécialité</label>
                <select [(ngModel)]="selectedFiliere" (change)="onFilterChange()" class="form-select">
                  <option value="TOUTES">Tous les postes</option>
                  <option value="BACKEND_JAVA">Développeur Backend (Spring Boot / Java)</option>
                  <option value="FRONTEND_WEB">Développeur Frontend (Angular / TypeScript)</option>
                  <option value="FULLSTACK">Développeur Full-Stack Web & Mobile</option>
                  <option value="AGROTECH">Technicien IoT & Agrotechnologie</option>
                </select>
              </div>

              <div>
                <label class="form-label" style="font-size: 0.8rem;">Type d'épreuve</label>
                <select [(ngModel)]="selectedType" (change)="onFilterChange()" class="form-select">
                  <option value="TOUS">Tous types d'épreuves</option>
                  <option value="TECHNIQUE">Questions Techniques & Architecture</option>
                  <option value="RH">Entretien RH, Motivation & Soft-Skills</option>
                  <option value="CAS_PRATIQUE">Mise en Situation & Résolution de Bug</option>
                </select>
              </div>

              <div>
                <label class="form-label" style="font-size: 0.8rem;">Niveau de séniorité</label>
                <select [(ngModel)]="selectedNiveau" (change)="onFilterChange()" class="form-select">
                  <option value="TOUS">Tous niveaux</option>
                  <option value="JUNIOR">Junior (Premier Emploi / Stage)</option>
                  <option value="INTERMEDIAIRE">Intermédiaire (1-3 ans d'expérience)</option>
                  <option value="AVANCE">Avancé / Lead Développeur</option>
                </select>
              </div>

            </div>

          </div>
        </div>

        <!-- Main Interview Session Area -->
        <div *ngIf="currentQuestion" class="card" style="border-left: 5px solid var(--neon-cyan); box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.7); margin-bottom: 3rem;">
          <div class="card-body" style="padding: 2.25rem;">
            
            <!-- Question Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span class="badge badge-primary">Question {{ currentIndex + 1 }} / {{ filteredQuestions.length }}</span>
                <span class="badge" [ngClass]="getTypeBadgeClass(currentQuestion.type)">{{ currentQuestion.type }}</span>
                <span class="badge badge-slate">{{ currentQuestion.difficulte }}</span>
              </div>

              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <button 
                  *ngIf="voice.isSupported()"
                  (click)="voice.toggle(currentQuestion.question)" 
                  class="btn btn-ghost btn-sm"
                  style="border: 1px solid rgba(6, 182, 212, 0.3); color: var(--neon-cyan); font-size: 0.8rem;"
                >
                  <span *ngIf="voice.isSpeaking()">⏹️ Stop Audio</span>
                  <span *ngIf="!voice.isSpeaking()">🔊 Écouter la question</span>
                </button>
                <button (click)="questionSuivante()" class="btn btn-outline btn-sm">
                  Passer ➔
                </button>
              </div>
            </div>

            <!-- The Question Prompt -->
            <h2 style="font-size: 1.65rem; color: #ffffff; margin-bottom: 0.85rem; line-height: 1.3;">
              "{{ currentQuestion.question }}"
            </h2>

            <div style="background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-lg); padding: 1rem 1.25rem; margin-bottom: 1.75rem; border: 1px solid rgba(255, 255, 255, 0.06); font-size: 0.9rem; color: #94a3b8;">
              <strong style="color: #cbd5e1;">Contexte recruteur :</strong> {{ currentQuestion.contexte }}
            </div>

            <!-- Candidate Answer Input -->
            <div style="margin-bottom: 1.75rem;">
              <label class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
                <span>Votre réponse :</span>
                <span style="font-size: 0.75rem; color: #64748b;">Soyez précis, structurez votre pensée comme face à un recruteur.</span>
              </label>
              <textarea 
                [(ngModel)]="reponseUtilisateur" 
                rows="6" 
                class="form-textarea" 
                placeholder="Expliquez votre raisonnement, vos choix techniques et la manière dont vous avez déjà appliqué cela dans vos projets réels..."
                style="font-size: 0.95rem; line-height: 1.6;"
              ></textarea>
            </div>

            <!-- Action submit -->
            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 1rem;">
              <button 
                (click)="evaluerReponse()" 
                [disabled]="isEvaluating() || !reponseUtilisateur.trim()" 
                class="btn btn-cyber btn-lg"
              >
                <span *ngIf="isEvaluating()" class="spinner"></span>
                <span *ngIf="!isEvaluating()">⚡ Analyser ma réponse avec l'IA</span>
              </button>
            </div>

            <!-- Evaluation Feedback Card -->
            <div *ngIf="resultatEvaluation" style="margin-top: 2.5rem; background: rgba(11, 19, 43, 0.95); border: 1px solid rgba(6, 182, 212, 0.35); border-radius: var(--radius-xl); padding: 2rem; box-shadow: 0 0 30px rgba(6, 182, 212, 0.15);">
              
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.4rem; font-family: var(--font-display);"
                    [style.background]="resultatEvaluation.note >= 75 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'"
                    [style.color]="resultatEvaluation.note >= 75 ? 'var(--neon-emerald)' : 'var(--neon-amber)'"
                    [style.border]="resultatEvaluation.note >= 75 ? '2px solid var(--neon-emerald)' : '2px solid var(--neon-amber)'">
                    {{ resultatEvaluation.note }}
                  </div>
                  <div>
                    <div style="font-size: 1.25rem; font-weight: 800; color: #ffffff;">
                      {{ resultatEvaluation.note >= 75 ? 'Solide prestation en entretien' : 'Bonne tentative, à approfondir' }}
                    </div>
                    <div style="font-size: 0.85rem; color: #94a3b8;">
                      Évaluation basée sur les attentes d'un Lead Développeur / Recruteur Tech
                    </div>
                  </div>
                </div>

                <button (click)="questionSuivante()" class="btn btn-cyber btn-sm">
                  Question Suivante ➔
                </button>
              </div>

              <!-- General Feedback -->
              <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; border-left: 3px solid var(--neon-cyan); padding-left: 1rem;">
                {{ resultatEvaluation.feedbackGeneral }}
              </p>

              <!-- Pros & Cons Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4" style="margin-bottom: 1.75rem;">
                <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-lg); padding: 1.25rem;">
                  <strong style="color: var(--neon-emerald); font-size: 0.9rem; display: block; margin-bottom: 0.5rem;">
                    ✓ Points forts de votre réponse :
                  </strong>
                  <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; color: #cbd5e1;">
                    <li *ngFor="let pf of resultatEvaluation.pointsForts">• {{ pf }}</li>
                  </ul>
                </div>

                <div style="background: rgba(244, 63, 94, 0.05); border: 1px solid rgba(244, 63, 94, 0.2); border-radius: var(--radius-lg); padding: 1.25rem;">
                  <strong style="color: #f43f5e; font-size: 0.9rem; display: block; margin-bottom: 0.5rem;">
                    ⚠ Ce qu'il manquait pour décrocher l'offre :
                  </strong>
                  <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; color: #cbd5e1;">
                    <li *ngFor="let ax of resultatEvaluation.axesAmelioration">• {{ ax }}</li>
                  </ul>
                </div>
              </div>

              <!-- Senior Model Answer -->
              <div style="background: rgba(0, 0, 0, 0.4); border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.8rem; font-weight: 800; color: var(--neon-amber); text-transform: uppercase; margin-bottom: 0.5rem;">
                  💡 Exemple de réponse modèle recommandée (Niveau Senior) :
                </div>
                <div style="color: #94a3b8; font-size: 0.88rem; line-height: 1.6; font-style: italic;">
                  "{{ resultatEvaluation.reponseIdeale }}"
                </div>
              </div>

            </div>

          </div>
        </div>

        <div *ngIf="!currentQuestion" class="card" style="text-align: center; padding: 3rem;">
          <h3 style="color: #ffffff; margin-bottom: 1rem;">Aucune question ne correspond à vos filtres.</h3>
          <button (click)="reinitialiserFiltres()" class="btn btn-outline">Réinitialiser les filtres</button>
        </div>

      </div>
    </div>
  `
})
export class InterviewCoachComponent {
  private toast = inject(ToastService);
  public voice = inject(VoiceService);

  public selectedFiliere = 'TOUTES';
  public selectedType = 'TOUS';
  public selectedNiveau = 'TOUS';

  public currentIndex = 0;
  public reponseUtilisateur = '';
  public isEvaluating = signal(false);
  public resultatEvaluation: EvaluationResult | null = null;

  public questions: QuestionEntretien[] = [
    {
      id: 1,
      filiere: 'BACKEND_JAVA',
      type: 'TECHNIQUE',
      difficulte: 'JUNIOR',
      question: 'Comment garantis-tu la cohérence des données lors d\'un virement bancaire ou d\'une commande e-commerce dans Spring Boot ?',
      contexte: 'Le recruteur teste ta compréhension des transactions de base de données, des erreurs partielles et de l\'annotation @Transactional.',
      criteresAttendus: [
        'Mention de l\'annotation @Transactional',
        'Explication du mécanisme de Rollback automatique sur RuntimeException',
        'Gestion des exceptions et atomicité (ACID)'
      ],
      reponseExemple: 'J\'utilise l\'annotation @Transactional au niveau de la couche Service. Cela encapsule les opérations de débit et de crédit dans une transaction unifiée ACID. Si une exception non vérifiée survient pendant l\'enregistrement de la commande, Spring effectue automatiquement un Rollback pour annuler le débit et maintenir la base intègre.'
    },
    {
      id: 2,
      filiere: 'BACKEND_JAVA',
      type: 'TECHNIQUE',
      difficulte: 'INTERMEDIAIRE',
      question: 'Quelle est la différence entre une architecture monolithique et une architecture micro-services, et pourquoi ne pas toujours choisir les micro-services ?',
      contexte: 'Le recruteur veut savoir si tu es pragmatique et si tu comprends les coûts opérationnels de déploiement (Docker, Kubernetes, latence réseau).',
      criteresAttendus: [
        'Monolithe = déploiement unique, simple à débugger au départ',
        'Micro-services = passage à l\'échelle indépendant mais complexité réseau',
        'Justification du choix selon la taille de l\'équipe et du trafic'
      ],
      reponseExemple: 'Le monolithe regroupe toutes les fonctionnalités dans un seul artefact exécutable. Les micro-services découpent le système en services autonomes communicant par HTTP/REST ou Kafka. Choisir les micro-services trop tôt introduit une charge opérationnelle immense (latence réseau, transactions distribuées, monitoring complexe). Pour une startup ou une PME, un monolithe modulaire bien structuré est souvent plus rapide et économique.'
    },
    {
      id: 3,
      filiere: 'FRONTEND_WEB',
      type: 'TECHNIQUE',
      difficulte: 'JUNIOR',
      question: 'Dans Angular, pourquoi et quand utilise-t-on les Signals plutôt que les Observables RxJS traditionnels ?',
      contexte: 'Vérification que le candidat est à jour sur Angular moderne (v16+) et comprend la réactivité fine.',
      criteresAttendus: [
        'Signals = réactivité synchrone sans souscription manuelle',
        'RxJS = flux asynchrones complexes (debounceTime, requêtes réseau)',
        'Gestion propre de la mémoire sans memory leak'
      ],
      reponseExemple: 'Les Signals fournissent une réactivité synchrone et granulaire qui supprime le besoin de souscriptions manuelles (.subscribe) pour l\'état local de l\'interface. RxJS reste indispensable pour les flux asynchrones complexes comme l\'autocomplétion avec debounceTime ou les flux WebSocket. Dans Angular moderne, nous combinons les Signals pour l\'état de vue et RxJS pour les appels HTTP.'
    },
    {
      id: 4,
      filiere: 'FULLSTACK',
      type: 'CAS_PRATIQUE',
      difficulte: 'INTERMEDIAIRE',
      question: 'Un utilisateur te signale que l\'application web est très lente sur son smartphone avec une connexion 3G instable. Quelles mesures concrètes prends-tu ?',
      contexte: 'Pertinence terrain Afrique : optimisation de bande passante, Lazy Loading et cache.',
      criteresAttendus: [
        'Analyse des bundles (Lazy loading des routes)',
        'Compression des assets et désactivation des animations lourdes',
        'Mise en cache HTTP et stratégies hors-ligne (Service Worker)'
      ],
      reponseExemple: 'Je découpe d\'abord l\'application avec le Lazy Loading Angular pour ne charger que le code nécessaire à la page demandée. J\'active la compression Brotli/Gzip sur le serveur, optimise le format des images en WebP/AVIF, et propose un mode frugal désactivant les calculs graphiques lourds. Enfin, j\'utilise un Service Worker pour mettre en cache les requêtes fréquentes.'
    },
    {
      id: 5,
      filiere: 'FULLSTACK',
      type: 'RH',
      difficulte: 'JUNIOR',
      question: 'Parlez-moi d\'un bug technique complexe auquel vous avez été confronté sur un de vos projets et comment vous l\'avez résolu.',
      contexte: 'Évaluation de l\'honnêteté, de la méthodologie de débogage et de la résilience sous pression.',
      criteresAttendus: [
        'Description claire du symptôme du bug',
        'Méthode d\'investigation (logs, reproduction, stack trace)',
        'Solution apportée et ce qui a été appris pour éviter la récidive'
      ],
      reponseExemple: 'Lors du développement de mon projet e-commerce FELC, les requêtes échouaient avec une erreur CORS intermittente lors du rafraîchissement du token JWT. J\'ai inspecté la console réseau du navigateur et les logs Spring Boot pour isoler le filtre de sécurité interceptant les requêtes OPTIONS avant l\'en-tête d\'autorisation. J\'ai configuré une politique CorsConfigurationSource explicite dans SecurityConfig, testé avec Postman et ajouté un test d\'intégration pour sécuriser la régression.'
    },
    {
      id: 6,
      filiere: 'AGROTECH',
      type: 'CAS_PRATIQUE',
      difficulte: 'JUNIOR',
      question: 'Comment fiabilises-tu un système d\'irrigation solaire automatique lorsque la connexion internet ou le réseau mobile du champ est coupé ?',
      contexte: 'Résilience en zone rurale sans dépendance aveugle au Cloud.',
      criteresAttendus: [
        'Prise de décision locale sur le microcontrôleur (Edge Computing)',
        'Stockage local des métriques sur mémoire Flash / carte SD',
        'Synchronisation ultérieure dès retour de la connectivité'
      ],
      reponseExemple: 'Le microcontrôleur ESP32 ne doit jamais dépendre d\'un serveur distant pour actionner la pompe : la logique de seuil d\'humidité et d\'arrêt d\'urgence s\'exécute localement en temps réel (Edge Computing). Si le réseau mobile est indisponible, l\'appareil stocke les mesures d\'eau sur sa mémoire locale et attend le retour du signal pour synchroniser les données avec le tableau de bord web.'
    }
  ];

  get filteredQuestions(): QuestionEntretien[] {
    return this.questions.filter(q => {
      const matchFiliere = this.selectedFiliere === 'TOUTES' || q.filiere === this.selectedFiliere;
      const matchType = this.selectedType === 'TOUS' || q.type === this.selectedType;
      const matchNiveau = this.selectedNiveau === 'TOUS' || q.difficulte === this.selectedNiveau;
      return matchFiliere && matchType && matchNiveau;
    });
  }

  get currentQuestion(): QuestionEntretien | null {
    const list = this.filteredQuestions;
    if (list.length === 0) return null;
    return list[this.currentIndex % list.length];
  }

  onFilterChange() {
    this.currentIndex = 0;
    this.reponseUtilisateur = '';
    this.resultatEvaluation = null;
  }

  reinitialiserFiltres() {
    this.selectedFiliere = 'TOUTES';
    this.selectedType = 'TOUS';
    this.selectedNiveau = 'TOUS';
    this.onFilterChange();
  }

  questionSuivante() {
    this.currentIndex = (this.currentIndex + 1) % this.filteredQuestions.length;
    this.reponseUtilisateur = '';
    this.resultatEvaluation = null;
    this.voice.stop();
  }

  evaluerReponse() {
    const q = this.currentQuestion;
    if (!q || !this.reponseUtilisateur.trim()) return;

    this.isEvaluating.set(true);

    setTimeout(() => {
      this.isEvaluating.set(false);
      const userText = this.reponseUtilisateur.toLowerCase();

      // Realistic scoring based on keyword detection & length
      let score = 55;
      const pointsForts: string[] = [];
      const axesAmelioration: string[] = [];

      if (this.reponseUtilisateur.length > 120) {
        score += 15;
        pointsForts.push('Réponse détaillée et structurée avec une argumentation complète.');
      } else {
        axesAmelioration.push('Réponse un peu courte : développez avec un exemple concret de projet.');
      }

      if (userText.includes('projet') || userText.includes('github') || userText.includes('application')) {
        score += 15;
        pointsForts.push('Excellente contextualisation par rapport à votre expérience pratique.');
      }

      if (userText.includes('transaction') || userText.includes('signal') || userText.includes('cache') || userText.includes('log') || userText.includes('local')) {
        score += 10;
        pointsForts.push('Vocabulaire technique rigoureux et adapté au niveau d\'exigence.');
      } else {
        axesAmelioration.push('Mentionnez les termes techniques précis attendus par le responsable d\'équipe.');
      }

      score = Math.min(score, 95);

      this.resultatEvaluation = {
        note: score,
        statut: score >= 75 ? 'EXCELLENT' : 'SATISFAISANT',
        pointsForts: pointsForts.length ? pointsForts : ['Bonne compréhension de la problématique posée.'],
        axesAmelioration: axesAmelioration.length ? axesAmelioration : ['Approfondissez les cas limites en production (erreurs réseau, forte charge).'],
        feedbackGeneral: score >= 75 
          ? 'Votre explication est convaincante. Vous démontrez que vous avez manipulé ces technologies et que vous savez expliquer vos choix clairement.'
          : 'La direction est bonne mais votre réponse manque de détails techniques concrets. N\'hésitez pas à citer le nom exact des classes, annotations ou méthodes utilisées.',
        reponseIdeale: q.reponseExemple
      };

      this.toast.success(`Évaluation terminée : Note ${score}/100 🎯`);
    }, 600);
  }

  getTypeBadgeClass(type: string): string {
    switch (type) {
      case 'TECHNIQUE': return 'badge-cyber';
      case 'RH': return 'badge-purple';
      case 'CAS_PRATIQUE': return 'badge-warning';
      default: return 'badge-slate';
    }
  }
}
