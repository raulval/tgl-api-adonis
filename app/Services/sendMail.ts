import Mail from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";

export async function sendConfirmMail(
  user: User,
  template: string
): Promise<void> {
  await Mail.send((message) => {
    message
      .from("tgl@email.com")
      .to(user.email)
      .subject("Confirmation instructions for TGL account")
      .htmlView(template, { user });
  });
}

export async function sendResetMail(
  user: User,
  template: string
): Promise<void> {
  await Mail.send((message) => {
    message
      .from("tgl@email.com")
      .to(user.email)
      .subject("Reset your TGL account password")
      .htmlView(template, { user });
  });
}
