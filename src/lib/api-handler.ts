import { NextResponse } from "next/server";

type ApiHandlerCallback = (req: Request, ...args: any[]) => Promise<NextResponse>;

export function apiHandler(handler: ApiHandlerCallback) {
  return async (req: Request, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (err: any) {
      console.error("Global Error Handler:", err);

      // 1. Handle Mongoose Validation Errors
      if (err.name === "ValidationError") {
        const formattedErrors: Record<string, string> = {};
            let errorMessage=""

        for (const key in err.errors) {
          const error = err.errors[key];

          // --- LOGIC TO CLEAN UP MESSAGES ---
          
          // Capitalize the field name (e.g., "username" -> "Username")
          const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
          // Customize based on error type
          if (error.kind === "required") {
            formattedErrors[key] = `${fieldName} is required`;
            errorMessage = `${fieldName} is required`;
          } else if (error.kind === "minlength") {
            formattedErrors[key] = `${fieldName} is too short`;
            errorMessage = `${fieldName} is too short`;

          } else if (error.kind === "maxlength") {
            formattedErrors[key] = `${fieldName} is too long`;
            errorMessage = `${fieldName} is too long`;

          } else {
            // Fallback to the original message if it's a custom validator
            formattedErrors[key] = error.message.replace("Path ", "").replace(/`/g, ""); 
            errorMessage = error.message.replace("Path ", "").replace(/`/g, "");

          }
        }

        return NextResponse.json(
          { 
            success: false, 
            message: "Validation failed", 
            errors: { ...formattedErrors, detail: errorMessage }, 
          },
          { status: 400 }
        );
      }

      // 2. Handle Duplicate Key Error (e.g., Email already taken)
      if (err.code === 11000) {
        // Extract the field name (e.g., "email")
        const field = Object.keys(err.keyValue)[0];
        const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1);
        
        return NextResponse.json(
          { 
            success: false, 
            message: `${fieldLabel} already exists`,
            errors: { [field]: `${fieldLabel} is already taken.` }
          },
          { status: 409 }
        );
      }

      // 3. Generic Error
      return NextResponse.json(
        { 
          success: false, 
          message: err.message || "Internal Server Error" ,
          error:err
        },
        { status: 500 }
      );
    }
  };
}