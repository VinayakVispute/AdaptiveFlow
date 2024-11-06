import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Make sure that the `/api/webhooks/(.*)` route is not protected here
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/Profile(.*)",
  "/api/webhooks(.*)",
  "/Technology(.*)",
  "/How-It-Works(.*)",
  "/Portfolio(.*)",
  "/Github(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
