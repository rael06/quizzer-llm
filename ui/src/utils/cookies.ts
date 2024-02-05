export function clearAllCookies(): void {
  const cookies: string[] = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie: string = cookies[i]!;
    const eqPos: number = cookie.indexOf("=");
    const name: string = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}
