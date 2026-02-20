from django.contrib import admin
from .models import Debtor, Debt


@admin.register(Debtor)
class DebtorAdmin(admin.ModelAdmin):
    list_display = ("id", "last_name", "first_name", "middle_name", "phone", "owner")
    search_fields = ("last_name", "first_name", "phone")
    list_filter = ("owner",)
    ordering = ("last_name",)


@admin.register(Debt)
class DebtAdmin(admin.ModelAdmin):
    list_display = ("id", "debtor", "amount", "is_paid", "created_at")
    search_fields = ("debtor__last_name", "debtor__first_name", "description")
    list_filter = ("is_paid", "created_at")
    ordering = ("-created_at",)
