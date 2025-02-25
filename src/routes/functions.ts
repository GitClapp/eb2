import toast from "svelte-french-toast";
import { dictionary } from "./stores"
import { get } from 'svelte/store';

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function camelCaseToSpaced(camel: string): string {
    return camel.replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        .replace(/^./, str => str.toUpperCase());
}

export function capitalizeWords(str: string) {
    return str.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

export function shortenString(text: string): string {
    // Remove HTML tags from the text
    const cleanedText = text.replace(/(<([^>]+)>)/gi, ' ');

    const words = cleanedText.split(' ');
    const shortenedWords = words.slice(0, 30);
    const shortenedText = shortenedWords.join(' ');

    if (words.length > shortenedWords.length) {
        return shortenedText + '...';
    }

    return shortenedText;
}

export function convertDataUrlToUrl(dataUrl: string): string {
    const byteString = window.atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });

    return URL.createObjectURL(blob);
}

export function autoResizeTextarea(element: HTMLTextAreaElement): void {
    const minHeight = element.offsetHeight;

    const resize = () => {
        element.style.height = "auto";
        const newHeight = element.scrollHeight;
        element.style.height = Math.max(minHeight, newHeight) + "px";
    };

    // Event listeners for input, focus, and window resize
    element.addEventListener("input", resize);
    element.addEventListener("focus", resize);
    window.addEventListener("resize", resize);

    // Initial setup
    element.style.overflow = "hidden";
    element.style.boxSizing = "border-box";

    // Call resize initially and after the textarea is rendered
    setTimeout(resize, 0);
}

export function throttle(func: () => void, limit: number): () => void {
    let lastCallTime = 0;
    return function () {
        const now = Date.now();
        if (now - lastCallTime >= limit) {
            func();
            lastCallTime = now;
        }
    }
}

export function letterToAvatarUrl(letter: string): string {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 100;
    canvas.height = 100;

    if (!context) {
        return ''
    }

    context.fillStyle = '#D44508';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'bold 50px Outfit';
    context.fillStyle = '#F7F7FF';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(letter.toUpperCase(), canvas.width / 2, canvas.height / 2);

    const imageDataUrl = canvas.toDataURL();

    return imageDataUrl;

}

export function isGeneratedAvatarUrl(url: string): boolean {
    const prefix = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA';
    return url.startsWith(prefix);
}

export function isGeneratedBlobUrl(url: string): boolean {
    const prefix = 'blob:';
    return url.startsWith(prefix);
}

export function escapeHTML(input: string): string {
    const entityMap: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#47;',
        '`': '&#x60;',
        '=': '&#x3D;',
        ":": '&#x3A;',
        '?': '&#x3F;',
        '#': '&#x23;',
    };

    return input.replace(/[&<>"'\/`=:?#]/g, (s) => entityMap[s]);
}

export function unescapeHTML(input: string): string {
    const entityMap: { [key: string]: string } = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&#47;': '/',
        '&#x60;': '`',
        '&#x3D;': '=',
        '&#x3A;': ":",
        '&#x3F;': '?',
        '&#x23;': '#',
    };

    // Create a regular expression to find all the HTML entities in the input string.
    const entityRegex = /&amp;|&lt;|&gt;|&quot;|&#39;|&#47;|&#x60;|&#x3D|&#x3A;|&#x3F;|&#x23;/g;

    return input.replace(entityRegex, (s) => entityMap[s]);
}

let previousPhone = ''
export function phoneFormat(field: HTMLInputElement) {
    const specialCharCount = (field.value.match(/\D/g) || []).length;
    let cursorPosition = field.selectionStart;

    let input = field.value.replace(/\D/g, '');
    const size = input.length;
    if (input.substring(0, 1) === '1') {
        if (size === 0) { input = `` }
        else if (size < 2) { input = `+${input} ` }
        else if (size < 4) { input = `+${input.substring(0, 1)} (${input.substring(1)}` }
        else if (size < 8) { input = `+${input.substring(0, 1)} (${input.substring(1, 4)}) ${input.substring(4)}` }
        else if (size < 12) { input = `+${input.substring(0, 1)} (${input.substring(1, 4)}) ${input.substring(4, 7)}-${input.substring(7, 11)}` }
    } else {
        if (size > 7 && size < 11) { input = `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6)}` }
        else if (size > 3 && size < 8) { input = `${input.substring(0, 3)}-${input.substring(3)}` }
    }

    if (input !== previousPhone) {
        previousPhone = input
        const specialCharDiff = (input.match(/\D/g) || []).length - specialCharCount;
        if (cursorPosition) cursorPosition += specialCharDiff;

        field.value = input
        field.selectionStart = cursorPosition;
        field.selectionEnd = cursorPosition;
    }
}

export function isMobileOrTablet() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substring(0, 5))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
};

