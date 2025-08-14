import { auth } from "../auth";
import { headers } from 'next/headers';

export default auth(async (req: any) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const userEmail = session?.user?.email;
  console.log(userEmail)
  // Update the public routes to include both pages
  const publicRoutes = ["/login", "/access-denied", "/unauthorized", "/easteregg"];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  // RBAC check - moved before login redirect
  if (isLoggedIn && !isPublicRoute) {
    try {
      const response = await fetch(`${nextUrl.origin}/api/rbac`, {
        headers: {
          'X-User-Email': userEmail || '',
        },
      });
      
      if (!response.ok) {
        const accessDeniedUrl = new URL("/unauthorized", nextUrl.origin);
        return Response.redirect(accessDeniedUrl);
      }

      const userData = await response.json();
      const userRole = userData.role || 'public';
      

      const routeAccessData = {
        "user": ['/login', "/signoutform", "/"],
        "exec": ['/login', "/budgeting", "/attendance", "/inventory", "/signoutsheet", "/", "/signoutform"],
        "admin": ['/login', "/budgeting", "/attendance", "/inventory", "/signoutsheet", "/forms", "/", "/partsorders", "/signoutform"]
      };

      const allowedRoutes = routeAccessData[userRole as keyof typeof routeAccessData] || [];
      if (!allowedRoutes.includes(nextUrl.pathname)) {
        const accessDeniedUrl = new URL("/access-denied", nextUrl.origin);
        return Response.redirect(accessDeniedUrl);
      }
    } catch (error) {
      console.error('RBAC check failed:', error);
      const accessDeniedUrl = new URL("/access-denied", nextUrl.origin);
      return Response.redirect(accessDeniedUrl);
    }
  }

  // Login page redirect after RBAC check
  if (isLoggedIn && nextUrl.pathname === "/login") {
    const homeUrl = new URL("/", nextUrl.origin);
    return Response.redirect(homeUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
