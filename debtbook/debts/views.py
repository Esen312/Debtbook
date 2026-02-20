from rest_framework import generics, permissions
from .models import Debt
from .serializers import DebtSerializer

class DebtListCreateView(generics.ListCreateAPIView):
    serializer_class = DebtSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Debt.objects.filter(debtor__owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save()


class DebtRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DebtSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Debt.objects.filter(debtor__owner=self.request.user)
