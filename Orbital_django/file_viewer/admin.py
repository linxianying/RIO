from django.contrib import admin
import models


class FileModelAdmin(admin.ModelAdmin):
    list_display = ["title", "file_field", "owner", "id"]
    list_filter = ["title", "file_field", "owner", "id"]
    search_fields = ["title", "file_field", "owner", "id"]

class CommentModelAdmin(admin.ModelAdmin):
    list_display = ["content", "document_this_comment_belongs", "commenter", "num_like", "id"]
    list_filter = ["content", "document_this_comment_belongs", "commenter", "num_like", "id"]
    search_fields = ["content", "document_this_comment_belongs", "commenter", "num_like", "id"]

admin.site.register(models.Document, FileModelAdmin)
admin.site.register(models.Comment, CommentModelAdmin)
