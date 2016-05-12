from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def sign_up(request):
    return render(request, "sign_up/sign_up_page.html")

