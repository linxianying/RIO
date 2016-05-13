from django.conf.urls import url
from . import views

urlpatterns = [
    # urls that go to the home page
    url(r'^$', views.home, name = "home"),
    url(r'^home', views.home, name = "home"),

    #urls that go to the sign_up_page
    url(r'^sign_up', views.sign_up, name = "sign_up"),

    #urls for the forms submitting
    url(r'^get_username_and_email', views.get_username_and_email, name = "get_username_and_email"),
    url(r'^get_verification_code', views.get_verification_code, name="get_verification_code"),
    url(r'^get_password', views.get_password, name="get_password"),

]