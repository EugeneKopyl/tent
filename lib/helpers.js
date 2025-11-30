import { rusToEng } from '@/constants/helpers-const';

export function transliterate(text) {
    return text
        .split('')
        .map((char) => {
            return rusToEng[char] || char;
        })
        .join('');
}

export function generateSlug(text, prefix = 'link-') {
    if (!text) return prefix + Date.now();

    const transliterated = transliterate(text);

    return (
        transliterated
            .toLowerCase()
            .replace(/[^a-z0-9]+/gi, '-')
            .replace(/(^-|-$)/g, '')
            .replace(/-+/g, '-') || prefix + Date.now()
    );
}
