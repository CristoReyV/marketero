/**
 * Supabase Client — Rotero Ecommerce Demo
 * Inicialización del cliente público para lectura de catálogo
 * e inserción de solicitudes de cotización.
 */
const SUPABASE_URL = 'https://cgdtzozbgniayecyxlvt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZHR6b3piZ25pYXllY3l4bHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDYxMTgsImV4cCI6MjA4OTg4MjExOH0.TX9VsFUW02yw1ruaO6gVyO42w5LbgiAFbLYg81Iw4is';

// The CDN exposes window.supabase with a .createClient method
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
