<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEntitySave } from '../../../composables/useEntitySave';

import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseForm from '../../../components/ui/BaseForm.vue';
import FormErrors from "../../../components/ui/FormErrors.vue";

const router = useRouter();

const formModel = ref({
  sponsor_id: '',
  login: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirmation: '',
  status: true,
});

const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();

async function save() {
  if (formModel.value.password !== formModel.value.passwordConfirmation) {
    error.value = { passwordConfirmation: ['Пароли не совпадают'] };
    return;
  }

  try {
    await saveEntity(
        '/admin/partners/create-partner',
        {
          ...formModel.value,
        }
    );
    router.push('/admin/partners');
  } catch (e) {
    console.error('Ошибка сохранения партнёра', e);
  }
}
</script>

<template>
  <BaseForm label="Создание партнёра" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.sponsor_id" label="ID спонсора" required />
    <BaseInput v-model="formModel.login" label="Логин" required />
    <BaseInput v-model="formModel.first_name" label="Имя"/>
    <BaseInput v-model="formModel.last_name" label="Фамилия"/>
    <BaseInput v-model="formModel.email" label="Email" type="email" required />
    <BaseInput v-model="formModel.phone" label="Телефон"/>
    <BaseInput v-model="formModel.password" label="Пароль" type="password" />
    <BaseInput
        v-model="formModel.passwordConfirmation"
        label="Повторите пароль"
        type="password"
    />
  </BaseForm>
</template>