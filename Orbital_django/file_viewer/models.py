from __future__ import unicode_literals
from django.db import models
from home import models as home_models


class File(models.Model):
    file = models.FileField()
    owner = models.ForeignKey(home_models.User)


class Comment(models.Model):
    post_time = models.DateTimeField(auto_now=False, auto_now_add=True)
    commenter = models.ForeignKey(home_models.User)
    file_this_comment_belongs = models.ForeignKey(File)
    left_up_position_x = models.FloatField()
    left_up_position_y = models.FloatField()
    right_bottom_position_x = models.FloatField()
    right_bottom_position_y = models.FloatField()
