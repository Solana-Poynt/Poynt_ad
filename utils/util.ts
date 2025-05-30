//CHECK IF VALUES ARE EITHER EMPTY, NULL OR UNDEFINED
export const areValuesEmpty = (obj: any) => {
  return Object.values(obj).some(
    (value) => value === "" || value === null || value === undefined
  );
};

//VALIDATE INPUTS
export const validateRegistration = (
  email: string,
  password: string | undefined,
  confirmPassword: string | undefined
) => {
  // Email validation using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  let message = "";

  // Check email if provided
  if (email !== undefined && isEmailValid === false) {
    return (message = "Email is invalid");
  }

  // Check password and confirm password only if both are provided
  if (password !== undefined) {
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasSmallLetter = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isPasswordValid =
      hasCapitalLetter && hasSmallLetter && hasNumber && password.length > 6;

    if (isPasswordValid === false) {
      return (message =
        "Password must have capital & small letters with numbers & at least 7 characters");
    }
  }

  if (confirmPassword !== undefined) {
    const isConfirmPasswordValid = password === confirmPassword;

    if (isConfirmPasswordValid === false) {
      return (message = "Passwords don't match");
    }
  }

  return true;
};
//FUNCTION TO REMOVE EMPTY VALUES AND KEYS FROM DATA
export const removeEmptyStrings = (obj: any) => {
  // Create a new object to store non-empty values
  const newObj: any = {};

  for (const key in obj) {
    const value = obj[key];

    if (value !== "" && value !== null && value !== undefined) {
      newObj[key] = value;
    }
  }

  return newObj;
};

//VALIDATE TWITTER URL
export const validateTwitterUrl = (
  url: string,
  subtaskType: string
): { isValid: boolean; error: string | null } => {
  // Return early if URL is empty
  if (!url || url.trim() === "") {
    return {
      isValid: false,
      error: "Please enter a URL",
    };
  }

  // Basic URL validation - must start with https and contain only x.com
  try {
    const urlObj = new URL(url);

    // Check if it's https
    if (urlObj.protocol !== "https:") {
      return {
        isValid: false,
        error: "URL must use HTTPS",
      };
    }

    // Check if it's an X domain (only x.com, no twitter.com)
    if (urlObj.hostname !== "x.com") {
      return {
        isValid: false,
        error: "URL must be from X (x.com only)",
      };
    }

    // Task-specific validation
    if (subtaskType === "follow") {
      // For follow tasks, the URL should be a profile URL
      // Format: https://x.com/username
      const isProfileUrl = /^https:\/\/x\.com\/[a-zA-Z0-9_]{1,15}$/.test(url);

      if (!isProfileUrl) {
        return {
          isValid: false,
          error:
            "Please provide a valid X profile URL (e.g., https://x.com/username)",
        };
      }
    } else if (["like", "retweet", "comment"].includes(subtaskType)) {
      // For engagement tasks, the URL should be a tweet URL
      // Format: https://x.com/username/status/numeric_id
      const isTweetUrl =
        /^https:\/\/x\.com\/[a-zA-Z0-9_]{1,15}\/status\/\d+$/.test(url);

      if (!isTweetUrl) {
        return {
          isValid: false,
          error:
            "Please provide a valid X post URL (e.g., https://x.com/username/status/123456789)",
        };
      }
    }

    return {
      isValid: true,
      error: null,
    };
  } catch (error) {
    // URL parsing failed
    return {
      isValid: false,
      error: "Invalid URL format",
    };
  }
};

export const validateAllTaskUrls = (
  tasks: { [key: string]: string },
  selectedSubtasks: { [key: string]: string }
): { isValid: boolean; errors: { [key: string]: string | null } } => {
  const errors: { [key: string]: string | null } = {};
  let isValid = true;

  // Validate each task URL
  for (const [taskKey, url] of Object.entries(tasks)) {
    // Skip empty values in initial validation (they'll be caught by required fields check)
    if (!url || url.trim() === "") continue;

    // Get the selected subtask for this task type
    const subtaskType = selectedSubtasks[taskKey] || "";

    // Validate URL
    const validation = validateTwitterUrl(url, subtaskType);

    if (!validation.isValid) {
      errors[taskKey] = validation.error;
      isValid = false;
    }
  }

  // Check if any required tasks are missing
  for (const taskKey of Object.keys(selectedSubtasks)) {
    if (!tasks[taskKey] || tasks[taskKey].trim() === "") {
      errors[taskKey] = "This task is required";
      isValid = false;
    }
  }

  return {
    isValid,
    errors,
  };
};
