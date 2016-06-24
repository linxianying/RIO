from __future__ import unicode_literals
from django.db import models
from home.models import User
from file_viewer.models import Document


# class Album(models.Model):
#     name = models.CharField(max_length=128)
#     owner = models.ForeignKey(User)
#     members = models.ManyToManyField(User, related_name="joined_album_set", blank=True)
#     applicants = models.ManyToManyField(User, related_name="applied_album_set", blank=True)
#     publicity = models.BooleanField()
#     documents = models.ManyToManyField(Document, related_name="belong_album_set", blank=True)
