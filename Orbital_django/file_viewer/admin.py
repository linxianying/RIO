from django.contrib import admin
import models


class FileModelAdmin(admin.ModelAdmin):
    list_display = ["owner", "file_field", "id"]
    list_filter = ["owner", "file_field", "id"]
    search_fields = ["owner", "file_field", "id"]

admin.site.register(models.Document, FileModelAdmin)
admin.site.register(models.Comment)
