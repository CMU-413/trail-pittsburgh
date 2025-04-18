// src/utils/googleAuth.ts
export async function getGoogleUserData(accessToken: string) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    const data = await response.json();
    return data;
}
