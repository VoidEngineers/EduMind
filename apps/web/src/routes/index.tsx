import AdminApp from '@/components/Admin-App/AdminApp';
import AdminSignin from '@/components/Admin-Signin/AdminSignin';
import LearningStylePredictor from '@/components/Learning-style-predictor/LearningStylePredictor';
import UserSignin from '@/components/User-Signin/UserSignin';
import EngagementPredictor from '@/components/engagement-predictor/EngagementPredictor';
import { Navbar } from '@/components/landing/Navbar';
import XAIPrediction from '@/components/xai_predictor/XAIPredictor';
import Docs from '@/pages/Docs';
import EngagementOverview from '@/pages/EngagementOverview';
import Landing from '@/pages/Landing';
import LearningStyleOverview from '@/pages/LearningStyleOverview';
import Pricing from '@/pages/Pricing';
import XAIRiskOverview from '@/pages/XAIRiskOverview';
import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

// Create a root route
const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
            {/* <TanStackRouterDevtools /> */}
        </>
    ),
});

// Define independent routes
const landingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Landing,
});

const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: () => (
        <>
            <Navbar />
            <AdminApp />
        </>
    ),
});

const adminSigninRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin-signin',
    component: AdminSignin,
});

const userSigninRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/user-signin',
    component: UserSignin,
});

const engagementRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/engagement',
    component: () => (
        <>
            <Navbar />
            <EngagementPredictor />
        </>
    ),
});

const learningStyleRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/learning-style',
    component: () => (
        <>
            <Navbar />
            <LearningStylePredictor />
        </>
    ),
});

const lmsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/lms',
    component: () => (
        <>
            <Navbar />
        </>
    ),
});

const analyticsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/analytics',
    component: () => (
        <>
            <Navbar />
            <XAIPrediction />
        </>
    ),
});

const xaiRiskOverviewRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/xai-risk-overview',
    component: XAIRiskOverview,
});

const engagementOverviewRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/engagement-overview',
    component: EngagementOverview,
});

const learningStyleOverviewRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/learning-style-overview',
    component: LearningStyleOverview,
});

const pricingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/pricing',
    component: Pricing,
});

const docsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/docs',
    component: Docs,
});

// Generate route tree
const routeTree = rootRoute.addChildren([
    landingRoute,
    adminRoute,
    adminSigninRoute,
    userSigninRoute,
    engagementRoute,
    learningStyleRoute,
    lmsRoute,
    analyticsRoute,
    xaiRiskOverviewRoute,
    engagementOverviewRoute,
    learningStyleOverviewRoute,
    pricingRoute,
    docsRoute,
]);

// Create router
export const router = createRouter({ routeTree });

// Register router ensuring type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
