"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function resolveIncident(incidentId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('incidents')
        .update({ status: 'resolved' })
        .eq('id', incidentId);

    if (error) {
        console.error("Error resolving incident:", error);
        throw new Error("No se pudo resolver el incidente.");
    }

    revalidatePath('/incidents');
    revalidatePath('/projects');
}

export async function createIncident(formData: FormData) {
    const supabase = await createClient();

    const sectionId = formData.get("sectionId") as string;
    const description = formData.get("description") as string;
    const severity = formData.get("severity") as string;

    if (!sectionId || !description || !severity) {
        throw new Error("Faltan datos requeridos.");
    }

    const { error } = await supabase
        .from('incidents')
        .insert({
            section_id: sectionId,
            description,
            severity,
            status: 'open'
        });

    if (error) {
        console.error("Error creating incident:", error);
        throw new Error("No se pudo crear el incidente.");
    }

    revalidatePath('/incidents');
    revalidatePath('/projects');
    return { success: true };
}
