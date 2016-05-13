from __future__ import unicode_literals
from django.db import models
# Create your models here.


class User(models.Model):
    username = models.CharField(max_length = 254)
    email = models.EmailField(max_length = 254)
    password = models.TextField()
