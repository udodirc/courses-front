<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  useTelegramMessagesStore,
  useTelegramMessagesStoreWithGetters
} from '../../../store/admin/telegram_messages/telegram_messages.store.ts';
import { useErrorHandler } from '../../../composables/useErrorHandler';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseToggle from '../../../components/ui/BaseToggle.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import api from '../../../api';

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const telegramMessageStore = useTelegramMessagesStore();
const { currentTelegramMessage } = useTelegramMessagesStoreWithGetters();
const { error, setError } = useErrorHandler();

const loading = ref(false);

const formModel = ref({
  name: '',
  content: '',
  hours: '',
  minutes: '0',
  status: true,
});

const minutes = computed(() =>
    Array.from({ length: 60 }, (_, i) => i.toString())
);

watch(currentTelegramMessage, (val) => {
  if (!val) {
    return;
  }

  formModel.value.name = val.name;
  formModel.value.content = val.content;
  formModel.value.status = Boolean(val.status);

  const interval = Number(val.interval);

  formModel.value.hours = Math.floor(interval / 3600).toString();
  formModel.value.minutes = Math.floor((interval % 3600) / 60).toString();
});

async function save() {
  loading.value = true;
  error.value = null;

  try {

    const interval =
        Number(formModel.value.hours) * 3600 +
        Number(formModel.value.minutes) * 60;

    if (interval <= 0) {
      alert('Интервал должен быть больше 0.');
      return;
    }

    await api.put(`/admin/telegram-messages/${id}`, {
      name: formModel.value.name,
      content: formModel.value.content,
      interval,
      status: formModel.value.status,
    });

    await router.push('/admin/telegram-messages');

  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await telegramMessageStore.fetchItem(id);
});
</script>

<template>
  <BaseForm
      label="Редактировать сообщение"
      :loading="loading"
      :onSubmit="save"
  >
    <FormErrors :error="error" />

    <BaseInput
        v-model="formModel.name"
        label="Имя"
        required
    />

    <BaseTextArea
        v-model="formModel.content"
        label="Контент"
        required
    />

    <BaseInput
        v-model="formModel.hours"
        label="Часы"
        type="number"
        required
    />

    <div class="form-group">
      <label>Минуты</label>

      <select
          v-model="formModel.minutes"
          class="form-select"
      >
        <option
            v-for="minute in minutes"
            :key="minute"
            :value="minute"
        >
          {{ minute.padStart(2, '0') }}
        </option>
      </select>
    </div>

    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
    />
  </BaseForm>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 16px;
}

.form-group label {
  font-weight: 500;
}

.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;
}
</style>