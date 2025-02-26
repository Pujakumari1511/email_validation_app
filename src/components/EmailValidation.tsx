import { EmailVerification } from "@/types/api";
import { useState } from "react";

export const EmailValidation = () => {
    const [email, setEmail] = useState<string>("");
    const [validationResult, setvalidationResult] = useState<EmailVerification>();

    const onSubmit = async () => {
        if(email == ""){
            return
        }
        const response = await fetch(`/api/email-verification?email=${email}`);
        const validationResponse = await response.json() as EmailVerification;
        setvalidationResult(validationResponse);
    }

    return (
        <div>
            <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <button onClick={onSubmit}>Validate</button>
            {validationResult && (<div>
                <p>{validationResult.result}</p>
            </div>)}
        </div>
    )
}