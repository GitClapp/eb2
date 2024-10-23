import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
    let lang = event.cookies.get('lang');
    let theme = event.cookies.get('theme');

    return resolve(event, {
        transformPageChunk: ({ html }) => {
            return (
                html.replace('%lang%', lang || "en"),
                html.replace('%theme%', theme || "")
            )
        },
    });

}) satisfies Handle;