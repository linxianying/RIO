from django.contrib import admin
import models

class FileModelAdmin(admin.ModelAdmin):
    list_display = ["owner", "file", "id"]
    list_filter = ["owner", "file", "id"]
    search_fields = ["owner", "file", "id"]

admin.site.register(models.File, FileModelAdmin)
admin.site.register(models.Comment)
