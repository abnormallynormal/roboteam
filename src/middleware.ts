import { auth } from "../auth";
import { headers } from 'next/headers';

export default auth(async (req: any) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  const publicRoutes = ["/login", "/access-denied", "/easteregg"];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  if (isLoggedIn && nextUrl.pathname === "/login") {
    const homeUrl = new URL("/", nextUrl.origin);
    return Response.redirect(homeUrl);
  }

  // RBAC check
  if (isLoggedIn && !isPublicRoute) {
    try {
      const response = await fetch(`${nextUrl.origin}/api/rbac`, {
        headers: {
          'Authorization': `Bearer ${session.token}`,
        },
      });
      
      if (!response.ok) {
        // If user doesn't have permission, redirect to home
        const homeUrl = new URL("/", nextUrl.origin);
        return Response.redirect(homeUrl);
      }

      const userData = await response.json();
      const userRole = userData.role || 'user'; // default to 'user' if no role specified
      
      const routeAccessData = {
        "user": ['/login', "/signoutform", "/"],

        "exec": ['/login', "/budgeting", "/attendance", "/inventory", "/signoutsheet", "/", "/signoutform"],
        "admin": ['/login', "/budgeting", "/attendance", "/inventory", "/signoutsheet", "/forms", "/", "/partsorders", "/signoutform"]
      };

      const allowedRoutes = routeAccessData[userRole as keyof typeof routeAccessData] || [];
      if (!allowedRoutes.includes(nextUrl.pathname)) {
        // If route is not allowed for user's role, redirect to access denied page
        const accessDeniedUrl = new URL("/access-denied", nextUrl.origin);
        return Response.redirect(accessDeniedUrl);
      }
    } catch (error) {
      console.error('RBAC check failed:', error);
      // On error, redirect to access denied page
      const accessDeniedUrl = new URL("/access-denied", nextUrl.origin);
      return Response.redirect(accessDeniedUrl);
    }
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
