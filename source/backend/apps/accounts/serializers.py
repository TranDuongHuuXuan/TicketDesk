from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "role")
        read_only_fields = ("id", "username", "email", "role")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "role")
        read_only_fields = ("id", "role")
        extra_kwargs = {
            "email": {"required": True, "allow_blank": False},
        }

    def validate(self, attrs):
        candidate_user = User(
            username=attrs.get("username", ""),
            email=attrs.get("email", ""),
        )
        validate_password(attrs["password"], user=candidate_user)
        return attrs

    def create(self, validated_data):
        # Never accept a privileged role from public registration.
        validated_data.pop("role", None)
        return User.objects.create_user(
            **validated_data,
            role=User.Role.REQUESTER,
        )
