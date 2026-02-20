from django.urls import path
from .views import DebtListCreateView, DebtRetrieveUpdateDestroyView

urlpatterns = [
    path('debts/', DebtListCreateView.as_view(), name='debts-list-create'),
    path('debts/<int:pk>/', DebtRetrieveUpdateDestroyView.as_view(), name='debt-detail'),
]
