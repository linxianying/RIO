from __future__ import unicode_literals
from django.db import models
from home import models as home_models
# Create your models here.


class Comment(models.Model):
    post_time = models.DateTimeField()
    commenter = models.ForeignKey(home_models.User)
