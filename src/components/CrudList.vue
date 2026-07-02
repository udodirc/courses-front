<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import BaseTable from './BaseTable.vue';
import BasePagination from './BasePagination.vue';
import type { Column } from '../types/Column.ts';
import { useFetchList } from '../composables/useFetchList';

interface StatusOption {
  label: string;
  value: string | number;
}

const props = withDefaults(defineProps<{
  items: any[],
  columns: Column[],
  currentPage: number,
  totalPages: number,
  showActions: boolean,
  listID?: string
}>(), {
  listID: ''
});

// ----------------------
// Локальные состояния
// ----------------------
const loadingRowID = ref<number | null>(null);
const rowStatusOptions = ref<Record<number, StatusOption[]>>({});

async function fetchStatusOptionsForRow(id: number) {
  if (rowStatusOptions.value[id]) return;

  loadingRowID.value = id;

  try {
    const { items: statuses, fetchItems } = useFetchList<StatusOption>('/admin/withdrawals/statuses');

    await fetchItems();

    rowStatusOptions.value[id] = statuses.value;

  } catch (e) {
    console.error('Ошибка загрузки статусов:', e);
  } finally {
    loadingRowID.value = null;
  }
}

const emit = defineEmits([
  'prev',
  'next',
  'go',
  'view',
  'edit',
  'toggleStatus',
  'toggleFreePay',
  'changeOrderUp',
  'changeOrderDown',
  'delete',
  'payment',
  'structure',
  'changeStatus',
  'sendMessage'
]);

function handleStatusChange(event: Event, item: any) {
  const target = event.target as HTMLSelectElement | null;
  if (target) {
    emit('changeStatus', { id: item.id, newStatus: target.value });
  }
}

function formatInterval(value: number | string): string {
  const totalSeconds = Number(value) || 0;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
}
</script>

<template>
  <BaseTable :key="props.currentPage">
    <template #head>
      <th
          v-for="col in props.columns"
          :key="col.field"
          class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm"
      >
        {{ col.label }}
      </th>
      <th
          v-if="
        props.showActions ||
        props.items.some(item => item.canSendMessage)
    "
      >
        Действия
      </th>
    </template>

    <template #body>
      <tr
          v-for="(item, i) in props.items"
          :key="item.id"
          :class="[i % 2 === 0 ? 'bg-white' : 'bg-gray-100', 'hover:bg-gray-200']"
      >
        <td
            v-for="col in props.columns"
            :key="col.field"
            class="w-1/3 text-left py-3 px-4"
        >

          <!-- ====================== -->
          <!--      СПЕЦИАЛЬНЫЕ поля  -->
          <!-- ====================== -->

          <!-- LOGIN -->
          <template v-if="col.field === 'login'">
            <a
                :href="`/${item.structure}`"
                class="text-blue-600 hover:underline"
                @click.prevent="emit('view', item.id)"
            >
              {{
                col.format
                    ? col.format(item[col.field], item)
                    : item[col.field]
              }}
            </a>
          </template>

          <!-- PARTNER -->
          <template v-else-if="col.field === 'partner_name'">
            <a
                :href="`/admin/partners/${item.partner_id}`"
                class="text-blue-600 hover:underline"
            >
              {{ item[col.field] }}
            </a>
          </template>

          <template v-else-if="col.field === 'lesson' && props.listID === 'lesson_comments'">
            <a
                :href="`/admin/lessons-comments/${item.lesson_id}`"
                class="text-blue-600 hover:underline"
            >
              {{ item[col.field] }}
            </a>
          </template>

          <!-- ORDER -->
          <template v-else-if="col.field === 'order_number'">
            <a
                :href="`/admin/orders/${item.id}`"
                class="text-blue-600 hover:underline"
            >
              {{ item[col.field] }}
            </a>
          </template>

          <!-- STATUS (только withdrawals) -->
          <template v-else-if="col.field === 'status' && props.listID === 'withdrawals'">

            <span v-if="loadingRowID === item.id">Загрузка...</span>

            <!-- Уже загружены -->
            <select
                v-else-if="rowStatusOptions[item.id]"
                :value="item.status"
                @change="(event) => handleStatusChange(event, item)"
                class="border rounded p-1 text-sm bg-white"
            >
              <option
                  v-for="status in rowStatusOptions[item.id]"
                  :key="status.value"
                  :value="status.value"
              >
                {{ status.label }}
              </option>
            </select>

            <!-- Загружаем при фокусе -->
            <select
                v-else
                :value="item.status"
                @focus="() => fetchStatusOptionsForRow(item.id)"
                @change="(event) => handleStatusChange(event, item)"
                class="border rounded p-1 text-sm bg-white"
            >
              <option disabled :value="item.status">
                {{ item.status }}
              </option>
            </select>
          </template>

          <template v-else-if="col.field === 'interval'">
            {{ formatInterval(item[col.field]) }}
          </template>

          <!-- Дефолт -->
          <template v-else>
            {{ item[col.field] }}
          </template>

        </td>

        <!-- ====================== -->
        <!--         ACTIONS        -->
        <!-- ====================== -->

        <td v-if="props.showActions" class="flex gap-2 justify-center">
          <button v-if="item.structure" @click="emit('structure', item.id)">structure</button>
          <button v-if="item.canPay" @click="emit('payment', item.id)">$</button>
          <button v-if="item.canSendMessage" @click="emit('sendMessage', item.id)">send</button>
          <button @click="emit('view', item.id)">👁</button>
          <button @click="emit('edit', item.id)">✏️</button>

          <button
              v-if="item.canToggleStatus"
              @click="emit('toggleStatus', item.id)"
              :class="item.status ? 'text-green-600' : 'text-red-600'"
          >
            {{ item.status ? '✅' : '❌' }}
          </button>

          <button
              v-if="item.canToggleFreePay"
              @click="emit('toggleFreePay', item.id)"
              :class="item.free_pay ? 'text-green-600' : 'text-red-600'"
          >
            {{ item.free_pay ? '✅' : '❌' }}
          </button>

          <button
              v-if="item.canChangeOrder"
              @click="emit('changeOrderUp', item.id)"
              :disabled="i === 0"
          >⬆️</button>

          <button
              v-if="item.canChangeOrder"
              @click="emit('changeOrderDown', item.id)"
              :disabled="i === props.items.length - 1"
          >⬇️</button>

          <button
              v-if="item.canDelete ?? true"
              @click="emit('delete', item.id)"
          >❌</button>
        </td>
        <td v-else-if="item.canSendMessage" class="flex gap-2 justify-center">
          <button
              v-if="item.canSendMessage"
              @click="emit('sendMessage', item.chat_id)"
          >
            <i class="fab fa-telegram-plane"></i>
          </button>
        </td>

      </tr>
    </template>
  </BaseTable>

  <BasePagination
      :currentPage="props.currentPage"
      :totalPages="props.totalPages"
      @prev="emit('prev')"
      @next="emit('next')"
      @go="emit('go', $event)"
  />
</template>