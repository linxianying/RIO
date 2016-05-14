from django.conf.urls import url
from . import views

urlpatterns = [
    # urls that go to the home page
    url(r'^$', views.display_home_page, name = "home"),

    # urls that go to the sign_up_page
    url(r'^sign_up', views.display_sign_up_page, name = "sign_up"),

    # urls for the forms submitting
    url(r'^handle_submission', views.handle_submission, name = "handle_submission"),
]
