from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.


def home(request):
    return render(request, "home/home_page.html")


def sign_up(request):
    return render(request, "home/sign_up_page.html")


def get_username_and_email(request):
    return


def get_verification_code(request):
    return


def get_password(request):
    return
