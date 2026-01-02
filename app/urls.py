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
    path('pets/edit-pet/<int:pet_id>/', edit_pet_view, name='edit-pet'),
    path('pets/delete-pet/<int:pet_id>/', delete_pet_view, name='delete_pet'),
    
    path('vet-visits/', vet_visits_view, name='vet-visits'),
    path('vet-visits/add-visit/', create_vet_visit_view, name='add-visit'),
    path('vet-visits/delete-visit/<int:visit_id>/', delete_vet_visit_view, name='delete-visit'),
    path('vet-visits/edit-visit/<int:visit_id>/', edit_vet_visit_view, name='edit-visit'),
    
    path('vaccinations/', vaccinations_view, name='vaccinations'),
    path('vaccinations/add-vaccination/', create_vaccination_view, name='add-vaccination'),
    path('vaccinations/edit-vaccination/<int:vaccination_id>/', edit_vaccination_view, name='edit-vaccination'),
    path('vaccinations/delete-vaccination/<int:vaccination_id>/', delete_vaccination_view, name='delete-vaccination'),




    # path('search/', search_view, name='search'),
]