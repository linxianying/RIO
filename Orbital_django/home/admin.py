from django.contrib import admin
import models


class UserModelAdmin(admin.ModelAdmin):
    list_display = ["nickname", "email_address", "level", "is_member", "id"]
    list_filter = ["level", "is_member", "id"]
    search_fields = ["nickname", "email_address", "id"]


admin.site.register(models.User, UserModelAdmin)
