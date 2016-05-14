from django.shortcuts import render
from django.http import HttpResponse

# for sending verification using e-mail
from django.core.mail import EmailMessage

import models


def display_home_page(request):
    return render(request, "home/home_page.html")


def display_sign_up_page(request):
    return render(request, "home/sign_up_page.html")


new_user = models.User()


def handle_submission(request):
    post_result_dic = request.POST

    if post_result_dic.__contains__("username"):
        new_user.set_username(post_result_dic["username"])
        if post_result_dic.__contains__("email_address"):
            new_user.set_email_address(post_result_dic["email_address"])

            # send verification code
            verification_code = "why fucking cannot send"
            verification_email = EmailMessage("verification code", verification_code, "obitoonepatchman@gmail.com", [post_result_dic["email_address"]])
            # verification_email.send(fail_silently = False)

    if post_result_dic.__contains__("password"):
        new_user.set_password(post_result_dic["password_confirm"])
        # new_user.save()

    return HttpResponse()
