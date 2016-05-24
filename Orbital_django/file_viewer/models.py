from __future__ import unicode_literals
from django.db import models
from home import models as home_models
from django.dispatch import receiver
import os
import shutil


def upload_to(instance, filename):
    name_without_extension, extension = filename.split(".")
    # if a user with sign-in email = user@email.com uploads file name.jpeg
    # the file will be store at media/user@email.com/jpeg/name.jpeg
    return '{0}/{1}/{2}'.format(instance.owner.email_address, extension, filename)


class Document(models.Model):
    file_field = models.FileField(upload_to = upload_to)
    owner = models.ForeignKey(home_models.User)  # many File to one User

    def __str__(self):
        return self.file_field.name


# before the Model.delete() and QuerySet.delete() are called, this method will execute first
@receiver(models.signals.pre_delete, sender = Document)
# "sender" and "**kwargs" are required though they are of no use here, do not delete them
def delete_local_file(sender, instance, **kwargs):
    # get the location of the file to be deleted.
    # eg: 845426589@qq.com/jpg/1.jpg
    file_location = instance.file_field.name

    file_local_location = instance.file_field.storage.path(instance.file_field)
    file_local_dirname, file_name_and_extension = os.path.split(file_local_location)
    file_name, extension = file_name_and_extension.split(".")
    associated_folder_local_location = os.path.join(file_local_dirname, file_name)
    type_level_dir_name = os.path.dirname(file_local_location)

    # instance.file_field.storage will return an instance of Storage' subclass,
    # which handle the file store and delete and other operations
    # use its delete method to delete the local file
    # associated with the corresponding file_field of the model to be deleted
    instance.file_field.storage.delete(file_location)

    # delete associate image folder
    if os.path.isdir(associated_folder_local_location):
        shutil.rmtree(associated_folder_local_location)

    # if the type-level folder such as folder named "doc" or "pdf" is empty
    # that is, if the user does not have documents of this type
    # then delete this type_level folder
    if os.path.isdir(type_level_dir_name) and os.listdir(type_level_dir_name).__len__() == 0:
        user_level_dir_name = os.path.dirname(type_level_dir_name)
        os.rmdir(type_level_dir_name)
        # if the user-level folder is empty
        # that is, if the user does not have any documents
        # then delete this user_level folder
        if os.path.isdir(user_level_dir_name) and os.listdir(user_level_dir_name).__len__() == 0:
            os.rmdir(user_level_dir_name)


class Comment(models.Model):
    post_time = models.DateTimeField(auto_now=False, auto_now_add=True)
    commenter = models.ForeignKey(home_models.User)  # many Comment to one User
    document_this_comment_belongs = models.ForeignKey(Document)
    content = models.TextField()

    def __str__(self):
        return self.content
