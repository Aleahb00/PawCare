from django.urls import path
from .views import *
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', landing_view, name="landing"),

    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    
    path('pets/', pets_view, name='pets'),
    path('pets/edit-pet/<int:pet_id>/', edit_pet_view, name='edit-pet'),
    path('pets/delete-pet/<int:pet_id>/', delete_pet_view, name='delete_pet'),
    
    path('vet-visits/', vet_visits_view, name='vet-visits'),
    path('vet-visits/delete-visit/<int:visit_id>/', delete_vet_visit_view, name='delete-visit'),
    path('vet-visits/edit-visit/<int:visit_id>/', edit_vet_visit_view, name='edit-visit'),
    
    path('vaccinations/', vaccinations_view, name='vaccinations'),
    path('vaccinations/edit-vaccination/<int:vaccination_id>/', edit_vaccination_view, name='edit-vaccination'),
    path('vaccinations/delete-vaccination/<int:vaccination_id>/', delete_vaccination_view, name='delete-vaccination'),
    
    path('community/', community_view, name='community'),
    path('community/edit-post/<int:post_id>/', edit_post_view, name='edit-post'),
    path('community/delete-post/<int:post_id>/', delete_post_view, name='delete-post'),
    
    path('community/post-details/<int:post_id>/', post_detail_view, name='post-details'),

    path('community/post-details/delete-comment/<int:comment_id>/', delete_comment_view, name='delete-comment'),


    # path('download-pdf/', views.download_pdf, name='download_pdf')
    path('pets/<int:pet_id>/print/', pet_print_view, name='pet_print'),
    
    path('error403/', error_view, name='403'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)