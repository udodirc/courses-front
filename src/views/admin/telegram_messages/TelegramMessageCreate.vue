<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';

const router = useRouter();

const formModel = ref({
  name: '',
  content: '',
  hours: '0',
  minutes: '0',
});

const minutes = computed(() =>
    Array.from({ length: 60 }, (_, i) => i.toString())
);

const { saveEntity, loading, error } = useEntitySave();

async function save() {
  try {

    const interval =
        Number(formModel.value.hours) * 3600 +
        Number(formModel.value.minutes) * 60;

    if (interval <= 0) {
      alert('Интервал должен быть больше 0.');
      return;
    }

    await saveEntity('/admin/telegram-messages', {
      name: formModel.value.name,
      content: formModel.value.content,
      interval,
    });

    await router.push('/admin/telegram-messages');

  } catch (e) {
    console.error('Ошибка при сохранении сообщения:', e);
  }
}
</script>

<template>
  <BaseForm
      label="Создание сообщения"
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