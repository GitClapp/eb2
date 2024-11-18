import { auth, db } from "$lib/firebase/eb2.server";
import { collection, getDocs } from "firebase/firestore";
import type { Actions, PageServerLoad } from './$types';
import { Timestamp } from "firebase/firestore";
import { fail, redirect } from '@sveltejs/kit';
import { authHandlers } from '$lib/firebase/auth.server';

export const load: PageServerLoad = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        console.log("Authenticated user information:", currentUser.email);

        const solicitudes = collection(db, "solicitudes");
        const solicitudesSnapshot = await getDocs(solicitudes);
        const solicitudesData: any[] = [];

        solicitudesSnapshot.forEach((doc: { id: any; data: () => any }) => {
            const data = doc.data();

            const processedData = {
                id: doc.id,
                ...data,

                // Check if the `date` field exists and is a Firestore `Timestamp`
                date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
            };

            solicitudesData.push(processedData);
        });

        return {
            solicitudes: solicitudesData,
            autenticado: true
        };

    } else {
        return {
            solicitudes: [],
            autenticado: false
        };
    }
};

export const actions: Actions = {
    login: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return fail(400, { error: 'Correo y contraseña son requeridos.' });
        }

        try {
            await authHandlers.login(email, password);

        } catch (error) {
            console.error('Error logging in:', error);
            return fail(401, { error: 'Credenciales inválidas.' });
        }

        redirect(303, '/solicitudes');
    },

    logout: async () => {
        try {
            await authHandlers.logout();

        } catch (error) {
            console.error('Error logging out:', error);
            return fail(400, { error: 'Error al cerrar sesión. Intenta de nuevo.' });
        }

        redirect(303, '/solicitudes');
    },
};