import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', title: 'Accueil', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'parcours', title: 'Parcours', loadComponent: () => import('./features/parcours/parcours.component').then(m => m.ParcoursComponent) },
  { path: 'mes-candidatures', title: 'Mes candidatures', loadComponent: () => import('./features/candidatures/mes-candidatures.component').then(m => m.MesCandidaturesComponent), canActivate: [authGuard, roleGuard(['APPRENANT'])] },
  { path: 'interview-coach', title: 'Entretien', loadComponent: () => import('./features/interview/interview-coach.component').then(m => m.InterviewCoachComponent) },
  { path: 'cv-builder', title: 'CV', loadComponent: () => import('./features/cv/cv-builder.component').then(m => m.CvBuilderComponent) },
  { path: 'impact', title: 'Impact', loadComponent: () => import('./features/impact/impact.component').then(m => m.ImpactComponent) },
  { path: 'bourses', title: 'Bourses', loadComponent: () => import('./features/bourses/bourses.component').then(m => m.BoursesComponent) },
  { path: 'auth/login', title: 'Connexion', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'auth/register', title: 'Inscription', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'orientation', title: 'Orientation', loadComponent: () => import('./features/orientation/orientation.component').then(m => m.OrientationComponent) },
  { path: 'formations', title: 'Formations', loadComponent: () => import('./features/formations/formation-list.component').then(m => m.FormationListComponent) },
  { path: 'formations/:id', title: 'Formation', loadComponent: () => import('./features/formations/formation-detail.component').then(m => m.FormationDetailComponent) },
  { path: 'mes-formations', title: 'Mes formations', loadComponent: () => import('./features/formations/mes-formations.component').then(m => m.MesFormationsComponent), canActivate: [authGuard] },
  { path: 'mes-certificats', title: 'Mes certificats', loadComponent: () => import('./features/certificats/mes-certificats.component').then(m => m.MesCertificatsComponent), canActivate: [authGuard] },
  { path: 'certificats/verify', title: 'Vérifier un certificat', loadComponent: () => import('./features/certificats/verify-certificat.component').then(m => m.VerifyCertificatComponent) },
  { path: 'offres', title: 'Emploi', loadComponent: () => import('./features/offres/offre-list.component').then(m => m.OffreListComponent) },
  { path: 'offres/:id', title: 'Offre', loadComponent: () => import('./features/offres/offre-detail.component').then(m => m.OffreDetailComponent) },
  { path: 'entreprise/offres', title: 'Mes offres', loadComponent: () => import('./features/offres/entreprise-offres.component').then(m => m.EntrepriseOffresComponent), canActivate: [roleGuard(['ENTREPRISE', 'ADMIN'])] },
  { path: 'forum', title: 'Forum', loadComponent: () => import('./features/forum/forum.component').then(m => m.ForumComponent) },
  { path: 'portfolio/me', title: 'Mon portfolio', loadComponent: () => import('./features/portfolio/portfolio.component').then(m => m.PortfolioComponent), canActivate: [authGuard] },
  { path: 'portfolio/:id', title: 'Portfolio', loadComponent: () => import('./features/portfolio/portfolio.component').then(m => m.PortfolioComponent) },
  { path: 'formateur/dashboard', title: 'Espace formateur', loadComponent: () => import('./features/formateur/formateur-dashboard.component').then(m => m.FormateurDashboardComponent), canActivate: [roleGuard(['FORMATEUR', 'ADMIN'])] },
  { path: 'admin', title: 'Administration', loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [roleGuard(['ADMIN'])] },
  { path: '**', redirectTo: '' }
];
