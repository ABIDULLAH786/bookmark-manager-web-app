import { signIn } from "next-auth/react"
import { Button } from "../ui/button"

function LoginWithGoogleButton() {
    return (
        <Button
            onClick={() => signIn("google")}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-border hover:bg-accent hover:text-accent-foreground"
        >
            <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
            >
                <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.72 1.23 9.23 3.25l6.85-6.85C35.54 2.95 30.15.5 24 .5 14.83.5 7.06 5.86 3.33 13.34l7.98 6.2C12.7 13.39 17.89 9.5 24 9.5z"
                />
                <path
                    fill="#34A853"
                    d="M46.5 24.5c0-1.63-.15-3.19-.43-4.69H24v9.09h12.68c-.55 2.96-2.2 5.47-4.65 7.18l7.14 5.53C43.9 37.5 46.5 31.44 46.5 24.5z"
                />
                <path
                    fill="#FBBC05"
                    d="M10.23 28.54a14.48 14.48 0 0 1-.75-4.54c0-1.58.27-3.1.75-4.54l-7.98-6.2A23.927 23.927 0 0 0 0 24c0 3.88.93 7.55 2.58 10.78l7.65-6.24z"
                />
                <path
                    fill="#4285F4"
                    d="M24 47.5c6.15 0 11.34-2.03 15.11-5.52l-7.14-5.53c-1.99 1.34-4.55 2.12-7.97 2.12-6.11 0-11.3-3.89-13.69-9.43l-7.65 6.24C7.06 42.14 14.83 47.5 24 47.5z"
                />
            </svg>
            Continue with Google
        </Button>
    )
}

export default LoginWithGoogleButton