"use client";

import { useState, useEffect } from "react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { ArrowRight, LogOut, CheckCircle, XCircle, Clock, Video, FileText, Search, Download } from "lucide-react";
import * as XLSX from 'xlsx';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

type Candidate = {
    id: string;
    created_at: string;
    first_name: string;
    last_name: string;
    whatsapp: string;
    email: string;
    country: string;
    city: string;
    age: number;
    role: string;
    status: string;
    score: number;
    [key: string]: any; // allowing other fields for details
};

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [errorInfo, setErrorInfo] = useState("");

    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterRole, setFilterRole] = useState("Tous");
    const [filterCountry, setFilterCountry] = useState("Tous");
    const [filterStatus, setFilterStatus] = useState("Tous");
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

    useEffect(() => {
        const authCookie = getCookie("admin_auth");
        if (authCookie === "true") {
            setIsAuthenticated(true);
            fetchCandidates();
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setCookie("admin_auth", "true", { maxAge: 60 * 60 * 24 }); // 1 day
            setIsAuthenticated(true);
            setErrorInfo("");
            fetchCandidates();
        } else {
            setErrorInfo("Mot de passe incorrect");
        }
    };

    const handleLogout = () => {
        deleteCookie("admin_auth");
        setIsAuthenticated(false);
        setCandidates([]);
    };

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/candidates');
            if (res.ok) {
                const data = await res.json();
                setCandidates(data.candidates || []);
            } else {
                console.error("Erreur de récupération HTTP", res.status);
            }
        } catch (error) {
            console.error("Erreur de récupération :", error);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                setCandidates(candidates.map(c => c.id === id ? { ...c, status: newStatus } : c));
                if (selectedCandidate && selectedCandidate.id === id) {
                    setSelectedCandidate({ ...selectedCandidate, status: newStatus });
                }
            } else {
                console.error("Erreur mise à jour statut", res.status);
            }
        } catch (err) {
            console.error("Erreur mise à jour statut", err);
        }
    };

    // Filtrage
    const filteredCandidates = candidates.filter(c => {
        const matchRole = filterRole === "Tous" || c.role === filterRole || c.role === "Les deux";
        const matchCountry = filterCountry === "Tous" || c.country === filterCountry;
        const matchStatus = filterStatus === "Tous" || c.status === filterStatus;
        const matchSearch = searchQuery === "" ||
            `${c.first_name} ${c.last_name} ${c.email} ${c.whatsapp}`.toLowerCase().includes(searchQuery.toLowerCase());

        return matchRole && matchCountry && matchStatus && matchSearch;
    });

    const uniqueCountries = Array.from(new Set(candidates.map(c => c.country))).filter(Boolean).sort();

    const handleExportExcel = () => {
        if (filteredCandidates.length === 0) return;

        const dataToExport = filteredCandidates.map(c => ({
            'ID': c.id,
            'Date de candidature': new Date(c.created_at).toLocaleDateString('fr-FR'),
            'Prénom': c.first_name,
            'Nom': c.last_name,
            'WhatsApp': c.whatsapp,
            'Email': c.email,
            'Pays': c.country,
            'Ville': c.city,
            'Age': c.age,
            'Poste souhaité': c.role,
            'Statut': c.status,
            // URLS
            'Pièce Identité URL': c.id_document_url || 'Non fourni',
            'Vidéo Présentation URL': c.presentation_video_url || 'Non fourni',
            'Permis Conduire URL': c.drivers_license_url || 'Non fourni',
            // Reponses Closeur
            'Expérience Vente': c.sales_experience || '',
            'Gestion Objection (Je vais réfléchir)': c.objection_handling || '',
            'Téléphone & Internet': c.has_smartphone_and_internet || '',
            'Ordinateur (PC/Mac)': c.has_pc || '',
            // Reponses Livreur
            'Moto Personnel': c.has_motorbike || '',
            'Disponibilité Immédiate': c.immediate_availability || '',
            'Expérience Livraison': c.delivery_experience || '',
            'Gestion Client Refus': c.client_refusal_handling || '',
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Candidatures");

        XLSX.writeFile(workbook, `Candidatures_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
                <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-lg shadow-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold">Espace Administrateur</h1>
                        <p className="text-zinc-500 text-sm mt-2">Accès restreint au recrutement</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                            />
                        </div>
                        {errorInfo && <p className="text-red-500 text-sm">{errorInfo}</p>}
                        <button
                            type="submit"
                            className="w-full h-10 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium"
                        >
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
                    <p className="text-zinc-500 mt-1">Gérez vos candidatures Closeurs & Livreurs</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-4">
                    <button onClick={handleExportExcel} disabled={filteredCandidates.length === 0} className="text-sm font-medium px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center disabled:opacity-50">
                        <Download className="w-4 h-4 mr-2" /> Exporter Excel
                    </button>
                    <button onClick={fetchCandidates} className="text-sm font-medium px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        Actualiser
                    </button>
                    <button onClick={handleLogout} className="text-sm font-medium px-4 py-2 bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center">
                        <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: List & Filters */}
                <div className="lg:col-span-1 border-r border-zinc-200 dark:border-zinc-800 pr-0 lg:pr-8">

                    {/* Filters */}
                    <div className="space-y-4 mb-6 sticky top-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="text-sm border border-zinc-300 dark:border-zinc-700 rounded-md py-1 px-2 bg-transparent">
                                <option value="Tous">Tous Postes</option>
                                <option value="Closeur">Closeur</option>
                                <option value="Livreur">Livreur</option>
                            </select>
                            <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className="text-sm border border-zinc-300 dark:border-zinc-700 rounded-md py-1 px-2 bg-transparent">
                                <option value="Tous">Tous Pays ({uniqueCountries.length})</option>
                                {uniqueCountries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-sm border border-zinc-300 dark:border-zinc-700 rounded-md py-1 px-2 bg-transparent">
                                <option value="Tous">Statut</option>
                                <option value="En attente">En attente</option>
                                <option value="Test">Test</option>
                                <option value="Accepté">Accepté</option>
                                <option value="Refusé">Refusé</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-xs font-medium text-zinc-500 mb-4">{filteredCandidates.length} candidat(s) trouvé(s)</div>

                    {/* List */}
                    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-250px)] pb-20">
                        {loading ? (
                            <p className="text-sm text-center py-10">Chargement...</p>
                        ) : filteredCandidates.length === 0 ? (
                            <p className="text-sm text-center py-10 text-zinc-500 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">Aucun résultat.</p>
                        ) : (
                            filteredCandidates.map(candidate => (
                                <div
                                    key={candidate.id}
                                    onClick={() => setSelectedCandidate(candidate)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedCandidate?.id === candidate.id
                                        ? "border-black dark:border-white bg-black/5 dark:bg-white/10"
                                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-sm truncate pr-2">{candidate.first_name} {candidate.last_name}</h3>
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${candidate.status === 'En attente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' :
                                            candidate.status === 'Refusé' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500' :
                                                candidate.status === 'Test' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500' :
                                                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
                                            }`}>
                                            {candidate.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-zinc-500 space-y-1">
                                        <p className="font-medium text-black dark:text-white">{candidate.role}</p>
                                        <p>{candidate.country} • {candidate.city}</p>
                                        <p>{new Date(candidate.created_at).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Candidate Details */}
                <div className="lg:col-span-2">
                    {selectedCandidate ? (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm p-6 lg:p-10 sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto">

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight mb-2">
                                        {selectedCandidate.first_name} {selectedCandidate.last_name}
                                    </h2>
                                    <div className="flex items-center gap-3 text-sm font-medium">
                                        <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-md">{selectedCandidate.role}</span>
                                        <span className="text-zinc-500">{selectedCandidate.age} ans</span>
                                    </div>
                                </div>

                                {/* Actions Status */}
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Changer le statut</span>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => updateStatus(selectedCandidate.id, 'En attente')} className={`px-3 py-1 text-xs font-semibold rounded-md border ${selectedCandidate.status === 'En attente' ? 'bg-yellow-100 border-yellow-200 text-yellow-800' : 'border-zinc-200 hover:bg-zinc-50'} dark:bg-transparent dark:hover:bg-zinc-800`}>Attente</button>
                                        <button onClick={() => updateStatus(selectedCandidate.id, 'Test')} className={`px-3 py-1 text-xs font-semibold rounded-md border ${selectedCandidate.status === 'Test' ? 'bg-blue-100 border-blue-200 text-blue-800' : 'border-zinc-200 hover:bg-zinc-50'} dark:bg-transparent dark:hover:bg-zinc-800`}>En Test</button>
                                        <button onClick={() => updateStatus(selectedCandidate.id, 'Accepté')} className={`px-3 py-1 text-xs font-semibold rounded-md border ${selectedCandidate.status === 'Accepté' ? 'bg-green-100 border-green-200 text-green-800' : 'border-zinc-200 hover:bg-zinc-50'} dark:bg-transparent dark:hover:bg-zinc-800`}><CheckCircle className="w-3 h-3 inline mr-1" />Accepté</button>
                                        <button onClick={() => updateStatus(selectedCandidate.id, 'Refusé')} className={`px-3 py-1 text-xs font-semibold rounded-md border ${selectedCandidate.status === 'Refusé' ? 'bg-red-100 border-red-200 text-red-800' : 'border-zinc-200 hover:bg-zinc-50'} dark:bg-transparent dark:hover:bg-zinc-800`}><XCircle className="w-3 h-3 inline mr-1" />Refusé</button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-10">
                                {/* Contact Info */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">Contact</h3>
                                    <ul className="space-y-3 text-sm">
                                        <li><span className="text-zinc-500 w-24 inline-block">WhatsApp:</span> <a href={`https://wa.me/${selectedCandidate.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="font-medium hover:underline">{selectedCandidate.whatsapp}</a></li>
                                        <li><span className="text-zinc-500 w-24 inline-block">Email:</span> <a href={`mailto:${selectedCandidate.email}`} className="font-medium hover:underline">{selectedCandidate.email}</a></li>
                                        <li><span className="text-zinc-500 w-24 inline-block">Localisation:</span> <span className="font-medium">{selectedCandidate.city}, {selectedCandidate.country}</span></li>
                                    </ul>
                                </div>

                                {/* Documents */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">Documents (Liens)</h3>
                                    <div className="space-y-2">
                                        {selectedCandidate.id_document_url ? (
                                            <a href={selectedCandidate.id_document_url} target="_blank" className="flex items-center text-sm font-medium hover:underline p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 text-blue-600 dark:text-blue-400"><FileText className="w-4 h-4 mr-2" /> Pièce d'identité</a>
                                        ) : (
                                            <p className="text-sm text-zinc-500 italic p-2">Aucune pièce fournie</p>
                                        )}

                                        {selectedCandidate.presentation_video_url && (
                                            <a href={selectedCandidate.presentation_video_url} target="_blank" className="flex items-center text-sm font-medium hover:underline p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 text-purple-600 dark:text-purple-400"><Video className="w-4 h-4 mr-2" /> Vidéo de présentation</a>
                                        )}

                                        {selectedCandidate.drivers_license_url && (
                                            <a href={selectedCandidate.drivers_license_url} target="_blank" className="flex items-center text-sm font-medium hover:underline p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 text-blue-600 dark:text-blue-400"><FileText className="w-4 h-4 mr-2" /> Permis de conduire</a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Role Specific Answers */}
                            <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-6">Réponses Spécifiques - {selectedCandidate.role}</h3>

                                <div className="space-y-6">
                                    {(selectedCandidate.role === 'Closeur' || selectedCandidate.role === 'Les deux') && (
                                        <>
                                            <div>
                                                <p className="text-xs text-zinc-500 font-medium mb-1">Expérience en vente</p>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedCandidate.sales_experience || "Non renseigné"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500 font-medium mb-1">Objection: "Je vais réfléchir"</p>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md italic">"{selectedCandidate.objection_handling}"</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="px-3 py-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 text-sm">
                                                    <span className="text-zinc-500 mr-2">Téléphone/Net:</span>
                                                    <span className="font-semibold">{selectedCandidate.has_smartphone_and_internet}</span>
                                                </div>
                                                <div className="px-3 py-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 text-sm">
                                                    <span className="text-zinc-500 mr-2">PC/Mac:</span>
                                                    <span className="font-semibold">{selectedCandidate.has_pc || "Non renseigné"}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {(selectedCandidate.role === 'Livreur' || selectedCandidate.role === 'Les deux') && (
                                        <>
                                            <div className="flex gap-4 mb-4">
                                                <div className="px-3 py-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 text-sm">
                                                    <span className="text-zinc-500 mr-2">Moto perso:</span>
                                                    <span className="font-semibold">{selectedCandidate.has_motorbike}</span>
                                                </div>
                                                <div className="px-3 py-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 text-sm">
                                                    <span className="text-zinc-500 mr-2">Dispo immédiate:</span>
                                                    <span className="font-semibold">{selectedCandidate.immediate_availability}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500 font-medium mb-1">Expérience en livraison</p>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedCandidate.delivery_experience || "Non renseigné"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500 font-medium mb-1">Gestion Client refusant de payer</p>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md italic">"{selectedCandidate.client_refusal_handling}"</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl relative overflow-hidden bg-white/50 dark:bg-zinc-900/50">
                            <div className="text-center">
                                <FileText className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                                <p className="text-zinc-500 font-medium">Sélectionnez un candidat pour voir les détails</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
