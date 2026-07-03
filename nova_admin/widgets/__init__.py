# -*- coding: utf-8 -*-
"""
Nova Admin Custom Widgets
-------------------------
Custom form widgets styled with Tailwind CSS and Alpine.js.
"""
from django.forms import widgets

class NovaAdminTextInput(widgets.TextInput):
    """
    Custom TextInput styled for Nova Admin.
    """
    def __init__(self, attrs=None):
        default_attrs = {
            "class": "w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
        }
        if attrs:
            default_attrs.update(attrs)
        super().__init__(default_attrs)


class NovaAdminPasswordInput(widgets.PasswordInput):
    """
    Custom PasswordInput styled for Nova Admin.
    """
    def __init__(self, attrs=None, render_value=False):
        default_attrs = {
            "class": "w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
        }
        if attrs:
            default_attrs.update(attrs)
        super().__init__(default_attrs, render_value)
