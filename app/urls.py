from django.urls import path
from .views import *

urlpatterns = [
    path('', landing_view, name="landing"),
    # path('home/', home_view, name='home'),

    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('pets/', pets_view, name='pets'),
    path('pets/add-pet', add_pet_view, name='add-pet'),
    path('pets/<int:pet_id>/', edit_pet_view, name='edit-pet'),

    # path('search/', search_view, name='search'),
]