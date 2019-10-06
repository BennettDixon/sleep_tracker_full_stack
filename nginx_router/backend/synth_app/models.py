from django.db import models
import datetime
# Create your models here.


class BaseModel(models.Model):
    """
        Base model for classes
        inherits from django orm model
    """
    @classmethod
    def convert_list(cls, obj_list=None):
        """
            converts a list of a model from input type to their instance stored in ORM

            Return: 
                    SUCCESS: list of objects on success (converted from Input types)
                    FAIL:    None
        """
        if obj_list:
            new_list = []
            for obj in obj_list:
                stored_obj = cls.objects.get(pk=obj.id)
                if stored_obj is None:
                    print('CONVERT_LIST FAILED')
                    return None
                new_list.append(stored_obj)
            return new_list
        return None

    class Meta:
        abstract = True


class User(BaseModel):
    """
        base user class for other classes

        email: user email
        sleep_times: many to many to sleep time (back_ref via SleepTime)
    """
    email = models.CharField(max_length=128)

    class Meta:
        ordering = ('email',)


class SleepTime(BaseModel):
    """
        class representing a SleepTime in our database

        start: start time of sleep (DateTime)
        stop: stop time of sleep (DateTime)
        owner: FK to User, providing back_ref of sleep_times
    """
    start = models.DateTimeField()
    stop = models.DateTimeField()
    owner = models.ForeignKey(User, related_name='sleep_times',
                              on_delete=models.CASCADE)

    class Meta:
        ordering = ('owner', 'start')
