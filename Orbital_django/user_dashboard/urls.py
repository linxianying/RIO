from django.conf.urls import url
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^$', views.display_user_dashboard, name="user_dashboard"),

    url(r'^handle_log_out', views.handle_log_out, name="log_out"),

    url(r'^handle_file_upload', views.handle_file_upload, name="file_upload"),

    url(r'^handle_delete', views.handle_delete, name="delete_document"),
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
