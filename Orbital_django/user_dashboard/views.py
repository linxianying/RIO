from django.shortcuts import render
from django.contrib.auth import logout, get_user
from django.shortcuts import redirect
from file_viewer import models
from django.http import HttpResponse
import re
import os
import Orbital_django.settings as settings


def handle_log_out(request):
    logout(request)
    return redirect("home")


def handle_file_upload(request):
    user = get_user(request)  # get the current user who is logged in and sends this request

    document = models.Document()  # create a empty Document instance

    document.owner = user  # set the owner
    document.file_field = request.FILES["file_upload"]  # set the file_field
    document.title = request.POST["title"]  # set the title

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


def change_portrait(request):
    if request.method == "GET":
        return render(request, "user_dashboard/change_portrait_page.html")

    elif request.method == "POST":
        user = get_user(request)

        # delete the local image file for the old portrait
        if user.portrait and hasattr(user.portrait, 'name'):
            previous_portrait = user.portrait
            img_location = previous_portrait.name
            print img_location
            previous_portrait.storage.delete(img_location)

        # store and set the new portrait
        portrait_dataurl = request.POST["portrait_dataurl"]

        # if the folder to store this user's portrait does exist, create it
        portrait_dir_path = os.path.join(settings.MEDIA_ROOT, "portrait", user.email_address)
        if not os.path.isdir(portrait_dir_path):
                os.mkdir(portrait_dir_path)

        portrait_png_file_path = os.path.join(portrait_dir_path, "portrait.png")
        
        # create the png file to be user's portrait and write data (portrait_dataurl) into it
        imgstr = re.search(r'base64,(.*)', portrait_dataurl).group(1)
        portrait_png_file = open(portrait_png_file_path, 'wb')
        portrait_png_file.write(imgstr.decode('base64'))
        portrait_png_file.close()

        # use the path relative to "media" folder to assign ImageField
        user.portrait = '{0}/{1}/{2}'.format("portrait", user.email_address, "portrait.png")

        user.save()  

        return HttpResponse()  # ajax will make the user go back his/her user dashboard
