import { defineMiddleware } from 'astro:middleware';
import { auth } from '@auth/index';
import { t } from '@lib/translations';

const protectedRoutes = {
  admin: /^\/admin/,
  portal: /^\/portal/,
  operations: /^\/operations/,
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, searchParams } = context.url;

  // Détection de la langue par l'URL ou fallback navigateur
  let lang = 'fr';
  const urlParts = pathname.split('/');
  if (['fr', 'en', 'es', 'ar'].includes(urlParts[1])) {
    lang = urlParts[1];
  } else if (context.request.headers.get('accept-language')) {
    const accept = context.request.headers.get('accept-language')!;
    if (accept.startsWith('en')) lang = 'en';
    else if (accept.startsWith('es')) lang = 'es';
    else if (accept.startsWith('ar')) lang = 'ar';
  }
  context.locals.lang = lang;
  context.locals.t = (key: string) => t(key, lang);

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
    context.locals.session = session.session;
  }

  return next();
});
