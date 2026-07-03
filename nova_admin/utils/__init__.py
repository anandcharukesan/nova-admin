from django.conf import settings

DEFAULT_SETTINGS = {
    "SITE_TITLE": "Nova Admin",
    "SITE_HEADER": "Nova Admin",
    "LOGO": "",
    "PRIMARY_COLOR": "#2563EB",
    "SIDEBAR_COLLAPSED": False,
    "DARK_MODE": True,
    "SHOW_RECENT_ACTIONS": True,
    "SHOW_BREADCRUMBS": True,
    "SHOW_GLOBAL_SEARCH": True,
}

def get_nova_admin_settings():
    """
    Get merged settings for Nova Admin, combining defaults with settings.NOVA_ADMIN.
    """
    user_settings = getattr(settings, "NOVA_ADMIN", {})
    merged = DEFAULT_SETTINGS.copy()
    if isinstance(user_settings, dict):
        merged.update(user_settings)
    return merged
