from django.apps import AppConfig


class NovaAdminConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "nova_admin"
    verbose_name = "Nova Admin Theme"

    def ready(self):
        """
        Perform any initialization tasks here, such as registering signals,
        verifying settings, or preparing dynamic navigation configurations.
        """
        pass
