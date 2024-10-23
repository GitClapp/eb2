import { db } from "$lib/firebase/eb2.server";
import { collection, getDocs } from "firebase/firestore";
import type { PageServerLoad } from "./$types";
import { Timestamp } from "firebase/firestore"; // Import Firestore Timestamp

export const load: PageServerLoad = async () => {
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
    };
};