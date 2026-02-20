from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Debtor(models.Model):
    last_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="debtors")

    def __str__(self):
        return f"{self.last_name} {self.first_name} {self.middle_name or ''}".strip()


class Debt(models.Model):
    debtor = models.ForeignKey(Debtor, on_delete=models.CASCADE, related_name="debts")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # автоизменение статуса при сохранении
        if self.amount == 0:
            self.is_paid = True
        else:
            self.is_paid = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.debtor} — {self.amount} сом"
