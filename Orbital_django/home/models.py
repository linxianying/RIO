from __future__ import unicode_literals
from django.db import models


# Create your models here.


class User(models.Model):
    username = models.CharField(max_length=254)
    email_address = models.EmailField(max_length=254)
    password = models.TextField()

    def set_username(self, username):
        self.username = username

    def set_email_address(self, email_address):
        self.email_address = email_address

    def set_password(self, password):
        self.password = password


