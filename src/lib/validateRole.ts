import { ErrorResponse } from "./errorResponse.js";

export const allRoles = ["admin", "donor", "collector"];
const allowRegisterRoles = ["donor", "collector"];

export function validateRole(role: string) {
  if (!allowRegisterRoles.includes(role)) {
   throw new ErrorResponse(
    403,
    `${role} is not allow to register`
  );
}
 
  return {
    success: true,
    message: "Data is valid",
  };
}
