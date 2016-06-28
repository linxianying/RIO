from django.contrib import admin
from models import Coterie


class CoterieModelAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "description"]
    list_filter = ["id", "name", "administrators", "members", "applicants"]
    search_fields = ["id", "name", "administrators", "members", "applicants"]
    filter_horizontal = ["administrators", "members", "applicants"]


admin.site.register(Coterie, CoterieModelAdmin)