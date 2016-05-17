from django.contrib.auth.hashers import check_password
from models import User


class CustomedBackend(object):

    def authenticate(self, input_username, input_password):
        try:
            matched_user = User.objects.get(email_address = input_username)
            pwd_valid = check_password(input_password, matched_user.password)
            if pwd_valid:
                return matched_user
            else:
                return None
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
