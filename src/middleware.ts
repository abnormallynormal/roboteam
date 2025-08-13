import { auth } from "../auth";

export default auth((req:any) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  const publicRoutes = ["/login", "/"];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  if (isLoggedIn && nextUrl.pathname === "/login") {
    const homeUrl = new URL("/", nextUrl.origin);
    return Response.redirect(homeUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
