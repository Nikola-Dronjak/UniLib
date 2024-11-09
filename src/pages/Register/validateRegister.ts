export async function validateRegister(user: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: string
}) {
    const errors: {
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        dateOfBirth?: string;
    } = {};

    if (!user.firstName || user.firstName.length === 0) {
        errors.firstName = "You must enter your first name."
    } else if (user.firstName.length < 2) {
        errors.firstName = "The first name has to be at least 2 characters."
    } else if (user.firstName.length > 255) {
        errors.firstName = "The first name cannot be larger than 255 characters."
    }

    if (!user.lastName || user.lastName.length === 0) {
        errors.lastName = "You must enter your last name."
    } else if (user.lastName.length < 2) {
        errors.lastName = "The last name has to be at least 2 characters."
    } else if (user.lastName.length > 255) {
        errors.lastName = "The last name cannot be larger than 255 characters."
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email || user.email.length === 0) {
        errors.email = "You must enter your email address."
    } else if (!emailRegex.test(user.email)) {
        errors.email = "Please enter a valid email address."
    } else if (user.email.length > 255) {
        errors.email = "The email cannot be larger than 255 characters."
    }

    if (!user.password || user.password.length === 0) {
        errors.password = "The password field cannot be empty."
    } else if (user.password.length < 5) {
        errors.password = "The password has to be at least 5 characters."
    } else if (user.password.length > 255) {
        errors.password = "The password cannot be larger than 255 characters."
    }

    if (!user.dateOfBirth) {
        errors.dateOfBirth = "You must enter your date of birth.";
    } else if (new Date(user.dateOfBirth) > new Date())
        errors.dateOfBirth = "The date of birth cannot be in the future."

    return errors;
}