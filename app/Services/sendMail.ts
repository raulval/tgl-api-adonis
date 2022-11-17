import Mail from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";

export async function sendConfirmMail(
  user: User,
  template: string
): Promise<void> {
  await Mail.send((message) => {
    message
      .from("tcl@email.com")
      .to(user.email)
      .subject("Confirmation instructions for TCL account")
      .htmlView(template, { user });
  });
}

export async function sendResetMail(
  user: User,
  template: string
): Promise<void> {
  await Mail.send((message) => {
    message
      .from("tcl@email.com")
      .to(user.email)
      .subject("Reset your TCL account password")
      .htmlView(template, { user });
  });
}
