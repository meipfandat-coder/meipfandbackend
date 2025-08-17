import { ErrorResponse } from "./errorResponse.js";

export function validateData(data: any, fields: string[]) {
  const missingFields: string[] = [];
    
  fields.forEach((field) => {
    if (data[field] === undefined || data[field] === null) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
   throw new ErrorResponse(403, `These fields are required: ${missingFields.join(", ")}`)
  }

  return {
    success: true,
    message: "Data is valid",
  };
}
