import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface RegionImpact {
  nom: string;
  chefLieu: string;
  apprenants: number;
  specialite: string;
  projetsFinaux: number;
  fcfaInjectes: string;
  description: string;
}

@Component({
  selector: 'app-impact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="section-py" style="position: relative; min-height: 90vh;">
      <div class="ambient-glow-top"></div>
      <div class="ambient-glow-bottom"></div>

      <div class="app-container">
        
        <!-- Header Hero -->
        <div style="text-align: center; max-width: 860px; margin: 0 auto 4rem;">
          <div class="badge badge-cyber" style="margin-bottom: 1.25rem; font-size: 0.85rem; padding: 0.4rem 1.25rem;">
            <span>🌍</span> Objectifs de Développement Durable (ONU 2030)
          </div>
          <h1 style="font-size: 3rem; margin-bottom: 1.25rem; line-height: 1.15;">
            L'Intelligence Artificielle & la Pratique pour l'<span style="background: var(--grad-aurora); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Émancipation Africaine</span>
          </h1>
          <p style="font-size: 1.15rem; color: #cbd5e1; line-height: 1.7;">
            FELC n'est pas une simple plateforme de cours en ligne : c'est un tremplin social conçu pour briser les inégalités d'accès à l'emploi au Togo et en Afrique de l'Ouest francophone, par la preuve technique vérifiable et la méritocratie.
          </p>
        </div>

        <!-- Live Impact KPI Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6" style="margin-bottom: 4rem;">
          <div class="card card-glow-emerald">
            <div class="card-body" style="text-align: center; padding: 1.75rem 1.25rem;">
              <div style="font-size: 2.4rem; font-weight: 800; color: var(--neon-emerald); font-family: var(--font-display);">
                3 270+
              </div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #ffffff; margin-top: 0.25rem;">
                Jeunes Francophones Formés
              </div>
              <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.35rem;">
                100% pratique sur code & projets réels
              </div>
            </div>
          </div>

          <div class="card card-glow-cyan">
            <div class="card-body" style="text-align: center; padding: 1.75rem 1.25rem;">
              <div style="font-size: 2.4rem; font-weight: 800; color: var(--neon-cyan); font-family: var(--font-display);">
                84.6%
              </div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #ffffff; margin-top: 0.25rem;">
                Taux d'Insertion à 90 jours
              </div>
              <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.35rem;">
                Stages, CDD ou missions freelance
              </div>
            </div>
          </div>

          <div class="card card-glow-amber">
            <div class="card-body" style="text-align: center; padding: 1.75rem 1.25rem;">
              <div style="font-size: 2.2rem; font-weight: 800; color: var(--neon-amber); font-family: var(--font-display);">
                48.5M
              </div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #ffffff; margin-top: 0.25rem;">
                FCFA Rémunérés aux Jeunes
              </div>
              <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.35rem;">
                Directement versés sans commission
              </div>
            </div>
          </div>

          <div class="card" style="border-top: 3px solid var(--neon-purple);">
            <div class="card-body" style="text-align: center; padding: 1.75rem 1.25rem;">
              <div style="font-size: 2.4rem; font-weight: 800; color: var(--neon-purple); font-family: var(--font-display);">
                42%
              </div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #ffffff; margin-top: 0.25rem;">
                Hors de Lomé (Zones Rurales)
              </div>
              <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.35rem;">
                Grâce au mode Frugal basse connectivité
              </div>
            </div>
          </div>
        </div>

        <!-- The 5 UN Sustainable Development Goals (ODD) -->
        <div style="margin-bottom: 5rem;">
          <div style="text-align: center; margin-bottom: 3rem;">
            <h2 style="font-size: 2.2rem; margin-bottom: 0.75rem;">
              Alignement Stratégique avec les Objectifs de l'ONU
            </h2>
            <p style="color: #94a3b8; font-size: 1.05rem;">
              Une réponse technologique et sociétale directe aux 5 défis critiques du continent africain.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <!-- ODD 4 -->
            <div class="card" style="border-left: 5px solid #c5192d;">
              <div class="card-body">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                  <span class="badge" style="background: rgba(197, 25, 45, 0.2); color: #f87171; border: 1px solid rgba(197, 25, 45, 0.4); font-weight: 800;">
                    ODD 4 — Éducation de Qualité
                  </span>
                  <span style="font-size: 1.5rem;">📚</span>
                </div>
                <h3 style="font-size: 1.25rem; color: #ffffff; margin-bottom: 0.75rem;">
                  Apprentissage Frugal & Sans Quiz
                </h3>
                <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.6;">
                  Fin des QCM théoriques sans lendemain : 100% des évaluations reposent sur du travail inspecté (dépôts GitHub, calculs dimensionnés). L'assistant vocal intégré garantit l'accès aux jeunes moins à l'aise avec la lecture longue sur écran.
                </p>
              </div>
            </div>

            <!-- ODD 8 -->
            <div class="card" style="border-left: 5px solid #a21942;">
              <div class="card-body">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                  <span class="badge" style="background: rgba(162, 25, 66, 0.2); color: #fb7185; border: 1px solid rgba(162, 25, 66, 0.4); font-weight: 800;">
                    ODD 8 — Travail Décent & FCFA
                  </span>
                  <span style="font-size: 1.5rem;">💼</span>
                </div>
                <h3 style="font-size: 1.25rem; color: #ffffff; margin-bottom: 0.75rem;">
                  Passerelle Directe vers le Marché
                </h3>
                <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.6;">
                  Publication d'offres en Francs CFA transparentes. Un jeune certifié peut candidater en un clic avec son portfolio vérifiable, réduisant le temps d'embauche de 6 mois à moins de 2 semaines pour les entreprises locales.
                </p>
              </div>
            </div>

            <!-- ODD 5 -->
            <div class="card" style="border-left: 5px solid #ff3a21;">
              <div class="card-body">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                  <span class="badge" style="background: rgba(255, 58, 33, 0.2); color: #fca5a5; border: 1px solid rgba(255, 58, 33, 0.4); font-weight: 800;">
                    ODD 5 — Égalité des Genres
                  </span>
                  <span style="font-size: 1.5rem;">👩‍💻</span>
                </div>
                <h3 style="font-size: 1.25rem; color: #ffffff; margin-bottom: 0.75rem;">
                  Initiative « Femmes & Tech Togo »
                </h3>
                <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.6;">
                  Actuellement 38.5% d'apprenantes féminines, avec l'objectif de 50% d'ici fin 2026. Programme de bourses internet dédiées et mentorat par des ingénieures togolaises pour lutter contre les stéréotypes de genre.
                </p>
              </div>
            </div>

            <!-- ODD 1 -->
            <div class="card" style="border-left: 5px solid #e5243b;">
              <div class="card-body">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                  <span class="badge" style="background: rgba(229, 36, 59, 0.2); color: #fca5a5; border: 1px solid rgba(229, 36, 59, 0.4); font-weight: 800;">
                    ODD 1 — Pas de Pauvreté
                  </span>
                  <span style="font-size: 1.5rem;">🌱</span>
                </div>
                <h3 style="font-size: 1.25rem; color: #ffffff; margin-bottom: 0.75rem;">
                  La Preuve contre le Piston
                </h3>
                <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.6;">
                  En Afrique, le réseau familial détermine trop souvent l'accès au premier emploi. Le portfolio public FELC permet à un jeune de quartier défavorisé de prouver immédiatement son savoir-faire technique vérifié en production.
                </p>
              </div>
            </div>

            <!-- ODD 13 -->
            <div class="card" style="border-left: 5px solid #3f7e44;">
              <div class="card-body">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                  <span class="badge" style="background: rgba(63, 126, 68, 0.2); color: #86efac; border: 1px solid rgba(63, 126, 68, 0.4); font-weight: 800;">
                    ODD 13 — Sobriété & Climat
                  </span>
                  <span style="font-size: 1.5rem;">⚡</span>
                </div>
                <h3 style="font-size: 1.25rem; color: #ffffff; margin-bottom: 0.75rem;">
                  Mode Frugal & Filières Vertes
                </h3>
                <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.6;">
                  Empreinte numérique minimale grâce au Mode Économie Data (consommation réduite de 80% sur réseaux 2G/3G). Filières axées sur l'agrotechnologie durable et le dimensionnement de micro-réseaux solaires ruraux.
                </p>
              </div>
            </div>

            <!-- ODD 10 -->
            <div class="card" style="border-left: 5px solid #dd1367;">
              <div class="card-body">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                  <span class="badge" style="background: rgba(221, 19, 103, 0.2); color: #f472b6; border: 1px solid rgba(221, 19, 103, 0.4); font-weight: 800;">
                    ODD 10 — Réduction des Inégalités
                  </span>
                  <span style="font-size: 1.5rem;">🤝</span>
                </div>
                <h3 style="font-size: 1.25rem; color: #ffffff; margin-bottom: 0.75rem;">
                  Bourses & Diaspora Solidaire
                </h3>
                <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.6;">
                  Canal direct permettant à la diaspora togolaise et internationale de financer des recharges de data 4G et des ordinateurs reconditionnés pour des étudiants méritants des 5 régions économiques du Togo.
                </p>
              </div>
            </div>

          </div>
        </div>

        <!-- Regional Impact Interactive Breakdown (Togo) -->
        <div class="card" style="margin-bottom: 4rem; border: 1px solid rgba(6, 182, 212, 0.2); box-shadow: 0 0 35px rgba(6, 182, 212, 0.15);">
          <div class="card-body" style="padding: 2.5rem;">
            
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
              <div>
                <span class="badge badge-cyber" style="margin-bottom: 0.5rem;">Ancrage Territorial</span>
                <h2 style="font-size: 1.85rem; color: #ffffff;">
                  Déploiement à travers les 5 Régions du Togo
                </h2>
              </div>
              <div style="font-size: 0.9rem; color: #94a3b8;">
                Cliquez sur une région pour voir les statistiques d'insertion locale :
              </div>
            </div>

            <!-- Region Tabs / Pills -->
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2rem;">
              <button 
                *ngFor="let reg of regions; let idx = index"
                (click)="selectedRegionIndex.set(idx)"
                class="btn btn-sm"
                [ngClass]="selectedRegionIndex() === idx ? 'btn-cyber' : 'btn-outline'"
                style="font-size: 0.88rem;"
              >
                📍 {{ reg.nom }}
              </button>
            </div>

            <!-- Active Region Details Card -->
            <div *ngIf="selectedRegion" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-xl); padding: 2rem;">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div style="border-right: 1px solid rgba(255, 255, 255, 0.08); padding-right: 1.5rem;">
                  <span class="badge badge-primary" style="margin-bottom: 0.75rem;">Région Économique</span>
                  <h3 style="font-size: 1.6rem; color: #ffffff; margin-bottom: 0.4rem;">
                    {{ selectedRegion.nom }}
                  </h3>
                  <div style="color: var(--neon-cyan); font-weight: 700; font-size: 0.95rem; margin-bottom: 1rem;">
                    Chef-lieu : {{ selectedRegion.chefLieu }}
                  </div>
                  <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
                    {{ selectedRegion.description }}
                  </p>
                </div>

                <div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.4rem;">Filière Prioritaire Locale</div>
                  <div style="font-weight: 700; color: #ffffff; font-size: 1.1rem; margin-bottom: 1.5rem;">
                    🌾 {{ selectedRegion.specialite }}
                  </div>

                  <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.4rem;">Projets Finaux Certifiés</div>
                  <div style="font-weight: 800; color: var(--neon-cyan); font-size: 1.5rem; font-family: var(--font-display);">
                    {{ selectedRegion.projetsFinaux }} projets déployés
                  </div>
                </div>

                <div style="background: rgba(6, 182, 212, 0.06); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; flex-direction: column; justify-content: center;">
                  <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.3rem;">Apprenants actifs :</div>
                  <div style="font-size: 2rem; font-weight: 800; color: #ffffff; font-family: var(--font-display); line-height: 1;">
                    {{ selectedRegion.apprenants }} jeunes
                  </div>

                  <div style="margin-top: 1.25rem; font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.3rem;">Revenus générés sur place :</div>
                  <div style="font-size: 1.4rem; font-weight: 800; color: var(--neon-emerald); font-family: var(--font-display);">
                    {{ selectedRegion.fcfaInjectes }} FCFA
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <!-- CTA Callout -->
        <div class="card card-glow-indigo" style="text-align: center; padding: 3rem 1.5rem;">
          <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #ffffff;">
            Vous êtes une ONG, une Entreprise ou un Partenaire du Développement ?
          </h2>
          <p style="color: #cbd5e1; max-width: 680px; margin: 0 auto 2rem; font-size: 1.05rem;">
            Participez à notre programme de bourses de connectivité, proposez des missions rémunérées ou devenez mentor bénévole pour accélérer l'émancipation d'une génération.
          </p>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a routerLink="/bourses" class="btn btn-cyber btn-lg">
              🤝 Découvrir les Bourses Tremplin
            </a>
            <a routerLink="/offres" [queryParams]="{ type: 'MISSION' }" class="btn btn-outline btn-lg">
              💼 Publier une Mission Rémunérée
            </a>
          </div>
        </div>

      </div>
    </div>
  `
})
export class ImpactComponent {
  public selectedRegionIndex = signal(0);

  public regions: RegionImpact[] = [
    {
      nom: 'Région Maritime & Grand Lomé',
      chefLieu: 'Lomé',
      apprenants: 1240,
      specialite: 'Full-stack Spring Boot / Angular, FinTech & APIs',
      projetsFinaux: 480,
      fcfaInjectes: '24 800 000',
      description: 'Cœur économique et hub numérique, concentrant les scale-ups, les banques et les PME en recherche de développeurs opérationnels sans période de réadaptation.'
    },
    {
      nom: 'Région des Plateaux',
      chefLieu: 'Kpalimé',
      apprenants: 680,
      specialite: 'Agrotechnologie, Traçabilité Café-Cacao & Tourisme Éco',
      projetsFinaux: 215,
      fcfaInjectes: '9 400 000',
      description: 'Zone agricole stratégique : développement d\'applications mobiles de gestion de coopératives et de capteurs IoT pour le séchage des fèves.'
    },
    {
      nom: 'Région Centrale',
      chefLieu: 'Sokodé',
      apprenants: 450,
      specialite: 'Énergie Solaire Décentralisée & Micro-Réseaux Ruraux',
      projetsFinaux: 130,
      fcfaInjectes: '5 600 000',
      description: 'Formation de techniciens au monitoring numérique des kits solaires hors-réseau (off-grid) et à la maintenance prédictive pour villages isolés.'
    },
    {
      nom: 'Région de la Kara',
      chefLieu: 'Kara',
      apprenants: 510,
      specialite: 'Irrigation Solaire Intelligente & Électronique Frugale',
      projetsFinaux: 165,
      fcfaInjectes: '5 200 000',
      description: 'Pôle universitaire et agricole : prototypage de stations météo et vannes automatisées à base d\'ESP32 pour économiser l\'eau dans la vallée.'
    },
    {
      nom: 'Région des Savanes',
      chefLieu: 'Dapaong',
      apprenants: 390,
      specialite: 'Santé Numérique Frugale & Télémédecine pour Dispensaires',
      projetsFinaux: 110,
      fcfaInjectes: '3 500 000',
      description: 'Région septentrionale : outils de gestion des stocks de vaccins et télé-diagnostic basse connectivité fonctionnant 100% hors-ligne en mode local.'
    }
  ];

  get selectedRegion(): RegionImpact {
    return this.regions[this.selectedRegionIndex()];
  }
}
