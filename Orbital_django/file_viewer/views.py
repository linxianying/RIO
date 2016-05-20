from django.shortcuts import render
import models
import os
import zipfile


def display_file_viewer_page(request):
    # zip file
    document = models.Document.objects.get(id = int(request.POST["document_id"]))

    file_position = document.file_field.storage.path(document.file_field)
    file_url = document.file_field.url

    zip_file = zipfile.ZipFile(file_position, "r")
    zip_alphabatical_list = sorted(zip_file.namelist())

    file_dirname, file_name_and_extension = os.path.split(file_position)

    file_name, extension = file_name_and_extension.split(".")

    img_folder_path = os.path.join(file_dirname, file_name)

    pages = []
    if os.path.isdir(img_folder_path) == False:
        os.mkdir(img_folder_path)
        i = 0
        for file in zip_alphabatical_list:
            zip_file.extract(file, img_folder_path)
            os.rename(os.path.join(img_folder_path, zip_alphabatical_list[i]), os.path.join(img_folder_path, str(i) + '.jpeg'))
            pages.extend([os.path.dirname(file_url)[1:] + "/" + file_name + "/" + str(i) + ".jpeg"])
            i = i + 1
    else:
        i = 0
        for file in zip_alphabatical_list:
            pages.extend([os.path.dirname(file_url)[1:] + "/" + file_name + "/" + str(i) + ".jpeg"])
            i = i + 1


    context = {
        "pages": pages
    }

    return render(request, "file_viewer/file_viewer_page.html", context)
