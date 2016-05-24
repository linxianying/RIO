from django.shortcuts import render, redirect
import os
import zipfile
from wand.image import Image
import models
from django.contrib.auth import get_user
from django.http import HttpResponse


def display_file_viewer_page(request):

    if request.method == "POST":
        document = models.Document.objects.get(id=int(request.POST["document_id"]))
        comment = models.Comment()
        comment.content = request.POST["comment_content"]
        comment.commenter = get_user(request)
        comment.document_this_comment_belongs = document
        comment.save()
        document.comment_set.add(comment)

        return redirect("user_dashboard")
        # return HttpResponse()

    else:
        # zip file
        document = models.Document.objects.get(id = int(request.GET["document_id"]))

        file_position = document.file_field.storage.path(document.file_field)
        file_url = document.file_field.url

        file_dirname, file_name_and_extension = os.path.split(file_position)
        file_name, extension = file_name_and_extension.split(".")
        img_folder_path = os.path.join(file_dirname, file_name)

        pages = []

        if extension == "zip":
            zip_file = zipfile.ZipFile(file_position, "r")
            zip_alphabatical_list = sorted(zip_file.namelist())

            if os.path.isdir(img_folder_path) == False:
                os.mkdir(img_folder_path)
                i = 0
                for file in zip_alphabatical_list:
                    zip_file.extract(file, img_folder_path)
                    os.rename(os.path.join(img_folder_path, zip_alphabatical_list[i]), os.path.join(img_folder_path, str(i) + '.jpeg'))
                    pages.extend([os.path.dirname(file_url)[1:] + "/" + file_name + "/" + str(i) + ".jpeg"])
                    i += 1
            else:
                i = 0
                for file in zip_alphabatical_list:
                    pages.extend([os.path.dirname(file_url)[1:] + "/" + file_name + "/" + str(i) + ".jpeg"])
                    i += 1

        elif extension == "pdf":
            if os.path.isdir(img_folder_path) == False:
                os.mkdir(img_folder_path)
                document_images = Image(filename = file_position, resolution = 240)
                for i, page in enumerate(document_images.sequence):
                    with Image(page) as page_image:
                        page_image.alpha_channel = False
                        page_image.save(filename = os.path.join(img_folder_path, str(i) + ".png"))
                        pages.extend([os.path.dirname(file_url)[1:] + "/" + file_name + "/" + str(i) + ".png"])
            else:
                document_images = Image(filename=file_position, resolution=180)
                for i, page in enumerate(document_images.sequence):
                    pages.extend([os.path.dirname(file_url)[1:] + "/" + file_name + "/" + str(i) + ".png"])

        context = {
            "document": document,
            "pages": pages
        }

        return render(request, "file_viewer/file_viewer_page.html", context)
