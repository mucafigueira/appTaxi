export function formatPhone(value) {

    /*
    Remove tudo que não é número
    */
    const numbers =
        value.replace(/\D/g, "");

    /*
    Limite 9 dígitos
    */
    const clean =
        numbers.slice(0, 9);

    if (clean.length <= 3)
        return clean;

    if (clean.length <= 6)
        return `${clean.slice(0, 3)} ${clean.slice(3)}`;
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
}