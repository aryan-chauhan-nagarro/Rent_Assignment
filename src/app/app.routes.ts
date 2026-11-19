/**
 * Application routing configuration.
 * Maps URL paths to lazy-loaded components, applying guards and resolvers where necessary.
 */
import { Routes } from '@angular/router';
import { guestGuard } from './guards/guest-guard';
import { authGuard } from './guards/auth-guard';
import { listingResolver } from './resolvers/listing-resolver';

export const routes: Routes = [
  // Home page: lists rental properties with search, filtering, and pagination
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  // Login page: accessible only to unauthenticated visitors
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  // Registration page: accessible only to unauthenticated visitors
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  // Create post: accessible only to authenticated users
  {
    path: 'create',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/create-post/create-post').then((m) => m.CreatePost),
  },
  // Edit post: accessible only to authenticated users
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/create-post/create-post').then((m) => m.CreatePost),
  },
  // Inquiries dashboard: view sent and received inquiries
  {
    path: 'inquiries',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/inquiries/inquiries').then((m) => m.Inquiries),
  },
  // Listing details: resolves listing data by ID before activating the component
  {
    path: 'listing/:id',
    resolve: { listing: listingResolver },
    loadComponent: () => import('./pages/details/details').then((m) => m.Details),
  },
  // Wildcard fallback: redirects unknown routes to the home page
  { path: '**', redirectTo: '' },
];
