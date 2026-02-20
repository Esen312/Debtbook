from rest_framework import serializers
from .models import Debtor, Debt

class DebtorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debtor
        fields = ['id', 'last_name', 'first_name', 'middle_name', 'phone']

class DebtSerializer(serializers.ModelSerializer):
    debtor = DebtorSerializer()  # вложенный сериализатор

    class Meta:
        model = Debt
        fields = ['id', 'debtor', 'amount', 'description', 'is_paid', 'created_at']

    def create(self, validated_data):
        debtor_data = validated_data.pop('debtor')
        debtor, _ = Debtor.objects.get_or_create(
            last_name=debtor_data['last_name'],
            first_name=debtor_data['first_name'],
            middle_name=debtor_data.get('middle_name'),
            phone=debtor_data.get('phone'),
            owner=self.context['request'].user
        )
        debt = Debt.objects.create(debtor=debtor, **validated_data)
        # автоматически отмечаем как оплачено, если сумма = 0
        if debt.amount == 0:
            debt.is_paid = True
            debt.save()
        return debt

    def update(self, instance, validated_data):
        debtor_data = validated_data.pop("debtor", None)

        # обновляем сам долг
        if "amount" in validated_data:
            instance.amount = validated_data["amount"]
        if "description" in validated_data:
            instance.description = validated_data["description"]

        # автообновление статуса
        instance.is_paid = (instance.amount == 0)

        instance.save()

        # если передан debtor — обновляем его
        if debtor_data:
            debtor = instance.debtor
            debtor.last_name = debtor_data.get("last_name", debtor.last_name)
            debtor.first_name = debtor_data.get("first_name", debtor.first_name)
            debtor.middle_name = debtor_data.get("middle_name", debtor.middle_name)
            debtor.phone = debtor_data.get("phone", debtor.phone)
            debtor.save()

        return instance

