"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

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
        // For now, prevent default and transition to success map
        console.log("Form Submitted:", data);
        // TODO: Send data to Supabase and trigger Resend email
        setIsSubmitted(true);
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
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
                <CheckCircle2 className="h-16 w-16 mb-6" />
                <h1 className="text-3xl font-bold mb-2">Candidature envoyée</h1>
                <p className="text-foreground/70 mb-8 max-w-md text-center">
                    Merci pour votre intérêt. Nous examinerons votre profil et vous contacterons sous peu.
                </p>
                <Link
                    href="/"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-foreground text-background px-8 text-sm font-medium"
                >
                    Retour à l'accueil
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-6">
            <div className="w-full max-w-2xl mb-8 flex justify-between items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Link>
                <div className="text-sm font-medium text-foreground/60">
                    Étape {step} sur 3
                </div>
            </div>

            <div className="w-full max-w-2xl bg-white border border-foreground/10 p-8 rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.02)]">
                <h1 className="text-2xl font-bold mb-6">
                    {step === 1 && "Informations personnelles"}
                    {step === 2 && "Poste souhaité"}
                    {step === 3 && "Détails de la candidature"}
                </h1>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* STEP 1: PERSONAL INFO */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Prénom</label>
                                    <input {...form.register("firstName")} className="w-full h-10 px-3 rounded-md border border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground" />
                                    {form.formState.errors.firstName && <p className="text-red-500 text-xs">{form.formState.errors.firstName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nom</label>
                                    <input {...form.register("lastName")} className="w-full h-10 px-3 rounded-md border border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground" />
                                    {form.formState.errors.lastName && <p className="text-red-500 text-xs">{form.formState.errors.lastName.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Numéro WhatsApp</label>
                                    <input {...form.register("whatsapp")} placeholder="+236..." className="w-full h-10 px-3 rounded-md border border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground" />
                                    {form.formState.errors.whatsapp && <p className="text-red-500 text-xs">{form.formState.errors.whatsapp.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input type="email" {...form.register("email")} className="w-full h-10 px-3 rounded-md border border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground" />
                                    {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Pays</label>
                                    <select {...form.register("country")} className="w-full h-10 px-3 rounded-md border border-foreground/20 bg-background focus:outline-none focus:ring-1 focus:ring-foreground">
                                        <option value="Centrafrique">République Centrafricaine</option>
                                        <option value="Gabon">Gabon</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ville</label>
                                    <input {...form.register("city")} className="w-full h-10 px-3 rounded-md border border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground" />
                                    {form.formState.errors.city && <p className="text-red-500 text-xs">{form.formState.errors.city.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Âge</label>
                                <input type="number" {...form.register("age")} className="w-full h-10 px-3 rounded-md border border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground" />
                                {form.formState.errors.age && <p className="text-red-500 text-xs">{form.formState.errors.age.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pièce d'identité (Upload)</label>
                                <input type="file" {...form.register("idDocument")} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-foreground/5 file:text-foreground hover:file:bg-foreground/10" />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: ROLE SELECTION */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <label className="text-sm font-medium block mb-2">Quel poste visez-vous ?</label>
                            <div className="space-y-3">
                                {["Closeur", "Livreur", "Les deux"].map((r) => (
                                    <label key={r} className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${role === r ? 'border-foreground bg-foreground/5' : 'border-foreground/20 hover:bg-foreground/5'}`}>
                                        <input type="radio" value={r} {...form.register("role")} className="mr-3 h-4 w-4 text-foreground focus:ring-foreground cursor-pointer" />
                                        <span className="font-medium">{r}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: CONDITIONAL */}
                    {step === 3 && (
                        <div className="space-y-6">
                            {(role === "Closeur" || role === "Les deux") && (
                                <div className="space-y-4 border-l-2 border-foreground/20 pl-4 py-2">
                                    <h3 className="font-bold">Questions Closeur</h3>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Expérience en vente</label>
                                        <textarea {...form.register("salesExperience")} className="w-full min-h-[80px] p-3 rounded-md border border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="Décrivez votre expérience..." />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Réponse à l'objection : "Je vais réfléchir"</label>
                                        <textarea {...form.register("objectionHandling")} className="w-full min-h-[80px] p-3 rounded-md border border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="Comment traitez-vous cette objection ?" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Smartphone + Internet stable ?</label>
                                            <select {...form.register("hasSmartphoneAndInternet")} className="w-full h-10 px-3 rounded-md border border-foreground/20 bg-background focus:outline-none focus:ring-1 focus:ring-foreground">
                                                <option value="Oui">Oui</option>
                                                <option value="Non">Non</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Vidéo de présentation (1 min - Upload)</label>
                                        <input type="file" accept="video/*" {...form.register("presentationVideo")} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-foreground/5 file:text-foreground hover:file:bg-foreground/10" />
                                    </div>
                                </div>
                            )}

                            {(role === "Livreur" || role === "Les deux") && (
                                <div className="space-y-4 border-l-2 border-foreground/20 pl-4 py-2 mt-6">
                                    <h3 className="font-bold">Questions Livreur</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Moto personnelle ?</label>
                                            <select {...form.register("hasMotorbike")} className="w-full h-10 px-3 rounded-md border border-foreground/20 bg-background focus:outline-none focus:ring-1 focus:ring-foreground">
                                                <option value="Oui">Oui</option>
                                                <option value="Non">Non</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Disponibilité immédiate ?</label>
                                            <select {...form.register("immediateAvailability")} className="w-full h-10 px-3 rounded-md border border-foreground/20 bg-background focus:outline-none focus:ring-1 focus:ring-foreground">
                                                <option value="Oui">Oui</option>
                                                <option value="Non">Non</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Expérience en livraison</label>
                                        <textarea {...form.register("deliveryExperience")} className="w-full min-h-[80px] p-3 rounded-md border border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="Décrivez votre expérience..." />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Gestion d'un client qui refuse de payer</label>
                                        <textarea {...form.register("clientRefusalHandling")} className="w-full min-h-[80px] p-3 rounded-md border border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="Comment réagissez-vous ?" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Permis de conduire (Upload)</label>
                                        <input type="file" {...form.register("driversLicense")} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-foreground/5 file:text-foreground hover:file:bg-foreground/10" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex justify-between pt-6 border-t border-foreground/10">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-6 py-2 rounded-md border border-foreground/20 font-medium hover:bg-foreground/5 transition-colors"
                            >
                                Précédent
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-2 rounded-md bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                            >
                                Suivant
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-md bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                            >
                                Soumettre ma candidature
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
