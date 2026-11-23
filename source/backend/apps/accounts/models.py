from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        REQUESTER = "REQUESTER", "Requester"
        SUPPORT_AGENT = "SUPPORT_AGENT", "Support Agent"
        MANAGER = "MANAGER", "Manager"
        ADMIN = "ADMIN", "Admin"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.REQUESTER,
    )

    def __str__(self):
        return f"{self.username} ({self.role})"