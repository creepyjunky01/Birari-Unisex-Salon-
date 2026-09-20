export type RegistrationInput = {
  name: string;
  mobile: string;
  dob?: string;
  serviceId: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: Partial<Record<keyof RegistrationInput, string>>;
};

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export function validateRegistration(input: RegistrationInput): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  const name = input.name?.trim() ?? "";
  if (!name) {
    errors.name = "Please enter your full name.";
  } else if (name.length < 2) {
    errors.name = "Name looks too short.";
  } else if (name.length > 80) {
    errors.name = "Name is too long.";
  }

  const mobile = (input.mobile ?? "").replace(/\D/g, "");
  if (!mobile) {
    errors.mobile = "Please enter your mobile number.";
  } else if (!INDIAN_MOBILE_REGEX.test(mobile)) {
    errors.mobile = "Enter a valid 10-digit mobile number.";
  }

  if (input.dob) {
    const dobDate = new Date(input.dob);
    const today = new Date();
    if (Number.isNaN(dobDate.getTime())) {
      errors.dob = "Enter a valid date.";
    } else if (dobDate > today) {
      errors.dob = "Date of birth cannot be in the future.";
    }
  }

  if (!input.serviceId) {
    errors.serviceId = "Please select a service.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function normalizeMobile(mobile: string): string {
  return mobile.replace(/\D/g, "");
}
