export interface EmailVerification {
    email: string;              // The verified email address
    user: string;               // The username part of the email address
    domain: string;             // The domain of the email address
    accept_all: number;         // Indicates if the domain accepts all emails
    role: number;               // Indicates if the email address is a role-based address
    free_email: number;         // Indicates if the email address is from a free email provider
    disposable: number;         // Indicates if the email address is disposable
    spamtrap: number;           // Indicates if the email address is a spam trap
    success: boolean;           // Indicates if the verification was successful
    result: string;             // The result of the verification
    message: string;            // Additional message related to the verification
}