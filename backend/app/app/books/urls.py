from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.get_home, name='get_home'),
]
