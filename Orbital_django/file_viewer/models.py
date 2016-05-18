from __future__ import unicode_literals
from django.db import models
from home import models as home_models


def upload_to(instance, filename):
    name_without_extension, extension = filename.split(".")
    return '{0}/{1}/{2}'.format(instance.owner.email_address, extension, filename)


class File(models.Model):
    file_field = models.FileField(upload_to = upload_to)
    owner = models.ForeignKey(home_models.User)  # many File to one User


class Comment(models.Model):
    post_time = models.DateTimeField(auto_now=False, auto_now_add=True)
    commenter = models.ForeignKey(home_models.User)  # many Comment to one User
    file_this_comment_belongs = models.ForeignKey(File)
    left_up_position_x = models.FloatField()
    left_up_position_y = models.FloatField()
    right_bottom_position_x = models.FloatField()
    right_bottom_position_y = models.FloatField()
