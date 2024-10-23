import { derived, get, writable, type Writable } from 'svelte/store';
import { translator } from './translator';
import { browser } from "$app/environment";

export const fullName: Writable<string> = createPersistentStore('fullName', '');
export const email: Writable<string> = createPersistentStore('email', '');
export const phone: Writable<string> = createPersistentStore('phone', '');

// Base Routes
export const baseRoute = '';
export const baseImageRoute = `/images` + baseRoute;


// Language Management
export type Language = 'es';

export function isLanguage(value: any): value is Language {
    return (
        value === 'es'
    );
}

function setCookie(name: string, value: string, days: number) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    const cookieValue = encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString() + "; path=/; SameSite=Lax";
    document.cookie = name + "=" + cookieValue;
}

function getCookie(name: string): string | null {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (const cookie of cookieArray) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return cookieValue;
        }
    }

    return null;
}

function createPersistentStore(key: string, defaultValue: any) {
    let storedValue: string | null = null;
    if (browser) {
        let json = localStorage.getItem(key)
        if (json) {
            storedValue = JSON.parse(json);
        }
    }

    const store = writable(storedValue || defaultValue);

    // Subscribe to store changes and update local storage
    store.subscribe(value => {
        if (browser) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    });

    return store;
}

let navigatorLanguage;
let storedLanguage;
if (browser) {
    const languageCookie = getCookie('lang')
    if (isLanguage(languageCookie)) {
        storedLanguage = languageCookie;
    }

    const navigatorLanguageCode = navigator.language.split('-')[0].toLowerCase();
    if (isLanguage(navigatorLanguageCode)) {
        navigatorLanguage = navigatorLanguageCode;
    }
}

export const language: Writable<Language> = writable(storedLanguage || navigatorLanguage || 'es');

if (browser) {
    language.subscribe((value) => {
        document.documentElement.lang = value || 'es';
        setCookie('lang', value, 1000);
    })
}

export const dictionary = derived(language, (language) => translator[language]);