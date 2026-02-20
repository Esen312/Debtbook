from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Какие поля показываем в списке пользователей
    list_display = ('id', 'email', 'username', 'last_name', 'shop_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'shop_name')

    # Какие поля можно редактировать внутри записи
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'shop_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Для формы создания нового пользователя
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'shop_name', 'is_staff', 'is_active')}
        ),
    )

    search_fields = ('email', 'username', 'shop_name')
    ordering = ('id',)
