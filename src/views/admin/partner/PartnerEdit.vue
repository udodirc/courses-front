<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePartnerStore, usePartnerStoreWithGetters } from '../../../store/admin/partner/partner.store';
import { useEntitySave } from '../../../composables/useEntitySave';

import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseForm from '../../../components/ui/BaseForm.vue';
import FormErrors from "../../../components/ui/FormErrors.vue";
import BaseToggle from "../../../components/ui/BaseToggle.vue";

const route = useRoute();
const router = useRouter();
const partnerId = Number(route.params.id);

const partnerStore = usePartnerStore();
const { currentPartner } = usePartnerStoreWithGetters();

const formModel = ref({
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

// следим за загрузкой партнёра
watch(
    currentPartner,
    (val) => {
      if (val) {
        formModel.value.login = val.login ?? '';
        formModel.value.first_name = val.first_name ?? '';
        formModel.value.last_name = val.last_name ?? '';
        formModel.value.email = val.email ?? '';
        formModel.value.phone = val.phone ?? '';
        formModel.value.status = !!val.status;
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
        '/admin/partners',
        {
          ...formModel.value,
          status: formModel.value.status ? 1 : 0,
        },
        { id: partnerId }
    );
    router.push('/admin/partners');
  } catch (e) {
    console.error('Ошибка сохранения партнёра', e);
  }
}

onMounted(() => {
  partnerStore.fetchItem(partnerId);
});
</script>

<template>
  <BaseForm label="Редактировать партнёра" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

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

    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
    />
  </BaseForm>
</template>