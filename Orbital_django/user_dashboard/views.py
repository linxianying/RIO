from django.shortcuts import render
from django.contrib.auth import logout, get_user
from django.shortcuts import redirect
from file_viewer import models


def handle_log_out(request):
    logout(request)
    return redirect("home")


def handle_file_upload(request):
    user = get_user(request)  # get the current user who is logged in and sends this request

    document = models.Document()  # create a empty Document instance
    document.owner = user  # set the owner
    document.file_field = request.FILES["file_upload"]  # set the file_field

    document.save()  # save this document to the database

    user.document_set.add(document)  # add this document to the user's document_set
    return redirect("user_dashboard")


def handle_delete(request):
    document = models.Document.objects.get(id=int(request.POST["document_id"]))
    document.delete()
    return redirect("user_dashboard")


def display_user_dashboard(request):
    current_user = get_user(request)
    return render(request, "user_dashboard/user_dashboard_page.html", {"current_user": current_user})
