from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.


def file_viewer(request):
    return render(request, "file_viewer/file_viewer_page.html")

