export async function validateAuthor(author: {
    name: string,
    dateOfBirth: string,
    dateOfDeath: string
}) {
    const errors: {
        name?: string;
        dateOfBirth?: string;
        dateOfDeath?: string;
    } = {};

    if (!author.name || author.name.length === 0) {
        errors.name = "The author's name is required."
    } else if (author.name.length < 5) {
        errors.name = "The name of the author has to have at least 5 characters."
    } else if (author.name.length > 255) {
        errors.name = "The name of the author cannot be larger than 255 characters."
    }

    if (!author.dateOfBirth) {
        errors.dateOfBirth = "The author's date of birth is required.";
    } else if (new Date(author.dateOfBirth) > new Date())
        errors.dateOfBirth = "The author's date of birth cannot be in the future."

    if (!author.dateOfDeath) {
        errors.dateOfDeath = "The author's date of death is required.";
    } else if (new Date(author.dateOfDeath) > new Date())
        errors.dateOfDeath = "The author's date of death cannot be in the future."

    return errors;
}