from nova_admin.utils import get_nova_admin_settings

def nova_admin_context(request):
    """
    Context processor to inject Nova Admin configuration settings into all templates.
    """
    return {
        "nova_settings": get_nova_admin_settings()
    }
