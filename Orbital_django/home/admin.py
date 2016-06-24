from django.contrib import admin
import models


class UserModelAdmin(admin.ModelAdmin):
    list_display = ["nickname", "email_address", "level", "is_superuser", "is_staff", "id"]
    list_filter = ["level", "is_superuser", "is_staff", "id"]
    search_fields = ["nickname", "email_address", "id"]
    filter_horizontal = ('groups', 'user_permissions', 'following_users')

admin.site.register(models.User, UserModelAdmin)
