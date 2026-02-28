import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || "missing-key");

export async function POST(req: Request) {
    try {
        const { firstName, email, role } = await req.json();

        // Send email to candidate
        const { data: candidateData, error: candidateError } = await resend.emails.send({
            from: 'Recrutement <onboarding@resend.dev>', // Change this to your domain later
            to: email,
            subject: 'Candidature reçue - Recrutement Closeurs & Livreurs',
            html: `
        <div style="font-family: Arial, sans-serif; max-w-xl: 600px; margin: 0 auto; color: #171717;">
          <h1 style="color: #000000; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">Votre candidature a bien été reçue !</h1>
          <p>Bonjour ${firstName},</p>
          <p>Nous vous confirmons la bonne réception de votre candidature pour le poste de <strong>${role}</strong>.</p>
          <p>Notre équipe va examiner votre profil avec attention. Les processus de sélection étant rigoureux, nous vous contacterons si votre profil correspond à nos critères d'exigence.</p>
          <p>Si votre candidature est retenue pour l'étape suivante, vous recevrez un email ou un message WhatsApp de notre part sous 7 jours.</p>
          <p>Merci pour l'intérêt que vous portez à notre entreprise.</p>
          <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Cordialement,<br>L'équipe Recrutement</p>
        </div>
      `,
        });

        if (candidateError) {
            console.error("Resend error (Candidate):", candidateError);
            return NextResponse.json({ error: candidateError }, { status: 400 });
        }

        // You can also add a second resend.emails.send() here to notify the Admin
        // const adminEmail = process.env.ADMIN_EMAIL;
        // await resend.emails.send({ to: adminEmail, from: '...', subject: 'Nouvelle Candidature', ... });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("API Error sending email:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
