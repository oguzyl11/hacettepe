export type ActionState = {
  ok: boolean;
  message: string;
};

export const emptyActionState: ActionState = { ok: false, message: "" };
