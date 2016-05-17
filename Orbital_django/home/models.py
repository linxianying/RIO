from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser


class User(AbstractBaseUser):
    nickname = models.CharField(max_length=254)
    email_address = models.EmailField(max_length=254)
    # pass fields inherited from super class
    level = models.IntegerField(default=0)
    is_member = models.BooleanField(default=False)

    # the following fields and methods (*) are required our extended User class
    # so that it can use the same UserManager and other service just as the built in User class
    USERNAME_FIELD = "email_address"  # (*)
    # get_username will return this field
    # also, this is the unique identification of a user
    REQUIRED_FIELDS = ["nickname", "email_address", "password"]  # (*)
    is_active = True  # (*)
    # temporarily just make it True,
    # in the future may use how long this user has not logged in
    # to decide whether this account is active or not

    def get_full_name(self):  # (*)
        return self.nickname + "<" + self.email_address + ">" + "level:" + str(self.level) + " member:" + str(self.is_member)

    def get_short_name(self):  # (*)
        return self.nickname

    def set_username(self, nickname):
        self.nickname = nickname

    def set_email_address(self, email_address):
        self.email_address = email_address

    # set_password method inherited from super class

    def __str__(self):
        return self.get_full_name()


    # the following are required when i use admin to see the data. at present, i do not know why they are needed and their mechanism
    def is_superuser(self):
        return True
    def is_staff(self):
        return True

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True
