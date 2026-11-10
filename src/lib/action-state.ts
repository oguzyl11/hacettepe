export type ActionResult = {
  success: boolean;
  message: string;
  data?: unknown;
};

export type ActionState = ActionResult;

export const emptyActionState: ActionState = { success: false, message: "" };
