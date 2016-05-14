from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.


def display_file_viewer_page(request):
    return render(request, "file_viewer/file_viewer_page.html")

