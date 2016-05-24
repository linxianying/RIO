from django.contrib import admin
import models


class FileModelAdmin(admin.ModelAdmin):
    list_display = ["file_field", "owner", "id"]
    list_filter = ["file_field", "owner", "id"]
    search_fields = ["file_field", "owner", "id"]

class CommentModelAdmin(admin.ModelAdmin):
    list_display = ["content", "document_this_comment_belongs", "commenter", "id"]
    list_filter = ["content", "document_this_comment_belongs", "commenter", "id"]
    search_fields = ["content", "document_this_comment_belongs", "commenter", "id"]

admin.site.register(models.Document, FileModelAdmin)
admin.site.register(models.Comment, CommentModelAdmin)
