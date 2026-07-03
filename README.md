# Nova Admin

A modern, responsive, and customizable Django Admin theme built with Tailwind CSS.

Nova Admin enhances the default Django Admin with a clean user interface, responsive layout, dark mode, customizable branding, and modern dashboard components while remaining fully compatible with Django's admin framework.

---

## Features

- Modern responsive UI
- Dark & Light mode
- Responsive sidebar
- Dashboard widgets
- Command Palette (Ctrl + K)
- Beautiful forms and tables
- Customizable branding
- Offline support (No CDN required)
- Reusable Django package
- Django 4.2+ compatible

---

## Installation

Install directly from GitHub:

```bash
pip install git+https://github.com/anandcharukesan/nova-admin.git
```

---

## Configuration

### 1. Register the application

Add **nova_admin** before **django.contrib.admin**.

```python
INSTALLED_APPS = [
    "nova_admin",
    "django.contrib.admin",

    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]
```

---

### 2. Add the context processor

```python
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "nova_admin.context_processors.nova_admin_context",
            ],
        },
    },
]
```

---

### 3. Add the middleware

```python
MIDDLEWARE = [
    ...
    "nova_admin.middleware.NovaAdminThemeMiddleware",
]
```

---

### 4. Optional Theme Configuration

```python
NOVA_ADMIN = {
    "SITE_TITLE": "My Project",
    "SITE_HEADER": "Administration",
    "LOGO": "",
    "PRIMARY_COLOR": "#2563EB",

    "SIDEBAR_COLLAPSED": False,
    "DARK_MODE": True,
    "SHOW_RECENT_ACTIONS": True,
    "SHOW_BREADCRUMBS": True,
    "SHOW_GLOBAL_SEARCH": True,
}
```

---

## Django Setup

Apply migrations:

```bash
python manage.py migrate
```

Create an administrator:

```bash
python manage.py createsuperuser
```

If your project uses collected static files:

```bash
python manage.py collectstatic
```

Run the development server:

```bash
python manage.py runserver
```

Visit:

```
http://127.0.0.1:8000/admin/
```

---

## Updating

Upgrade to the latest version:

```bash
pip install --upgrade git+https://github.com/anandcharukesan/nova-admin.git
```

---

## Development

Clone the repository:

```bash
git clone https://github.com/anandcharukesan/nova-admin.git
```

Install the package in editable mode:

```bash
pip install -e .
```

If frontend assets are modified, rebuild them:

```bash
npm install
npm run build
```


## Uninstallation

To remove Nova Admin from your project:

### 1. Uninstall the package

```bash
pip uninstall django-nova-admin
```

### 2. Remove it from `INSTALLED_APPS`

Delete or comment out:

```python
"nova_admin",
```

### 3. Remove the context processor

Remove:

```python
"nova_admin.context_processors.nova_admin_context",
```

from the `TEMPLATES` configuration.

### 4. Remove the middleware

Remove:

```python
"nova_admin.middleware.NovaAdminThemeMiddleware",
```

from the `MIDDLEWARE` list.

### 5. Restart the Django server

```bash
python manage.py runserver
```

Your project will now use the default Django Admin interface.
---

## Compatibility

- Python 3.10+
- Django 4.2+
- Django 5.x

---

## License

Licensed under the Apache License 2.0.