from datetime import date
from django import template

register = template.Library()

@register.filter
def days_until(value):
    if not value:
        return ""
    today = date.today()
    if hasattr(value, 'date'):
        value = value.date()
    delta = value - today
    return int(delta.days)