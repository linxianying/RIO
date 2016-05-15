from __future__ import unicode_literals
from django.db import models
from home import models as home_models


class File(models.Model):
    file = models.FileField()
    owner = models.ForeignKey(home_models.User)
    num_of_pages = models.IntegerField()


class Comment(models.Model):
    post_time = models.DateTimeField()
    commenter = models.ForeignKey(home_models.User)
    file_this_comment_belongs = models.ForeignKey(File)
    left_up_position = models.FloatField()
    right_bottom_position = models.FloatField()
