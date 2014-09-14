from factory.mongoengine import MongoEngineFactory

from speechbubble.auth import User, Role
from speechbubble.models import ModerationQueue, Product


class RoleFactory(MongoEngineFactory):
    class Meta:
        model = Role


class UserFactory(MongoEngineFactory):
    class Meta:
        model = User


class Product(MongoEngineFactory):
    class Meta:
        model = Product


