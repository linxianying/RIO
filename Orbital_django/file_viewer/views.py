from django.shortcuts import render
import os
import zipfile
from unrar import rarfile
from wand.image import Image
import models
from django.contrib.auth import get_user
from django.http import HttpResponse


def display_file_viewer_page(request):

    if request.method == "POST":
        if request.POST["operation"] == "like":
            comment = models.Comment.objects.get(id=int(request.POST["comment_id"]))
            comment.num_like += 1
            comment.save()
            return HttpResponse()

        elif request.POST["operation"] == "refresh":
            document = models.Document.objects.get(id=int(request.POST["document_id"]))

            context = {
                "document": document,
                "comments": document.comment_set.order_by("-post_time"),
            }

            return render(request, "file_viewer/comment_viewer_page.html", context)

        else:
            document = models.Document.objects.get(id=int(request.POST["document_id"]))
            comment = models.Comment()
            comment.content = request.POST["comment_content"]
            comment.commenter = get_user(request)
            comment.document_this_comment_belongs = document
            comment.save()
            document.comment_set.add(comment)

            context = {
                "document": document,
                "comments": document.comment_set.order_by("-post_time"),
            }

            return render(request, "file_viewer/comment_viewer_page.html", context)

    else:
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

            if not os.path.isdir(img_folder_path):
                os.mkdir(img_folder_path)
                i = 0
                for page_name in zip_alphabatical_list:
                    zip_file.extract(page_name, img_folder_path)
                    os.rename(os.path.join(img_folder_path, page_name),
                              os.path.join(img_folder_path, str(i) + "." + page_name.split(".")[-1]))
                    pages.extend([os.path.dirname(file_url)[1:] + "/" + file_name + "/" + str(i) + "." + page_name.split(".")[-1]])
                    i += 1
            else:
                i = 0
                for page_name in zip_alphabatical_list:
                    pages.extend([os.path.dirname(file_url)[1:] + "/" + file_name + "/" + str(i) + "." + page_name.split(".")[-1]])
                    i += 1

        elif extension == "rar":
            rar_file = rarfile.RarFile(file_position, "r")
            rar_alphabatical_list = sorted(rar_file.namelist())

            if not os.path.isdir(img_folder_path):
                os.mkdir(img_folder_path)
                i = 0
                for page_name in rar_alphabatical_list:
                    rar_file.extract(page_name, img_folder_path)
                    os.rename(os.path.join(img_folder_path, page_name),
                              os.path.join(img_folder_path, str(i) + "." + page_name.split(".")[-1]))
                    pages.extend([os.path.dirname(file_url)[1:] + "/" + file_name + "/" + str(i) + "." + page_name.split(".")[-1]])
                    i += 1
            else:
                i = 0
                for page_name in rar_alphabatical_list:
                    pages.extend([os.path.dirname(file_url)[1:] + "/" + file_name + "/" + str(i) + "." + page_name.split(".")[-1]])
                    i += 1

        elif extension == "pdf":
            if not os.path.isdir(img_folder_path):
                os.mkdir(img_folder_path)
                document_images = Image(filename=file_position, resolution=240)
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
            "pages": pages,
            "comments": document.comment_set.order_by("-post_time")
        }

        return render(request, "file_viewer/file_viewer_page.html", context)
