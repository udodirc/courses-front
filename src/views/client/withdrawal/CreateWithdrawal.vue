<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import BaseTextArea from "../../../components/ui/BaseTextArea.vue";
const router = useRouter();
const partnerId: string = localStorage.getItem('partner_id') ?? '';

const formModel = ref({
  partner_id: '',
  amount: '',
  description: ''
});
// универсальное сохранение
const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();
async function save() {
 try {
    await saveEntity('/partner/withdrawals', {
      partner_id: partnerId,
      amount: formModel.value.amount,
      description: formModel.value.description
    });

    router.push('/partner/withdrawals');
  } catch (e) {
    console.error('Ошибка сохранения:', e);
  }
}
</script>
<template>
  <BaseForm label="Вывод денег" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />
    <BaseInput v-model="formModel.amount" label="Сумма" required />
    <BaseTextArea v-model="formModel.description" label="Реквизиты"/>
  </BaseForm>
</template>