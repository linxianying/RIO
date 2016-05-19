from django.shortcuts import render
import models


def display_file_viewer_page(request):
    # pic = models.File.objects.get(id=2)
    # print pic.file.url[1:]
    context = {
        "pages": [
            # pic.file.url[1:],
            "media/public_domain/rar/case_closed/1.jpg",
            "media/public_domain/rar/case_closed/2.jpg",
            "media/public_domain/rar/case_closed/3.jpg",
        ]
    }

    return render(request, "file_viewer/file_viewer_page.html", context)
