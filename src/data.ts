import { CodeFile, DjangoApp, SimulatedRecord } from './types';

export const ADMIN_USER = {
  username: 'admin',
  fullName: 'Nova Administrator',
  email: 'admin@novatheme.io',
  initials: 'AD'
};

export const DJANGO_APPS: DjangoApp[] = [
  {
    name: 'Authentication and Authorization',
    appLabel: 'auth',
    models: [
      { id: 'user', name: 'Users', appLabel: 'auth', recordsCount: 1248, iconName: 'users' },
      { id: 'group', name: 'Groups', appLabel: 'auth', recordsCount: 14, iconName: 'shield' }
    ]
  },
  {
    name: 'Business Operations',
    appLabel: 'sales',
    models: [
      { id: 'order', name: 'Orders', appLabel: 'sales', recordsCount: 562, iconName: 'shopping-bag' },
      { id: 'product', name: 'Products', appLabel: 'sales', recordsCount: 94, iconName: 'box' },
      { id: 'customer', name: 'Customers', appLabel: 'sales', recordsCount: 420, iconName: 'user-check' }
    ]
  },
  {
    name: 'Content Management',
    appLabel: 'cms',
    models: [
      { id: 'article', name: 'Articles', appLabel: 'cms', recordsCount: 180, iconName: 'file-text' },
      { id: 'category', name: 'Categories', appLabel: 'cms', recordsCount: 12, iconName: 'tag' }
    ]
  }
];

export const RECENT_ACTIONS = [
  { id: 1, action: 'Modified database parameters', objectRepr: 'Sarah Connor', type: 'change', model: 'User', time: '12 mins ago', author: 'admin' },
  { id: 2, action: 'Added record', objectRepr: 'Standard Staff Group', type: 'add', model: 'Group', time: '1 hour ago', author: 'admin' },
  { id: 3, action: 'Deleted record', objectRepr: 'Draft Marketing Post', type: 'delete', model: 'Article', time: '3 hours ago', author: 'admin' },
  { id: 4, action: 'Modified database parameters', objectRepr: 'Apple MacBook Pro M3', type: 'change', model: 'Product', time: '5 hours ago', author: 'editor' },
  { id: 5, action: 'Added record', objectRepr: 'Order #3842 - Paid', type: 'add', model: 'Order', time: '1 day ago', author: 'admin' }
];

export const SIMULATED_RECORDS: SimulatedRecord[] = [
  { id: 1, name: 'Sarah Connor', status: 'Active', category: 'Staff', updatedAt: '2026-07-02 14:32', author: 'admin', email: 'sarah@resistance.net', role: 'Operations Manager' },
  { id: 2, name: 'John Connor', status: 'Pending', category: 'Staff', updatedAt: '2026-07-02 12:15', author: 'admin', email: 'john.c@cyberdyne.org', role: 'Lead Architect' },
  { id: 3, name: 'Ellen Ripley', status: 'Active', category: 'Admin', updatedAt: '2026-07-01 18:45', author: 'admin', email: 'ripley@weyland-yutani.corp', role: 'Security Director' },
  { id: 4, name: 'Marcus Wright', status: 'Completed', category: 'Guest', updatedAt: '2026-06-30 09:12', author: 'editor', email: 'marcus@project-angel.io', role: 'Beta Reviewer' },
  { id: 5, name: 'Peter Parker', status: 'Draft', category: 'Staff', updatedAt: '2026-06-29 11:24', author: 'editor', email: 'peter.parker@bugle.com', role: 'Freelance Photographer' },
  { id: 6, name: 'Bruce Wayne', status: 'Inactive', category: 'VIP', updatedAt: '2026-06-28 22:50', author: 'admin', email: 'bwayne@wayne-enterprises.com', role: 'Primary Investor' },
  { id: 7, name: 'Tony Stark', status: 'Blocked', category: 'VIP', updatedAt: '2026-06-27 10:05', author: 'admin', email: 'tony@starkindustries.com', role: 'Technology Consultant' },
  { id: 8, name: 'Clark Kent', status: 'Active', category: 'Staff', updatedAt: '2026-06-26 15:40', author: 'editor', email: 'ckent@dailyplanet.com', role: 'Senior Journalist' },
  { id: 9, name: 'Selina Kyle', status: 'Pending', category: 'Guest', updatedAt: '2026-06-25 23:18', author: 'admin', email: 'selina@gotham-cats.org', role: 'Acquisition Expert' },
  { id: 10, name: 'Diana Prince', status: 'Active', category: 'Admin', updatedAt: '2026-06-24 08:30', author: 'admin', email: 'diana@themyscira.gov', role: 'Cultural Curator' }
];

