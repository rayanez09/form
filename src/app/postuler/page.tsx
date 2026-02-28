"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// --- VALIDATION SCHEMA ---
const formSchema = z.object({
    // Section 1
    firstName: z.string().min(2, "Le prénom est requis"),
    lastName: z.string().min(2, "Le nom est requis"),
    whatsapp: z.string().min(8, "Numéro WhatsApp invalide"),
    email: z.string().email("Email invalide"),
    country: z.enum(["Centrafrique", "Gabon"]),
    city: z.string().min(2, "La ville est requise"),
    age: z.string().min(2, "L'âge est requis"),
    idDocument: z.any().optional(), // File handle later

    // Section 2
    role: z.enum(["Closeur", "Livreur", "Les deux"]),

    // Section 3 (Closeur)
    salesExperience: z.string().optional(),
    productTypes: z.string().optional(),
    salesPerDay: z.string().optional(),
    objectionHandling: z.string().optional(),
    hasSmartphoneAndInternet: z.enum(["Oui", "Non"]).optional(),
    availability: z.string().optional(),
    presentationVideo: z.any().optional(), // File

    // Section 3 (Livreur)
    hasMotorbike: z.enum(["Oui", "Non"]).optional(),
    driversLicense: z.any().optional(), // File
    deliveryExperience: z.string().optional(),
    immediateAvailability: z.enum(["Oui", "Non"]).optional(),
    clientRefusalHandling: z.string().optional(),
    coverageZone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PostulerPage() {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            whatsapp: "",
            city: "",
            age: "18",
            role: "Closeur",
            country: "Centrafrique",
            hasSmartphoneAndInternet: "Oui",
            hasMotorbike: "Oui",
            immediateAvailability: "Oui"
        },
    });

    const role = form.watch("role");

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsSubmitting(true);
        setErrorMsg(null);
        try {
            const uploadFile = async (fileList: any, bucket: string) => {
                if (!fileList || fileList.length === 0) return null;
                const file = fileList[0];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

                if (uploadError) {
                    throw new Error(`Upload failed: ${uploadError.message}`);
                }

                const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
                return publicUrlData.publicUrl;
            };

            const idDocumentUrl = await uploadFile(data.idDocument, 'documents');
            const presentationVideoUrl = await uploadFile(data.presentationVideo, 'videos');
            const driversLicenseUrl = await uploadFile(data.driversLicense, 'documents');

            const { error } = await supabase.from('candidates').insert([
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    whatsapp: data.whatsapp,
                    email: data.email,
                    country: data.country,
                    city: data.city,
                    age: parseInt(data.age),
                    id_document_url: idDocumentUrl,

                    role: data.role,

                    sales_experience: data.salesExperience,
                    product_types: data.productTypes,
                    sales_per_day: data.salesPerDay,
                    objection_handling: data.objectionHandling,
                    has_smartphone_and_internet: data.hasSmartphoneAndInternet,
                    availability: data.availability,
                    presentation_video_url: presentationVideoUrl,

                    has_motorbike: data.hasMotorbike,
                    drivers_license_url: driversLicenseUrl,
                    delivery_experience: data.deliveryExperience,
                    immediate_availability: data.immediateAvailability,
                    client_refusal_handling: data.clientRefusalHandling,
                    coverage_zone: data.coverageZone,
                }
            ]);

            if (error) {
                console.error("Supabase insert error:", error);
                setErrorMsg("Une erreur est survenue lors de l'envoi de votre candidature.");
                setIsSubmitting(false);
                return;
            }

            // Trigger email confirmation
            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: data.firstName,
                    email: data.email,
                    role: data.role
                })
            }).catch(console.error);

            setIsSubmitted(true);
        } catch (err) {
            console.error(err);
            setErrorMsg("Erreur inattendue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = async () => {
        // Validate current step fields before proceeding
        let fieldsToValidate: any[] = [];
        if (step === 1) {
            fieldsToValidate = ["firstName", "lastName", "whatsapp", "email", "country", "city", "age"];
        } else if (step === 2) {
            fieldsToValidate = ["role"];
        }

        const output = await form.trigger(fieldsToValidate as any);
        if (output) setStep((s) => s + 1);
    };

    const prevStep = () => setStep((s) => s - 1);

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-foreground/[0.03] rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-8">
                        <CheckCircle2 className="h-10 w-10 text-foreground" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-4">Candidature transmise</h1>
                    <p className="text-foreground/70 mb-10 text-lg max-w-md">
                        Merci pour votre intérêt. Notre équipe va examiner votre profil avec la plus grande attention.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex h-12 px-8 items-center justify-center rounded-lg bg-foreground text-background font-semibold hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground flex flex-col items-center py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
            {/* Background design elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-black/5 dark:from-white/5 to-transparent pointer-events-none" />
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-foreground/[0.02] blur-[100px] pointer-events-none" />

            <div className="w-full max-w-3xl mb-8 flex justify-between items-center relative z-10">
                <Link href="/" className="inline-flex items-center text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors py-2 px-4 rounded-full hover:bg-foreground/5 -ml-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-foreground/40 hidden sm:inline-block">Progression</span>
                    <div className="flex gap-1.5 items-center bg-foreground/5 px-3 py-1.5 rounded-full">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`w-2 h-2 rounded-full transition-all duration-300 ${step === s ? "bg-foreground scale-125" : step > s ? "bg-foreground/40" : "bg-foreground/10"}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 rounded-2xl shadow-xl relative z-10 animate-in slide-in-from-bottom-8 duration-700 fade-in">
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
                        {step === 1 && "Commençons par vous."}
                        {step === 2 && "Votre ambition."}
                        {step === 3 && "Dites-nous en plus."}
                    </h1>
                    <p className="text-foreground/60 text-lg">
                        {step === 1 && "Saisissez vos informations personnelles."}
                        {step === 2 && "Sélectionnez le poste qui vous correspond."}
                        {step === 3 && "C'est l'étape décisive. Soyez précis."}
                    </p>
                </div>

                {errorMsg && (
                    <div className="mb-8 p-4 bg-red-50/50 border border-red-200/50 text-red-600 rounded-lg text-sm font-medium flex items-center animate-in slide-in-from-top-2">
                        <svg className="w-4 h-4 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* STEP 1: PERSONAL INFO */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground/80">Prénom</label>
                                    <input {...form.register("firstName")} className="w-full h-11 px-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30" />
                                    {form.formState.errors.firstName && <p className="text-red-500 text-xs mt-1">{form.formState.errors.firstName.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground/80">Nom</label>
                                    <input {...form.register("lastName")} className="w-full h-11 px-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30" />
                                    {form.formState.errors.lastName && <p className="text-red-500 text-xs mt-1">{form.formState.errors.lastName.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground/80">Numéro WhatsApp</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 text-sm">Wa.</span>
                                        <input {...form.register("whatsapp")} placeholder="+236..." className="w-full h-11 pl-12 pr-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30" />
                                    </div>
                                    {form.formState.errors.whatsapp && <p className="text-red-500 text-xs mt-1">{form.formState.errors.whatsapp.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground/80">Email Professionnel</label>
                                    <input type="email" {...form.register("email")} className="w-full h-11 px-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30" />
                                    {form.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground/80">Pays de Résidence</label>
                                    <select {...form.register("country")} className="w-full h-11 px-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 appearance-none">
                                        <option value="Centrafrique">République Centrafricaine</option>
                                        <option value="Gabon">Gabon</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground/80">Ville</label>
                                    <input {...form.register("city")} className="w-full h-11 px-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30" />
                                    {form.formState.errors.city && <p className="text-red-500 text-xs mt-1">{form.formState.errors.city.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-foreground/80">Âge</label>
                                <input type="number" {...form.register("age")} className="w-full h-11 px-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30" />
                                {form.formState.errors.age && <p className="text-red-500 text-xs mt-1">{form.formState.errors.age.message}</p>}
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <label className="text-sm font-semibold text-foreground/80 block mb-2">Pièce d'identité <span className="text-xs text-foreground/50 font-normal ml-2">(Passeport, CNI, etc.)</span></label>
                                <div className="relative border-2 border-dashed border-foreground/15 rounded-xl p-6 hover:bg-foreground/[0.02] transition-colors group cursor-pointer text-center">
                                    <input type="file" {...form.register("idDocument")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-foreground/[0.04] flex items-center justify-center group-hover:bg-foreground/[0.08] transition-colors">
                                            <svg className="w-5 h-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                        </div>
                                        <p className="text-sm font-medium text-foreground/80">Cliquez pour importer un document</p>
                                        <p className="text-xs text-foreground/40">PNG, JPG, PDF (Max 5MB)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: ROLE SELECTION */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-bold mb-2">Quel poste visez-vous ?</h3>
                                <p className="text-foreground/60 text-sm">Sélectionnez le poste qui correspond le mieux à vos compétences.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {["Closeur", "Livreur", "Les deux"].map((r) => (
                                    <label key={r} className={`relative flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all ${role === r ? 'border-foreground bg-foreground/[0.02] shadow-sm' : 'border-foreground/10 hover:border-foreground/30 hover:bg-foreground/[0.01]'}`}>
                                        <input type="radio" value={r} {...form.register("role")} className="sr-only" />
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-lg">{r}</span>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${role === r ? 'border-foreground' : 'border-foreground/20'}`}>
                                                {role === r && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
                                            </div>
                                        </div>
                                        <p className="text-sm text-foreground/60">
                                            {r === "Closeur" && "Vous avez la fibre commerciale et souhaitez vendre par téléphone/WhatsApp."}
                                            {r === "Livreur" && "Vous êtes sur le terrain et assurez les livraisons avec sérieux."}
                                            {r === "Les deux" && "Vous êtes polyvalent et pouvez cumuler les deux fonctions."}
                                        </p>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: CONDITIONAL */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {(role === "Closeur" || role === "Les deux") && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold border-b border-foreground/10 pb-2">Profil Closeur</h3>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-foreground/80">Expérience en vente</label>
                                        <textarea {...form.register("salesExperience")} className="w-full min-h-[100px] p-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 resize-none" placeholder="Décrivez votre expérience..." />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-foreground/80">Objection : "Je vais réfléchir" - Comment répondez-vous ?</label>
                                        <textarea {...form.register("objectionHandling")} className="w-full min-h-[100px] p-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 resize-none" placeholder="Quelle est votre approche ?" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-foreground/80">Smartphone + Internet Stable</label>
                                            <select {...form.register("hasSmartphoneAndInternet")} className="w-full h-11 px-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 appearance-none">
                                                <option value="Oui">Oui, je suis équipé</option>
                                                <option value="Non">Non</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pt-2">
                                        <label className="text-sm font-semibold text-foreground/80 block mb-2">Vidéo de présentation (1 min) <span className="text-xs text-foreground/50 font-normal ml-2">Vendez-vous !</span></label>
                                        <div className="relative border-2 border-dashed border-foreground/15 rounded-xl p-6 hover:bg-foreground/[0.02] transition-colors group cursor-pointer text-center">
                                            <input type="file" accept="video/*" {...form.register("presentationVideo")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-foreground/[0.04] flex items-center justify-center group-hover:bg-foreground/[0.08] transition-colors">
                                                    <svg className="w-5 h-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <p className="text-sm font-medium text-foreground/80">Cliquez pour importer la vidéo</p>
                                                <p className="text-xs text-foreground/40">MP4, MOV (Max 50MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(role === "Livreur" || role === "Les deux") && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold border-b border-foreground/10 pb-2">Profil Livreur</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-foreground/80">Moto personnelle ?</label>
                                            <select {...form.register("hasMotorbike")} className="w-full h-11 px-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 appearance-none">
                                                <option value="Oui">Oui</option>
                                                <option value="Non">Non</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-foreground/80">Disponibilité immédiate ?</label>
                                            <select {...form.register("immediateAvailability")} className="w-full h-11 px-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 appearance-none">
                                                <option value="Oui">Oui, je suis prêt</option>
                                                <option value="Non">Non</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-foreground/80">Expérience en livraison</label>
                                        <textarea {...form.register("deliveryExperience")} className="w-full min-h-[100px] p-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 resize-none" placeholder="Vos expériences de terrain..." />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-foreground/80">Un client refuse de payer à la livraison. Que faites-vous ?</label>
                                        <textarea {...form.register("clientRefusalHandling")} className="w-full min-h-[100px] p-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 resize-none" placeholder="Quelle est votre réaction ?" />
                                    </div>

                                    <div className="space-y-1.5 pt-2">
                                        <label className="text-sm font-semibold text-foreground/80 block mb-2">Permis de conduire <span className="text-xs text-foreground/50 font-normal ml-2">Upload</span></label>
                                        <div className="relative border-2 border-dashed border-foreground/15 rounded-xl p-6 hover:bg-foreground/[0.02] transition-colors group cursor-pointer text-center">
                                            <input type="file" {...form.register("driversLicense")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-foreground/[0.04] flex items-center justify-center group-hover:bg-foreground/[0.08] transition-colors">
                                                    <svg className="w-5 h-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                                </div>
                                                <p className="text-sm font-medium text-foreground/80">Cliquez pour importer votre permis</p>
                                                <p className="text-xs text-foreground/40">PNG, JPG, PDF (Max 5MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex justify-between pt-8 mt-8 border-t border-foreground/10">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-6 py-3 rounded-lg border border-foreground/20 font-semibold hover:bg-foreground/5 hover:text-foreground transition-all flex items-center"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-8 py-3 rounded-lg bg-foreground text-background font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
                            >
                                Continuer vers l'étape {step + 1}
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 rounded-lg bg-foreground text-background font-semibold hover:scale-[1.02] hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Transmission en cours...
                                    </>
                                ) : (
                                    "Finaliser ma candidature"
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
