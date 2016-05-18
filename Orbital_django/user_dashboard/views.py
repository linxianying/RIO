from django.shortcuts import render
from django.contrib.auth import logout, get_user
from django.shortcuts import redirect
from file_viewer import models


def handle_log_out(request):
    logout(request)
    return redirect("home")


def handle_file_upload(request):
    user = get_user(request)

    file_instance = models.File()
    file_instance.owner = user
    file_instance.file_field = request.FILES["file_upload"]

    file_instance.save()

    user.file_set.add(file_instance)
    return redirect("user_dashboard")


def display_user_dashboard(request):
    current_user = get_user(request)
    return render(request, "user_dashboard/user_dashboard_page.html", {"current_user": current_user})
