export type Role = 'APPRENANT' | 'FORMATEUR' | 'ENTREPRISE' | 'ADMIN';
export type Niveau = 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
export type TypeOffre = 'EMPLOI' | 'MISSION';
export type StatutOffre = 'OUVERTE' | 'FERMEE';
export type StatutCandidature = 'RECUE' | 'VUE' | 'ACCEPTEE' | 'REFUSEE';
export type StatutSoumission = 'EN_ATTENTE' | 'VALIDEE' | 'A_REVOIR';

export interface UserResponse {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
  localisation?: string;
  bio?: string;
  lienGithub?: string;
  lienLinkedin?: string;
  actif: boolean;
  portfolioPublic: boolean;
  dateInscription: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
}

export interface DomaineResponse {
  id: number;
  nom: string;
  code: string;
  description?: string;
}

export interface FormationResponse {
  id: number;
  titre: string;
  description: string;
  niveau: Niveau;
  domaineId: number;
  domaineNom: string;
  domaineCode: string;
  formateurId: number;
  formateurNom: string;
  formateurPrenom: string;
}

export interface ModuleResponse {
  id: number;
  titre: string;
  contenu: string;
  ordre: number;
  formationId: number;
}

export interface ExerciceResponse {
  id: number;
  titre: string;
  consigne: string;
  criteres: string;
  ordre: number;
  projetFinal: boolean;
  formationId: number;
}

export interface FormationDetailResponse extends FormationResponse {
  modules: ModuleResponse[];
  exercices: ExerciceResponse[];
}

export interface InscriptionResponse {
  id: number;
  formationId: number;
  formationTitre: string;
  progression: number;
  statut: string;
  dateDebut: string;
}

export interface SoumissionResponse {
  id: number;
  exerciceId: number;
  exerciceTitre: string;
  apprenantId: number;
  apprenantNom: string;
  lienDepot: string;
  commentaire?: string;
  statut: StatutSoumission;
  note?: number;
  feedback?: string;
  dateSoumission: string;
}

export interface CertificatResponse {
  id: number;
  code: string;
  formationId: number;
  formationTitre: string;
  score: number;
  dateEmission: string;
}

export interface CertificatVerificationResponse {
  code: string;
  apprenantNom: string;
  apprenantPrenom: string;
  formationTitre: string;
  score: number;
  dateEmission: string;
  valide: boolean;
}

export interface OffreResponse {
  id: number;
  titre: string;
  description: string;
  type: TypeOffre;
  domaineId: number;
  domaineNom: string;
  localisation: string;
  remote: boolean;
  experienceMin: number;
  budget: number;
  statut: StatutOffre;
  datePublication: string;
  entrepriseNom: string;
}

export interface CandidatureResponse {
  id: number;
  offreId: number;
  offreTitre: string;
  apprenantId: number;
  candidatNom: string;
  candidatPrenom: string;
  candidatEmail: string;
  message: string;
  lienPortfolio?: string;
  statut: StatutCandidature;
  dateCandidature: string;
}

export interface SujetResponse {
  id: number;
  titre: string;
  contenu: string;
  domaineId: number;
  domaineNom: string;
  auteurNom: string;
  auteurPrenom: string;
  auteurRole: string;
  resolu: boolean;
  nbReponses: number;
  dateCreation: string;
  dateDerniereActivite: string;
}

export interface MessageForumResponse {
  id: number;
  sujetId: number;
  contenu: string;
  auteurNom: string;
  auteurPrenom: string;
  auteurRole: string;
  estSolution: boolean;
  dateCreation: string;
}

export interface SujetDetailResponse extends SujetResponse {
  messages: MessageForumResponse[];
}

export interface OrientationFormationItem {
  id: number;
  titre: string;
  niveau: string;
  description: string;
}

export interface OrientationResponse {
  niveauEstime: string;
  resumeDiagnostic: string;
  competencesCibles: string[];
  formationsRecommandees: OrientationFormationItem[];
  projetsSuggerees: string[];
  dureeEstimeeSemaines: number;
  opportunitesMarche: OffreResponse[];
}

export interface ProjetValide {
  exerciceTitre: string;
  formationTitre: string;
  lienDepot: string;
  note: number;
  feedback: string;
}

export interface PortfolioResponse {
  userId: number;
  nom: string;
  prenom: string;
  bio?: string;
  localisation?: string;
  lienGithub?: string;
  lienLinkedin?: string;
  competences: string[];
  projetsValides: ProjetValide[];
  certificats: CertificatResponse[];
}

export interface AdminStatsResponse {
  utilisateurs: number;
  apprenants: number;
  formateurs: number;
  entreprises: number;
  formations: number;
  inscriptions: number;
  inscriptionsTerminees: number;
  soumissionsEnAttente: number;
  certificats: number;
  offresOuvertes: number;
  offresFermees: number;
  candidatures: number;
}

export interface AdminUserResponse {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
  actif: boolean;
  dateInscription: string;
}
