<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePartnerStore } from '../../../store/client/partner/partner.store.ts';
import { useEntitySave } from '../../../composables/useEntitySave';

import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseForm from '../../../components/ui/BaseForm.vue';
import FormErrors from "../../../components/ui/FormErrors.vue";

const route = useRoute();
const router = useRouter();
const partnerStore = usePartnerStore();

const partnerId = Number(route.params.id);

const formModel = ref({
  login: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirmation: '',
});

const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();

// следим за загрузкой user
watch(
    () => partnerStore.user,
    (val) => {
      if (val) {
        formModel.value.login = val.login ?? '';
        formModel.value.first_name = val.first_name ?? '';
        formModel.value.last_name = val.last_name ?? '';
        formModel.value.email = val.email ?? '';
        formModel.value.phone = val.phone ?? '';
      }
    },
    { immediate: true }
);

async function save() {
  if (formModel.value.password !== formModel.value.passwordConfirmation) {
    error.value = { passwordConfirmation: ['Пароли не совпадают'] };
    return;
  }

  try {
    await saveEntity(
        '/partner/update',
        {
          ...formModel.value,
        },
        {
          id: partnerId,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('partner_token')}`,
          },
        }
    );

    await partnerStore.fetchUser();

    router.push('/partner/profile');
  } catch (e) {
    console.error('Ошибка сохранения партнёра', e);
  }
}

onMounted(async () => {
  if (!partnerStore.user) {
    await partnerStore.fetchUser();
  }
});
</script>

<template>
  <BaseForm label="Редактировать профиль" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.login" label="Логин" required />
    <BaseInput v-model="formModel.first_name" label="Имя" />
    <BaseInput v-model="formModel.last_name" label="Фамилия" />
    <BaseInput v-model="formModel.email" label="Email" type="email" required />
    <BaseInput v-model="formModel.phone" label="Телефон" />
    <BaseInput v-model="formModel.password" label="Пароль" type="password" />
    <BaseInput
        v-model="formModel.passwordConfirmation"
        label="Повторите пароль"
        type="password"
    />
  </BaseForm>
</template>

<style scoped>
.BaseForm {
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 800px;
  margin: 0 auto;
}
</style>