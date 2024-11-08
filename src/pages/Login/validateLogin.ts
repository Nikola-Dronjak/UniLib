export async function validateLogin(user: {
    email: string,
    password: string
}) {
    const errors: {
        email?: string;
        password?: string;
    } = {};

    if (!user.email || user.email.length === 0)
        errors.email = "You must enter your email address."

    if (!user.password || user.password.length === 0)
        errors.password = "The password field cannot be empty."

    return errors;
}