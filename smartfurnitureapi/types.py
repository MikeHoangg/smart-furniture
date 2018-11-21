from django.utils.translation import gettext_lazy as _

MULTI_FURNITURE_TYPES = [
    ('sofa', _('Sofa')),
    ('table', _('Table')),
    ('bed', _('Bed')),
    ('cupboard', _('Cupboard')),
]
SOLO_FURNITURE_TYPES = [
    ('chair', _('Chair')),
    ('desk', _('Desk')),
]
RIGIDITY = (
    ('soft', _('Soft')),
    ('medium', _('Medium')),
    ('solid', _('Solid')),
)
MASSAGE = (
    ('none', _('None')),
    ('slow', _('Slow')),
    ('medium', _('Medium')),
    ('rapid', _('Rapid')),
)
PRIME_FURNITURE_TYPES = [
    'sofa',
    'bed',
    'chair',
]
