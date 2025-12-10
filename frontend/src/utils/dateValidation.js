export function validateIsoDateYear(
    dateStr,
    { minYear = 1900, maxYear = 2100 } = {}
) {
    if (!dateStr) {
        return "Kuupäev on kohustuslik.";
    }

    // Must match ISO format yyyy-mm-dd
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    if (!match) {
        return "Kuupäev peab olema kujul PP.KK.AAAA.";
    }

    const year = Number(match[1]);
    if (year < minYear || year > maxYear) {
        return `Aasta peab olema vahemikus ${minYear}–${maxYear}.`;
    }

    return null;
}
