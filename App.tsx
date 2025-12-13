
import React, { Suspense } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, createMemoryHistory } from '@tanstack/react-router';
import { HelmetProvider } from 'react-helmet-async';
import { MainLayout } from './design/layouts/MainLayout';
import ScrollToTop from './components/ScrollToTop';
import { HomePage, VillasPage, VillaDetailsPage, BookingPage, GuidePage, ServicesPage, ReviewsPage, ContactPage, FAQPage } from './pages/Public';
import { BlogPage } from './pages/blog/BlogPage';
import { LoginPage } from './pages/Login';
import { LanguageProvider } from './LanguageContext';
import { ToastProvider } from './ToastContext';
import { UserProvider } from './auth/UserContext';
import { DataProvider } from './DataContext';
import { AdminSkeleton, PortalSkeleton, OperationsSkeleton } from './components/Skeletons';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy Load Admin and Operations
const AdminPageLazy = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.AdminPage })));
const OperationsPageLazy = React.lazy(() => import('./pages/Operations').then(module => ({ default: module.OperationsPage })));
const PortalPageLazy = React.lazy(() => import('./pages/Portal').then(module => ({ default: module.PortalPage })));

// Route Wrapper Components with Specific Skeletons
const AdminRoute = () => (
    <Suspense fallback={<AdminSkeleton />}>
        <AdminPageLazy />
    </Suspense>
);

const OperationsRoute = () => (
    <Suspense fallback={<OperationsSkeleton />}>
        <OperationsPageLazy />
    </Suspense>
);

const PortalRoute = () => (
    <Suspense fallback={<PortalSkeleton />}>
        <PortalPageLazy />
    </Suspense>
);

// Root Route Component
const RootComponent = () => {
    return (
        <MainLayout>
            <ScrollToTop />
            <Outlet />
        </MainLayout>
    );
};

// Create Route Tree
const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const villasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/villas',
  component: VillasPage,
});

const villaDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/villas/$id',
  component: VillaDetailsPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking',
  component: BookingPage,
});

// Blog Routes
const blogIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/journal',
  component: BlogPage,
});

const blogCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/journal/$category',
  component: BlogPage,
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/journal/$category/$slug',
  component: BlogPage,
});

const guideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/guide',
  component: GuidePage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: ServicesPage,
});

const reviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reviews',
  component: ReviewsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FAQPage,
});

// Private Routes
const portalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portal',
  component: PortalRoute,
});

const operationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/operations',
  component: OperationsRoute,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminRoute,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  villasRoute,
  villaDetailsRoute,
  bookingRoute,
  blogIndexRoute,
  blogCategoryRoute,
  blogPostRoute,
  guideRoute,
  servicesRoute,
  reviewsRoute,
  contactRoute,
  faqRoute,
  portalRoute,
  operationsRoute,
  adminRoute
]);

// Use memory history to avoid issues with blob/iframe environments
const memoryHistory = createMemoryHistory({
  initialEntries: ['/'],
});

const router = createRouter({ 
  routeTree, 
  defaultPreload: 'intent',
  history: memoryHistory
});

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ToastProvider>
            <DataProvider>
            <LanguageProvider>
                <UserProvider>
                    <RouterProvider router={router} />
                </UserProvider>
            </LanguageProvider>
            </DataProvider>
        </ToastProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;
