from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.display_file_viewer_page, name = "file_viewer"),
]
