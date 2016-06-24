from django.contrib import admin
import models


class DocumentModelAdmin(admin.ModelAdmin):
    list_display = ["title", "unique_file", "owner", "id"]
    list_filter = ["title", "unique_file", "owner", "id"]
    search_fields = ["title", "unique_file", "owner", "id"]
    filter_horizontal = ['collectors']


class UniqueFileModelAdmin(admin.ModelAdmin):
    list_display = ["file_field", "md5", "id"]
    list_filter = ["file_field", "md5", "id"]
    search_fields = ["file_field", "md5", "id"]


class CommentModelAdmin(admin.ModelAdmin):
    list_display = ["content", "document_this_comment_belongs", "commenter", "num_like", "id"]
    list_filter = ["content", "document_this_comment_belongs", "commenter", "num_like", "id"]
    search_fields = ["content", "document_this_comment_belongs", "commenter", "num_like", "id"]


class AnnotationModelAdmin(admin.ModelAdmin):
    list_display = ["content", "document_this_annotation_belongs", "annotator", "num_like", "id"]
    list_filter = ["content", "document_this_annotation_belongs", "annotator", "num_like", "id"]
    search_fields = ["content", "document_this_annotation_belongs", "annotator", "num_like", "id"]

admin.site.register(models.Document, DocumentModelAdmin)
admin.site.register(models.UniqueFile, UniqueFileModelAdmin)
admin.site.register(models.Comment, CommentModelAdmin)
admin.site.register(models.Annotation, AnnotationModelAdmin)