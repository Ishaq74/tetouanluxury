import { defineMiddleware } from 'astro:middleware';
import { auth } from '@auth/index';

const protectedRoutes = {
  admin: /^\/admin/,
  portal: /^\/portal/,
  operations: /^\/operations/,
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Check if route needs protection
  const needsAuth = Object.values(protectedRoutes).some(pattern => 
    pattern.test(pathname)
  );

  if (needsAuth) {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: context.request.headers,
    });

    if (!session) {
      // Redirect to login if no session
      return context.redirect('/login?redirect=' + encodeURIComponent(pathname));
    }

    // Check role-based access
    const user = session.user;
    
    if (protectedRoutes.admin.test(pathname) && user.role !== 'admin') {
      return context.redirect('/unauthorized');
    }
    
    if (protectedRoutes.operations.test(pathname) && user.role !== 'staff' && user.role !== 'admin') {
      return context.redirect('/unauthorized');
    }

    // Attach user to context
    context.locals.user = user;
    context.locals.session = session;
  }

  return next();
});
