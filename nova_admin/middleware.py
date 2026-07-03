import django
from django.utils.deprecation import MiddlewareMixin

class NovaAdminThemeMiddleware(MiddlewareMixin):
    """
    Middleware to inject custom configurations, dark mode user preferences,
    and system status into Django requests.
    """
    def process_request(self, request):
        # We can read theme from cookies or session
        theme_cookie = request.COOKIES.get("nova_admin_theme", "auto")
        request.nova_admin_theme = theme_cookie
        
        # System status data can be dynamic or mock-initialized here
        request.nova_admin_status = {
            "version": "1.0.0",
            "django_version": django.get_version(),
            "status": "healthy"
        }
        return None