export const CODE_FILES: CodeFile[] = [
  {
    path: 'nova_admin/__init__.py',
    label: 'Initializer',
    language: 'python',
    content: `# -*- coding: utf-8 -*-
"""
Nova Admin
----------
A premium, highly-polished, responsive Django admin theme package built with Tailwind CSS,
Alpine.js, and modern UX guidelines.

Version: 1.0.0
License: Apache-2.0
"""

__version__ = "1.0.0"
__author__ = "Nova Admin Team"`
  },
  {
    path: 'nova_admin/apps.py',
    label: 'AppConfig',
    language: 'python',
    content: `from django.apps import AppConfig


class NovaAdminConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "nova_admin"
    verbose_name = "Nova Admin Theme"

    def ready(self):
        """
        Perform any initialization tasks here, such as registering signals,
        verifying settings, or preparing dynamic navigation configurations.
        """
        pass`
  },
  {
    path: 'nova_admin/middleware.py',
    label: 'Middleware',
    language: 'python',
    content: `import django
from django.utils.deprecation import MiddlewareMixin

class NovaAdminThemeMiddleware(MiddlewareMixin):
    """
    Middleware to inject custom configurations, dark mode user preferences,
    and system status into Django requests.
    """
    def process_request(self, request):
        theme_cookie = request.COOKIES.get("nova_admin_theme", "auto")
        request.nova_admin_theme = theme_cookie
        
        request.nova_admin_status = {
            "version": "1.0.0",
            "django_version": django.get_version(),
            "status": "healthy"
        }
        return None`
  },
  {
    path: 'nova_admin/templatetags/nova_admin_tags.py',
    label: 'Template Tags',
    language: 'python',
    content: `import json
from django import template
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter(name="nova_initials")
def nova_initials(user):
    if not user:
        return "AD"
    first = getattr(user, "first_name", "")
    last = getattr(user, "last_name", "")
    if first and last:
        return f"{first[0]}{last[0]}".upper()
    username = getattr(user, "username", "")
    if username:
        return username[:2].upper()
    return "US"


@register.filter(name="nova_badge_class")
def nova_badge_class(value):
    val_str = str(value).lower().strip()
    success_states = ["active", "completed", "success", "true", "yes", "paid", "published", "online"]
    warning_states = ["pending", "warning", "draft", "inactive", "hold", "delayed"]
    danger_states = ["danger", "failed", "error", "false", "no", "cancelled", "blocked", "offline"]
    
    if val_str in success_states:
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 border border-emerald-200"
    elif val_str in warning_states:
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 border border-amber-200"
    elif val_str in danger_states:
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 border border-rose-200"
    else:
        return "bg-slate-50 text-slate-700 dark:bg-slate-800/50 border border-slate-200"


@register.simple_tag(takes_context=True)
def nova_active_class(context, app_label, model_name=None):
    request = context.get("request")
    if not request:
        return ""
    path = request.path
    if model_name:
        target_sub = f"/{app_label}/{model_name}/"
        if target_sub in path:
            return "bg-blue-50 text-blue-600 dark:bg-blue-950/40 font-medium border-l-4 border-blue-600"
    else:
        target_sub = f"/{app_label}/"
        if target_sub in path:
            return "bg-slate-50 text-slate-900 dark:bg-slate-800/40 border-l-4 border-slate-600"
    return "text-slate-600 dark:text-slate-400 hover:bg-slate-50 border-l-4 border-transparent"`
  },
  {
    path: 'nova_admin/templates/admin/base.html',
    label: 'base.html (Main Layout)',
    language: 'html',
    content: `{% load i18n static nova_admin_tags %}
<!DOCTYPE html>
<html lang="{{ LANGUAGE_CODE|default:"en-us" }}" class="h-full">
<head>
  <meta charset="UTF-8" />
  <title>{% block title %}{% endblock %}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <link rel="stylesheet" href="{% static 'nova_admin/css/theme.css' %}" />
  <script src="{% static 'nova_admin/js/theme.js' %}"></script>
  {% block extrahead %}{% endblock %}
</head>
<body class="h-full text-slate-800 dark:text-slate-100 antialiased" x-data="{ sidebarCollapsed: false }">
  <div class="min-h-screen flex bg-slate-50 dark:bg-slate-900">
    <!-- Collapsible Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-white dark:bg-slate-900" :class="sidebarCollapsed ? 'w-20' : 'w-72'">
      <div class="h-16 flex items-center justify-between px-5 border-b">
        <h1 class="text-sm font-bold">Nova Admin</h1>
        <button @click="sidebarCollapsed = !sidebarCollapsed">Collapse</button>
      </div>
      <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <!-- Navigation Nodes -->
      </nav>
    </aside>
    <!-- Page Content Container -->
    <div class="flex-1 flex flex-col" :class="sidebarCollapsed ? 'pl-20' : 'pl-72'">
      <header class="sticky top-0 z-30 h-16 border-b bg-white dark:bg-slate-900/80 backdrop-blur">
        <!-- Top Navigation Controls -->
      </header>
      <main class="flex-1 p-8">
        {% block content %}{% endblock %}
      </main>
    </div>
  </div>
</body>
</html>`
  },
  {
    path: 'nova_admin/templates/admin/index.html',
    label: 'index.html (Dashboard)',
    language: 'html',
    content: `{% extends "admin/base.html" %}
{% block content %}
<div class="grid grid-cols-1 md:grid-cols-4 gap-5">
  <!-- Interactive Bento Grid Stat Cards -->
  <div class="nova-card p-5 bg-white dark:bg-slate-900">
    <p class="text-xs font-semibold text-slate-400">ACTIVE USERS</p>
    <h3 class="text-2xl font-bold text-slate-900 dark:text-white mt-1">1,248</h3>
  </div>
</div>
<!-- Graphs and Timelines -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
  <div class="nova-card p-5 lg:col-span-2">
    <h3 class="text-xs font-bold uppercase tracking-wider">System Activity</h3>
  </div>
  <div class="nova-card p-5">
    <h3 class="text-xs font-bold uppercase tracking-wider">Audit logs</h3>
  </div>
</div>
{% endblock %}`
  },
  {
    path: 'nova_admin/static/nova_admin/css/theme.css',
    label: 'theme.css (Variables)',
    language: 'css',
    content: `:root {
  --color-primary: #2563eb;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-bg: #f8fafc;
  --color-card: #ffffff;
  --color-text: #0f172a;
  --color-border: #e2e8f0;
  --radius-custom: 16px;
}

.dark {
  --color-bg: #0f172a;
  --color-card: #1e293b;
  --color-text: #f8fafc;
  --color-border: #334155;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Inter', sans-serif;
  transition: background-color 0.3s, color 0.3s;
}

.nova-card {
  border-radius: var(--radius-custom);
  box-shadow: 0 4px 20px -2px rgba(15,23,42,0.04);
}`
  }
];
