import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer style="background-color: #020617; color: #94a3b8; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 4.5rem; padding-bottom: 3rem; margin-top: auto; position: relative; z-index: 10;">
      <div class="app-container">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8" style="margin-bottom: 3.5rem;">
          
          <!-- Column 1: Brand Info -->
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <div style="width: 2.5rem; height: 2.5rem; border-radius: var(--radius-lg); background: var(--grad-cyber); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-family: var(--font-display);">
                F
              </div>
              <span style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: #ffffff;">
                FELC<span style="color: var(--neon-cyan);">.AI</span>
              </span>
            </div>
            <p style="font-size: 0.9rem; line-height: 1.7; color: #94a3b8;">
              Plateforme d'apprentissage 100% pratique, d'orientation IA anti-hallucination, de certification infalsifiable et d'insertion professionnelle pour la jeunesse d'Afrique francophone.
            </p>
            <div style="font-size: 0.8rem; color: #64748b; display: flex; align-items: center; gap: 0.5rem;">
              <span class="pulsing-dot"></span> Conçu pour le Togo & l'Afrique francophone.
            </div>
          </div>

          <!-- Column 2: Apprentissage -->
          <div>
            <h4 style="color: #ffffff; font-size: 1rem; margin-bottom: 1.25rem; font-family: var(--font-display);">Filières & Pratique</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem;">
              <li><a routerLink="/parcours" style="color: #94a3b8;">Parcours en huit étapes</a></li>
              <li><a routerLink="/mes-candidatures" style="color: #94a3b8;">Suivi des candidatures</a></li>
              <li><a routerLink="/formations" style="color: #94a3b8;">Catalogue de Formations</a></li>
              <li><a routerLink="/orientation" style="color: var(--neon-cyan); font-weight: 700;">✨ Diagnostic & Orientation IA</a></li>
              <li><a routerLink="/mes-formations" style="color: #94a3b8;">Projets Pratiques & GitHub</a></li>
              <li><a routerLink="/forum" style="color: #94a3b8;">Forum d'Entraide Communautaire</a></li>
            </ul>
          </div>

          <!-- Column 3: Emploi & Carrière -->
          <div>
            <h4 style="color: #ffffff; font-size: 1rem; margin-bottom: 1.25rem; font-family: var(--font-display);">Emploi & Carrière</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem;">
              <li><a routerLink="/offres" style="color: #94a3b8;">Offres d'Emploi & Stages</a></li>
              <li><a routerLink="/offres" [queryParams]="{ type: 'MISSION' }" style="color: #94a3b8;">Missions Freelance (FCFA)</a></li>
              <li><a routerLink="/interview-coach" style="color: var(--neon-cyan); font-weight: 700;">🎯 Simulateur d'Entretien IA</a></li>
              <li><a routerLink="/cv-builder" style="color: #cbd5e1; font-weight: 700;">📄 Générateur de CV Pro</a></li>
              <li><a routerLink="/certificats/verify" style="color: #facc15;">🛡️ Vérification de Certificat</a></li>
            </ul>
          </div>

          <!-- Column 4: Les Piliers Technologiques -->
          <div>
            <h4 style="color: #ffffff; font-size: 1rem; margin-bottom: 1.25rem; font-family: var(--font-display);">Piliers Technologiques</h4>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem;">
              <div style="background: rgba(255,255,255,0.03); padding: 0.75rem 1rem; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.06);">
                <strong style="color: var(--neon-cyan);">0% Quiz Passif</strong><br>
                <span style="color: #64748b;">Code source réel & déploiement.</span>
              </div>
              <div style="background: rgba(255,255,255,0.03); padding: 0.75rem 1rem; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.06);">
                <strong style="color: #34d399;">Correction IA Claude</strong><br>
                <span style="color: #64748b;">Analyse AST & feedback GitHub &lt; 15s.</span>
              </div>
              <div style="background: rgba(255,255,255,0.03); padding: 0.75rem 1rem; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.06);">
                <strong style="color: var(--neon-amber);">Preuve Infalsifiable</strong><br>
                <span style="color: #64748b;">Certificat FELC-ID vérifiable en ligne.</span>
              </div>
            </div>
          </div>

        </div>

        <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; font-size: 0.825rem; color: #64748b;">
          <div>
            © 2026 FELC. Plateforme pour l'Afrique francophone. Hackathon 2026.
          </div>
          <div style="display: flex; gap: 1.5rem; color: #94a3b8;">
            <span>PostgreSQL & Supabase</span>
            <span>Anthropic Claude API</span>
            <span>Angular 22 & Spring Boot 4</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
