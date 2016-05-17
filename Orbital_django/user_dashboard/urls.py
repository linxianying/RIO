from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'^$', views.display_user_dashboard, name="user_dashboard"),

    url(r'^handle_log_out', views.handle_log_out, name="log_out"),
]
