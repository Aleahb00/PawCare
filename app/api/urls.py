from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

router = DefaultRouter()
router.register(r'pets', views.PetViewSet, basename='pet')
router.register(r'vet-visits', views.VetVisitViewSet, basename='vetvisit')
router.register(r'vaccinations', views.VaccinationViewSet, basename='vaccination')
router.register(r'medications', views.MedicationViewSet, basename='medication')
router.register(r'weight-records', views.WeightRecordViewSet, basename='weightrecord')
router.register(r'documents', views.DocumentViewSet, basename='document')
router.register(r'caregivers', views.CaregiverAccessViewSet, basename='caregiveraccess')
router.register(r'community/posts', views.CommunityPostViewSet, basename='communitypost')
router.register(r'community/comments', views.CommentViewSet, basename='comment')

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='api-register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    path('reminders/', views.ReminderView.as_view(), name='api-reminders'),

    path('', include(router.urls)),
]
