from django.shortcuts import render
from django.http import HttpResponse

# for sending verification using e-mail
from django.core.mail import EmailMessage

# for log in verification
from django.contrib.auth import authenticate, login

from django.shortcuts import redirect

import models
import random


def display_home_page(request):
    return render(request, "home/home_page.html")


def display_sign_up_page(request):
    return render(request, "home/sign_up_page.html")


def handle_log_in(request):
    input_email_address = request.POST['email_address']
    input_password = request.POST['password']
    user = authenticate(input_username = input_email_address, input_password = input_password) # need to rewrite authenticate because this default authenticate use the User in AUTHENTICATION AND AUTHORIZATION rathen than in HOME
    if user is not None:
        if user.is_active:
            login(request, user)
            return redirect("user_dashboard")
        else:
            return HttpResponse("<h1>your account is not active</h1>")
    else:
        return HttpResponse("<h1>email address or password is wrong</h1>")


new_user = models.User()


def handle_sign_up(request):
    post_result_dic = request.POST

    if post_result_dic.__contains__("username"):
        new_user.set_username(post_result_dic["username"])
        if post_result_dic.__contains__("email_address"):
            new_user.set_email_address(post_result_dic["email_address"])

            # send verification code by email
            verification_code = random.randint(0, 99999)
            verification_code_str = str(verification_code).zfill(5)
            verification_email = EmailMessage("verification code", verification_code_str, "obitoonepatchman@gmail.com", [post_result_dic["email_address"]])
            verification_email.send(fail_silently = False)

    if post_result_dic.__contains__("password"):
        new_user.set_password(post_result_dic["password_confirm"])
        new_user.save()

    return HttpResponse()
