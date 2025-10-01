<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import BaseForm from '../components/ui/BaseForm.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import FormErrors from '../components/ui/FormErrors.vue';
import BaseTextArea from "../components/ui/BaseTextArea.vue";
import {useEntitySave} from "../composables/useEntitySave.ts";

const emit = defineEmits(['close']);

const router = useRouter();

const closeModal = () => {
  emit('close');
};

const formModel = ref({
  email: '',
  phone: '',
  message: ''
});

const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();

async function save() {
  try {
    const payload = new FormData();
    payload.append('email', formModel.value.email);
    payload.append('phone', formModel.value.phone);
    payload.append('message', formModel.value.message);

    await saveEntity('/contacts', payload);

    closeModal();
    router.push('/');
  } catch (e) {
    console.error('Ошибка при отправке сообщения:', e);
  }
}
</script>

<template>
  <Teleport to="body">
    <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
    >
      <!-- Увеличена ширина контейнера с `max-w-md` на `max-w-xl` -->
      <div class="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-xl">
        <div class="flex justify-between items-center mb-4">
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p>
          <BaseForm label="Отправьте сообщение" :loading="loading" :onSubmit="save">
            <FormErrors :error="error" />
            <BaseInput v-model="formModel.email" label="Email" required />
            <BaseInput v-model="formModel.phone" label="Телефон"/>
            <BaseTextArea v-model="formModel.message" label="Сообщение" required />
          </BaseForm>
        </p>
      </div>
    </div>
  </Teleport>
</template>