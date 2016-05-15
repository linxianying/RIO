from django.shortcuts import render
from django.http import HttpResponse


def display_file_viewer_page(request):
    return render(request, "file_viewer/file_viewer_page.html")

