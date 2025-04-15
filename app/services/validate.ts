export async function validate(email: string) { 
  const errors: { email?: string } = {};  
      if (!email) {
          errors.email = "Email is required.";
      } else if (!email.includes("@")) {
        errors.email = "Please enter a valid email";
            }
        return errors;
      }