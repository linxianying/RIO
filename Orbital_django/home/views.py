from django.shortcuts import render
from django.http import HttpResponse
import models


# Create your views here.


def display_home_page(request):
    return render(request, "home/home_page.html")


def display_sign_up_page(request):
    return render(request, "home/sign_up_page.html")


def handle_submission(request):
    post_result_dic = request.POST

    if post_result_dic.__contains__("username"):
        new_user = models.User()
        new_user.set_username(post_result_dic["username"])
        if post_result_dic.__contains__("email_address"):
            new_user.set_email_address(post_result_dic["email_address"])

    if post_result_dic.__contains__("password"):
        new_user.set_password(post_result_dic["password_confirm"])
        new_user.save()

    print new_user.username
    print new_user.email_address
    print new_user.password
    return HttpResponse()
