# MF Designs Architecture & Changelog Log

This document serves as a persistent record of the core architectural decisions, fixes, and structure of the MF Designs Vanya Clone project to aid future developers or agents.

## Architectural Principles (Ponytail Rules)
- **Minimalism**: Deletion over addition. We removed redundant files (like `AdminPanel2.jsx`) and utilized the existing `AdminRouteGuard` for Role-Based Access Control (RBAC).
- **Single Source of Truth**: The `apiClient.js` uses a single `import.meta.env.VITE_API_URL` to route all API calls. There are no local proxy configurations in `vite.config.js` for production.
- **Robust Error Handling**: Components gracefully handle network failures (e.g., Render Free Tier sleeping) by displaying explicit "Error Loading Storefront" boundaries instead of crashing to a blank white screen.

## Recent Fixes & Changes (Sept 2026)

### 1. Fixed Vercel Blank Screen Crash (React Error 310)
- **Issue**: The site showed a blank white screen in production. This was traced to a React Hooks violation (`Error 310`) in `HeroSlider.jsx`.
- **Cause**: An early return (for the loading skeleton) was placed *before* the `useCallback` and `useEffect` hooks. React forbids changing the number of hooks rendered based on conditionals.
- **Fix**: Moved the early return below all hook definitions in `HeroSlider.jsx`.

### 2. Resolved Axios Network Errors in Production
- **Issue**: The frontend was encountering `AxiosError: Network Error`. 
- **Fixes applied**:
  - Removed all hardcoded `localhost:5000` URLs across the application.
  - Simplified `apiClient.js` to strictly use the absolute Render URL in production.
  - Correctly configured `server.js` with `cors()` to accept `https://mf-collections.vercel.app` with `credentials: true`.
  - Added a GitHub Action `.github/workflows/ping-render.yml` to ping the backend every 10 minutes to prevent Render's Free Tier from putting the API to sleep.

### 3. Consolidated Admin Portals
- **Issue**: There were two separate admin panels (`AdminPanel2.jsx` and the main Admin Dashboard).
- **Fix**: Deleted `AdminPanel2.jsx`. The existing `AdminRouteGuard.jsx` handles restricted access (e.g., "upload_only" roles) and redirects them securely without needing a separate duplicate panel.

## Admin Roles & Credentials

**1. Full Superadmin (Access to Everything)**
- **Email**: `admin@mfdesigns.com`
- **Password**: `Admin@MF2024secure`

**2. Product Uploader (Restricted Access)**
- **Email**: `upload@mfdesigns.com`
- **Password**: `Upload@MF2024`
- **Permissions**: Can only access `/admin/products`.

## Deployment
- **Frontend**: Hosted on Vercel. Continuous deployment from the `main` branch.
- **Backend**: Hosted on Render Free Tier. Uses Cloudflare proxying.
