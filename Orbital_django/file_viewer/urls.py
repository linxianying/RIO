from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.file_viewer, name = "file_viewer"),
]
