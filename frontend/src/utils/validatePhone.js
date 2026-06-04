export function validateAngolaPhone(phone) {
    const clean =
        phone.replace(/\D/g, "");
    const regex =
        /^(91|92|93|94|95|96|97|99)\d{7}$/;
    return regex.test(clean);
}