import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DomaineResponse,
  FormationResponse,
  FormationDetailResponse,
  InscriptionResponse,
  SoumissionResponse,
  CertificatResponse,
  CertificatVerificationResponse,
  OffreResponse,
  CandidatureResponse,
  OrientationResponse,
  PortfolioResponse,
  SujetResponse,
  SujetDetailResponse,
  MessageForumResponse,
  AdminStatsResponse,
  AdminUserResponse,
  UserResponse
} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // ==================== DOMAINES ====================
  getDomaines(): Observable<DomaineResponse[]> {
    return this.http.get<DomaineResponse[]>(`${this.base}/api/domaines`);
  }

  createDomaine(data: { nom: string; code: string; description?: string }): Observable<DomaineResponse> {
    return this.http.post<DomaineResponse>(`${this.base}/api/domaines`, data);
  }

  // ==================== FORMATIONS ====================
  getFormations(niveau?: string, domaineId?: number): Observable<FormationResponse[]> {
    let params = new HttpParams();
    if (niveau) params = params.set('niveau', niveau);
    if (domaineId) params = params.set('domaineId', domaineId.toString());
    return this.http.get<FormationResponse[]>(`${this.base}/api/formations`, { params });
  }

  getFormationById(id: number): Observable<FormationDetailResponse> {
    return this.http.get<FormationDetailResponse>(`${this.base}/api/formations/${id}`);
  }

  createFormation(data: { titre: string; description: string; niveau: string; domaineId: number }): Observable<FormationResponse> {
    return this.http.post<FormationResponse>(`${this.base}/api/formations`, data);
  }

  // ==================== MODULES & EXERCICES ====================
  createModule(formationId: number, data: { titre: string; contenu: string; ordre: number }) {
    return this.http.post(`${this.base}/api/formations/${formationId}/modules`, data);
  }

  createExercice(formationId: number, data: { titre: string; consigne: string; criteres: string; ordre: number; projetFinal: boolean }) {
    return this.http.post(`${this.base}/api/formations/${formationId}/exercices`, data);
  }

  // ==================== INSCRIPTIONS ====================
  inscrire(formationId: number): Observable<InscriptionResponse> {
    return this.http.post<InscriptionResponse>(`${this.base}/api/formations/${formationId}/inscription`, {});
  }

  getMesInscriptions(): Observable<InscriptionResponse[]> {
    return this.http.get<InscriptionResponse[]>(`${this.base}/api/inscriptions/me`);
  }

  // ==================== SOUMISSIONS ====================
  soumettreExercice(exerciceId: number, data: { lienDepot: string; commentaire?: string }): Observable<SoumissionResponse> {
    const lien = data.lienDepot.trim();
    return this.http.post<SoumissionResponse>(`${this.base}/api/exercices/${exerciceId}/soumissions`, {
      lienDepot: lien.startsWith('http://') || lien.startsWith('https://') ? lien : `https://${lien}`,
      commentaire: data.commentaire
    });
  }

  getMesSoumissions(): Observable<SoumissionResponse[]> {
    return this.http.get<SoumissionResponse[]>(`${this.base}/api/soumissions/me`);
  }

  getSoumissionsAEvaluer(): Observable<SoumissionResponse[]> {
    return this.http.get<SoumissionResponse[]>(`${this.base}/api/soumissions/a-evaluer`);
  }

  evaluerSoumission(id: number, data: { note: number; feedback: string; statut?: string }): Observable<SoumissionResponse> {
    const statut = data.statut ?? (data.note >= 70 ? 'VALIDEE' : 'A_REVOIR');
    return this.http.put<SoumissionResponse>(`${this.base}/api/soumissions/${id}/evaluation`, {
      statut,
      note: data.note,
      feedback: data.feedback
    });
  }

  corrigerSoumissionIa(id: number): Observable<SoumissionResponse> {
    return this.http.post<SoumissionResponse>(`${this.base}/api/soumissions/${id}/correction-ia`, {});
  }

  // ==================== CERTIFICATS ====================
  getMesCertificats(): Observable<CertificatResponse[]> {
    return this.http.get<CertificatResponse[]>(`${this.base}/api/certificats/me`);
  }

  verifierCertificat(code: string): Observable<CertificatVerificationResponse> {
    return this.http.get<CertificatVerificationResponse>(`${this.base}/api/certificats/verify/${code}`);
  }

  // ==================== OFFRES & CANDIDATURES ====================
  getOffres(paramsObj?: { type?: string; domaineId?: number; remote?: boolean; q?: string }): Observable<OffreResponse[]> {
    let params = new HttpParams();
    if (paramsObj?.type) params = params.set('type', paramsObj.type);
    if (paramsObj?.domaineId) params = params.set('domaineId', paramsObj.domaineId.toString());
    if (paramsObj?.remote !== undefined) params = params.set('remote', paramsObj.remote.toString());
    if (paramsObj?.q) params = params.set('q', paramsObj.q);
    return this.http.get<OffreResponse[]>(`${this.base}/api/offres`, { params });
  }

  getOffreById(id: number): Observable<OffreResponse> {
    return this.http.get<OffreResponse>(`${this.base}/api/offres/${id}`);
  }

  getMesOffres(): Observable<OffreResponse[]> {
    return this.http.get<OffreResponse[]>(`${this.base}/api/offres/me`);
  }

  createOffre(data: {
    titre: string;
    description: string;
    type: string;
    domaineId: number;
    localisation: string;
    remote: boolean;
    experienceMin: number;
    budget: number;
  }): Observable<OffreResponse> {
    return this.http.post<OffreResponse>(`${this.base}/api/offres`, data);
  }

  changerStatutOffre(id: number, statut: string): Observable<OffreResponse> {
    return this.http.put<OffreResponse>(`${this.base}/api/offres/${id}/statut`, { statut });
  }

  postuler(offreId: number, data: { message: string; lienPortfolio?: string }): Observable<CandidatureResponse> {
    const lien = data.lienPortfolio?.trim();
    return this.http.post<CandidatureResponse>(`${this.base}/api/offres/${offreId}/candidatures`, {
      message: data.message,
      lienPortfolio: lien ? (lien.startsWith('http://') || lien.startsWith('https://') ? lien : `https://${lien}`) : undefined
    });
  }

  getMesCandidatures(): Observable<CandidatureResponse[]> {
    return this.http.get<CandidatureResponse[]>(`${this.base}/api/candidatures/me`);
  }

  getCandidaturesOffre(offreId: number): Observable<CandidatureResponse[]> {
    return this.http.get<CandidatureResponse[]>(`${this.base}/api/offres/${offreId}/candidatures`);
  }

  changerStatutCandidature(candidatureId: number, statut: string): Observable<CandidatureResponse> {
    return this.http.put<CandidatureResponse>(`${this.base}/api/candidatures/${candidatureId}/statut`, { statut });
  }

  // ==================== ORIENTATION IA ====================
  orienterProfil(data: {
    domaineId: number;
    niveau: string;
    objectif: string;
    heuresParSemaine: number;
    metier?: string;
  }): Observable<OrientationResponse> {
    return this.http.post<OrientationResponse>(`${this.base}/api/orientation`, {
      domaineId: data.domaineId,
      niveau: data.niveau,
      objectif: data.objectif,
      heuresParSemaine: Number(data.heuresParSemaine),
      metier: data.metier
    });
  }

  // ==================== PORTFOLIO ====================
  getMonPortfolio(): Observable<PortfolioResponse> {
    return this.http.get<PortfolioResponse>(`${this.base}/api/portfolio/me`);
  }

  getPortfolioPublic(userId: number): Observable<PortfolioResponse> {
    return this.http.get<PortfolioResponse>(`${this.base}/api/portfolio/${userId}`);
  }

  changerVisibilitePortfolio(portfolioPublic: boolean): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.base}/api/portfolio/me/visibilite`, { visible: portfolioPublic });
  }

  // ==================== FORUM ====================
  getSujets(domaineId?: number): Observable<SujetResponse[]> {
    let params = new HttpParams();
    if (domaineId) params = params.set('domaineId', domaineId.toString());
    return this.http.get<SujetResponse[]>(`${this.base}/api/forum/sujets`, { params });
  }

  getSujetById(id: number): Observable<SujetDetailResponse> {
    return this.http.get<SujetDetailResponse>(`${this.base}/api/forum/sujets/${id}`);
  }

  creerSujet(data: { titre: string; contenu: string; domaineId: number }): Observable<SujetResponse> {
    return this.http.post<SujetResponse>(`${this.base}/api/forum/sujets`, data);
  }

  repondreSujet(sujetId: number, data: { contenu: string }): Observable<MessageForumResponse> {
    return this.http.post<MessageForumResponse>(`${this.base}/api/forum/sujets/${sujetId}/messages`, data);
  }

  marquerSolution(sujetId: number, messageId: number): Observable<MessageForumResponse> {
    return this.http.put<MessageForumResponse>(`${this.base}/api/forum/sujets/${sujetId}/messages/${messageId}/solution`, {});
  }

  // ==================== ADMIN ====================
  getAdminStats(): Observable<AdminStatsResponse> {
    return this.http.get<AdminStatsResponse>(`${this.base}/api/admin/stats`);
  }

  getAdminUsers(role?: string): Observable<AdminUserResponse[]> {
    let params = new HttpParams();
    if (role) params = params.set('role', role);
    return this.http.get<AdminUserResponse[]>(`${this.base}/api/admin/users`, { params });
  }

  changerActivationUser(id: number, actif: boolean): Observable<AdminUserResponse> {
    return this.http.put<AdminUserResponse>(`${this.base}/api/admin/users/${id}/activation`, { actif });
  }

  getAdminOffres(): Observable<OffreResponse[]> {
    return this.http.get<OffreResponse[]>(`${this.base}/api/admin/offres`);
  }

  // ==================== USER PROFILE ====================
  getMonProfil(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.base}/api/users/me`);
  }

  updateMonProfil(data: { nom: string; prenom: string; localisation?: string; bio?: string; lienGithub?: string; lienLinkedin?: string }): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.base}/api/users/me`, data);
  }
}
