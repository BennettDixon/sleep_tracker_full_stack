#!/usr/bin/env python3
"""
    Schema file for graphQL api of sleep app
"""
import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from synth_app.models import *
import datetime


class UserType(DjangoObjectType):
    """
        GraphQL Type
    """
    class Meta:
        model = User


class SleepTimeType(DjangoObjectType):
    """
        GraphQL Type
    """
    class Meta:
        model = SleepTime


class UserInput(graphene.InputObjectType):
    """
        The input for the User class
    """
    id = graphene.ID()
    email = graphene.String()
    sleep_times = graphene.List(lambda: SleepTimeInput)


class SleepTimeInput(graphene.InputObjectType):
    """
        The input for the SleepTime class
    """
    id = graphene.ID()
    start = graphene.types.datetime.DateTime()
    stop = graphene.types.datetime.DateTime()
    owner = graphene.Field(lambda: UserInput)


class Query(ObjectType):
    """
        Create a GraphQL Query Type for our API
    """
    user = graphene.Field(UserType, id=graphene.String())
    users = graphene.List(UserType)
    sleep_time = graphene.Field(SleepTimeType, id=graphene.String())
    user_sleep_times = graphene.List(SleepTimeType, uid=graphene.String())
    sleep_times = graphene.List(SleepTimeType)

    def resolve_user(self, info, **kwargs):
        """
            resolves a user by their id, not very secure currently
        """
        id = kwargs.get('id')

        if id:
            return User.objects.get(pk=id)

        return None

    def resolve_sleep_time(self, info, **kwargs):
        """
            graphene expects a reolver to take the graphql context
            and translate it into data for the response

            Return: SleepTime if found
        """
        id = kwargs.get('id')

        if id:
            return SleepTime.objects.get(pk=id)

        return None

    def resolve_user_sleep_times(self, info, **kwargs):
        """
            fetches all of the users sleep times
        """

        id = kwargs.get('uid')

        if id:
            return SleepTime.objects.filter(owner__id=id)
        return None

    def resolve_sleep_times(self, info, **kwargs):
        """
            fetches all of the Problems
        """
        return SleepTime.objects.all()


class CreateUser(graphene.Mutation):
    """
        Mutation to actually manipulate the db and graphql
        (do the actual creation)

        simply creates one with username provided, rest of fields should always be default currently
        also verifies username is not in use
    """
    class Arguments:
        # define the input for our static mutate method
        input = UserInput(required=True)

    ok = graphene.Boolean()
    user = graphene.Field(UserType)

    @staticmethod
    def mutate(root, info, input=None):
        """
            does the actual mutation to the db
        """
        failed = CreateUser(ok=False, user=None)
        if not input:
            return failed
        ok = True

        # verify email doesn't exist
        if User.objects.filter(email=input.email):
            return failed

        user_instance = User(
            email=input.email
        )

        user_instance.save()

        return CreateUser(ok=ok, user=user_instance)


class CreateSleepTime(graphene.Mutation):
    """
        creates a sleep time instance for a user

        uid: id of user to create sleep time for
        input: SleepTimeInput (sleep time to create)
    """
    class Arguments:
        # define the input arguments for our static mutate method
        uid = graphene.Int(required=True)
        input = SleepTimeInput(required=True)

    ok = graphene.Boolean()
    sleep_time = graphene.Field(SleepTimeType)

    @staticmethod
    def mutate(root, info, uid=None, input=None):
        ok = False
        new_sleep = None

        if uid and input:
            # grab the user from db
            user_instance = User.objects.get(pk=uid)
            if user_instance:
                ok = True
                # create the sleeptime
                new_sleep = SleepTime(
                    owner=user_instance,
                    start=input.start,
                    stop=input.stop
                )
                new_sleep.save()

        # return with status and updated instance (False/None if failed)
        return CreateSleepTime(ok=ok, sleep_time=new_sleep)


class Mutation(graphene.ObjectType):
    """
        Our set of mutations allowed
    """
    create_user = CreateUser.Field()
    create_sleep_time = CreateSleepTime.Field()


# map the queries and the mutations to a schema
schema = graphene.Schema(query=Query, mutation=Mutation)
