from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.home, name="home"),
    url(r'^home', views.home, name="home"),
    url(r'^sign_up$', views.sign_up, name = "sign_up"),
]