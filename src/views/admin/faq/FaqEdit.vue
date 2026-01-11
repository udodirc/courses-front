<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFaqStore, useFaqStoreWithGetters } from '../../../store/admin/faq/faq.store.ts';
import { useErrorHandler } from '../../../composables/useErrorHandler';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseToggle from '../../../components/ui/BaseToggle.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import api from "../../../api";

const route = useRoute();
const router = useRouter();
const contentId = Number(route.params.id);

const faqStore = useFaqStore();
const { currentFaq } = useFaqStoreWithGetters();
const { error, setError } = useErrorHandler();

const loading = ref(false);
const formModel = ref({
  question: '',
  answer: '',
  status: true,
});

watch(currentFaq, (val) => {
  if (val) {
    formModel.value.question = val.question;
    formModel.value.answer = val.answer;
    formModel.value.status = val.status ?? 1;
  }
});

async function save() {
  loading.value = true;
  error.value = null;

  try {
    await api.put(`/admin/faq/${contentId}`, {
      question: formModel.value.question,
      answer: formModel.value.answer,
      status: formModel.value.status,
    });
    router.push('/admin/faq');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await faqStore.fetchItem(contentId);
});
</script>

<template>
  <BaseForm label="Редактировать F.A.Q" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.question" label="Вопрос" required />

    <BaseTextArea
        v-model="formModel.answer"
        label="Ответ"
        required
    />

    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
    />
  </BaseForm>
</template>