// Linkify URLs
export function linkify(text: string): string {
    const protocolUrlPattern = /((?:https?&#x3A;&#47;&#47;|ftp&#x3A;&#47;&#47;|@)(?:www\.)?(?:(?:[^\u0000-\u007F]|[A-Z0-9.-]){2,})(?:\.[A-Z]{2,}|&#x3A;[0-9]{2,5}|\.[0-9]{1,3})(?:&#47;(?:[^\u0000-\u007F]|[A-Z0-9\.\-\;\,\$\+~_@%]|&amp;|&#47;|&#x3D|&#x3A;|&#x3F;|&#x23;)*)?)/ig;
    const noProtocolUrlPattern = /((?:https?&#x3A;&#47;&#47;|ftp&#x3A;&#47;&#47;|@)?(?:www\.)?(?:(?:[^\u0000-\u007F]|[A-Z0-9.-]){2,})(?:\.(?:com|org|net|edu|gov|mil|io|co|us|uk|ca|de|es|it|fr|ru|jp|me|store|biz|info|name|tv|app|ai|gg|xyz|site|ly|dev))\b(?:&#47;(?:[^\u0000-\u007F]|[A-Z0-9\.\-\;\,\$\+~_@%]|&amp;|&#47;|&#x3D|&#x3A;|&#x3F;|&#x23;)*)?)/ig;
    const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

    // Replace URLs that have protocol so extension can be flexible
    text = text.replace(protocolUrlPattern, (match) => {
        // Do not change email addresses
        if (match.includes("@")) return match;

        return `<a style="text-decoration: underline; color: var(--complementary); ${match.length > 40 ? "word-break: break-all;" : ""};" href="${match}" target="_blank">${match}</a>`;
    });

    // Replace URLs that do not have protocol so extension is strict
    text = text.replace(noProtocolUrlPattern, (match) => {
        // Do not change email addresses or URLs that contain "://" (protocols), because they've already been changed
        if (match.includes("@") || match.includes("&#x3A;&#47;&#47;")) return match;

        // Prepend match with "https://"
        const href = 'https://' + match;

        return `<a style="text-decoration: underline; color: var(--complementary); ${match.length > 40 ? "word-break: break-all;" : ""};" href="${href}" target="_blank">${match}</a>`;
    });

    // Replace email addresses
    text = text.replace(emailPattern, (match) => {
        return `<a style="text-decoration: underline; color: var(--complementary); ${match.length > 40 ? "word-break: break-all;" : ""};" href="mailto:${match}">${match}</a>`
    });

    return text;
}

// Markdown conversion
export function convertMarkdown(text: string): string {
    const boldPattern = /\*((?:(?!<br>)[^*])*)\*/g; // *text*
    const italicPattern = /_((?:(?!<br>)[^_])*)_/g; // _text_
    const crossedPattern = /~((?:(?!<br>)[^~])*)~/g; // ~text~
    const monospacePattern = /&#x60;&#x60;&#x60;(?:<br>)?([\s\S]*?)&#x60;&#x60;&#x60;/g; // ```text```
    const unorderedListPattern = /(?<=^|\>)(?:&nbsp;)*(?:-\s)(.*?)(?:<br>|$)/gm; // - text
    const orderedListPattern = /(?<=^|\>)(?:&nbsp;)*(\d(?:\.|\))\s)(.*?)(?:<br>|$)/gm; // 1. text
    const subtitlePattern = /(^|<br>)(?:&#x23;\s)(.*?)(?:<br>|$)/gm; // # text

    // Placeholders for pre and a tags content
    const prePlaceholder = 'pasc00991j9a9d8cu8hlcaicbb';
    const aPlaceholder = 'ja7dc9120ksa0123oajx8123';
    let preContents: string[] = [];
    let aContents: string[] = [];

    text = text.replace(monospacePattern, '<pre>$1</pre>');

    // Replace content inside pre tags with placeholders
    text = text.replace(/<pre>([\s\S]*?)<\/pre><br>/g, (match, preContent) => {
        preContents.push(preContent);
        return match.replace(preContent, prePlaceholder).replace("<br>", "");
    });

    // Replace content inside a tags with placeholders
    text = text.replace(/<a[^>]*>(.*?)<\/a>/g, (match, linkContent) => {
        return match.replace(new RegExp(linkContent, 'g'), () => {
            aContents.push(linkContent)
            return aPlaceholder;
        });
    });

    // Perform markdown conversion
    text = text.replace(boldPattern, '<strong>$1</strong>')
        .replace(italicPattern, '<em>$1</em>')
        .replace(crossedPattern, '<s>$1</s>')
        .replace(unorderedListPattern, (match, content) => {
            const nbspCount = ((match || "").match(/&nbsp;/g) || []).length;
            return `<ul><li style="margin-left: ${nbspCount}ch;">${content}</li></ul>`;
        })
        .replace(orderedListPattern, (match, listNumber, content) => {
            const nbspCount = ((match || "").match(/&nbsp;/g) || []).length;
            return `<ol><li style="position: relative; margin-left: ${nbspCount}ch;"><span style="position: absolute; left: -2ch; top: 0;">${listNumber}</span>${content}</li></ol>`
        })
        .replace(subtitlePattern, '$1<h2>$2</h2>')

    // Merge consecutive <ul> or <ol> tags
    text = text.replace(/<\/ul>\s*<ul>/g, '').replace(/<\/ol>\s*<ol>/g, '');

    // Restore content inside pre tags
    text = text.replace(new RegExp(prePlaceholder, 'g'), () => preContents.shift() || '');

    // Restore content inside a tags
    text = text.replace(new RegExp(aPlaceholder, 'g'), () => aContents.shift() || '');

    return text;
}

// Convert newlines to <br>
export function convertNewlines(text: string): string {
    return text.replace(/\n/g, '<br>');
}

// Preserve spaces at the begging of lines
function preserveLeadingSpaces(text: string): string {
    return text.replace(/^[\s\t]+/gm, (match) => {
        return match.replace(/ /g, '&nbsp;').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    });
}

export function escapeAndFormat(text: string): string {
    const escapedText = escapeHTML(text);
    const linkifiedText = linkify(escapedText);
    const spacedText = preserveLeadingSpaces(linkifiedText);
    const newLinesText = convertNewlines(spacedText);
    return convertMarkdown(newLinesText);
}

let storedDictionary = get(dictionary);
export function anErrorOccurred(error: string = storedDictionary.errorOccurred) {
    toast.error(error, { position: 'bottom-center' });
}