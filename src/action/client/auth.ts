import { signIn, signOut } from "next-auth/react";

export async function doLogout() {
    await signOut({ redirect: true, callbackUrl: "/" });
}

export async function doCredentialLogin(loginData: { username: string; password: string }) {
    console.log(loginData);
    const response = await signIn("credentials", {
        username: loginData.username,
        password: loginData.password,
        redirect: false,
    });
    console.log(response);
    if (response?.error) {
        throw new Error(response.error);
    }

    return response;
}
