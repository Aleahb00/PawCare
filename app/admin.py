from django.contrib import admin
from .models import (
    Pet,
    VetVisit,
    Vaccination,
    Medication,
    WeightRecord,
    Document,
    CommunityPost,
    Comment,
    CaregiverAccess,
)

# Register your models here.
admin.site.register(Pet)
admin.site.register(VetVisit)
admin.site.register(Vaccination)
admin.site.register(Medication)
admin.site.register(WeightRecord)
admin.site.register(Document)
admin.site.register(CommunityPost)
admin.site.register(Comment)
admin.site.register(CaregiverAccess)
