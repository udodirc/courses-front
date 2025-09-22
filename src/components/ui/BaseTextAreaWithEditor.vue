<script setup lang="ts">
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  label: string;
  modelValue: string;
  rows?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const content = ref('');
const editorRef = ref<HTMLDivElement | null>(null);
const undoStack = ref<string[]>([]);
const redoStack = ref<string[]>([]);
const textAlign = ref<'left' | 'center' | 'right' | 'justify'>('left');
const isHtmlView = ref(false);
const headerLevel = ref<number | null>(null);

// refs для скрытых color input
const textColorInput = ref<HTMLInputElement | null>(null);
const bgColorInput = ref<HTMLInputElement | null>(null);

// синхронизация с внешним modelValue
watch(
    () => props.modelValue,
    (val) => {
      content.value = val || '';
      if (!isHtmlView.value && editorRef.value) editorRef.value.innerHTML = content.value;
      adjustHeight();
    },
    { immediate: true }
);

// уведомляем родителя об изменении
watch(content, (val) => emit('update:modelValue', val));

// функции работы с текстом
function wrapSelectionMultiple(tags: string[], style?: string, href?: string) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  let selectedText = range.toString() || 'Link';

  if (href) selectedText = `<a href="${href}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;
  if (style) selectedText = `<span style="${style}">${selectedText}</span>`;
  for (const tag of tags) selectedText = `<${tag}>${selectedText}</${tag}>`;

  const frag = document.createRange().createContextualFragment(selectedText);
  range.deleteContents();
  range.insertNode(frag);

  content.value = editorRef.value?.innerHTML || '';
  undoStack.value.push(content.value);
  redoStack.value = [];
  adjustHeight();
}

function insertHTML(html: string) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  const frag = document.createRange().createContextualFragment(html);
  range.deleteContents();
  range.insertNode(frag);

  content.value = editorRef.value?.innerHTML || '';
  undoStack.value.push(content.value);
  redoStack.value = [];
  adjustHeight();
}

function onInput() {
  content.value = editorRef.value?.innerHTML || '';
  undoStack.value.push(content.value);
  redoStack.value = [];
  adjustHeight();
}

function clear() {
  content.value = '';
  if (editorRef.value) editorRef.value.innerHTML = '';
}

function undo() {
  if (undoStack.value.length > 0) {
    redoStack.value.push(content.value);
    content.value = undoStack.value.pop()!;
    if (!isHtmlView.value && editorRef.value) editorRef.value.innerHTML = content.value;
  }
}

function redo() {
  if (redoStack.value.length > 0) {
    undoStack.value.push(content.value);
    content.value = redoStack.value.pop()!;
    if (!isHtmlView.value && editorRef.value) editorRef.value.innerHTML = content.value;
  }
}

function adjustHeight() {
  if (editorRef.value) {
    editorRef.value.style.height = 'auto';
    editorRef.value.style.height = editorRef.value.scrollHeight + 'px';
  }
}

function setColor(color: string) {
  wrapSelectionMultiple([], `color: ${color};`);
}
function setBackground(color: string) {
  wrapSelectionMultiple([], `background-color: ${color};`);
}

function insertLink() {
  const url = prompt('Введите URL:');
  if (url) wrapSelectionMultiple([], undefined, url);
}
function insertImage() {
  const url = prompt('Введите URL изображения:');
  if (url) insertHTML(`<img src="${url}" alt="Image" />`);
}

function applyAlignment(alignment: 'left' | 'center' | 'right' | 'justify') {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  let node: Node | null = range.startContainer;

  while (node && node !== editorRef.value) {
    if (node instanceof HTMLElement && getComputedStyle(node).display === 'block') break;
    node = node.parentElement;
  }

  if (!node || node === editorRef.value) {
    const div = document.createElement('div');
    div.style.textAlign = alignment;
    div.appendChild(range.extractContents());
    range.insertNode(div);
  } else {
    (node as HTMLElement).style.textAlign = alignment;
  }

  content.value = editorRef.value?.innerHTML || '';
  undoStack.value.push(content.value);
  redoStack.value = [];
}

function changeIndent(increment: number) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  let node: HTMLElement | null = range.startContainer.parentElement;

  while (node instanceof HTMLElement && node !== editorRef.value) {
    if (getComputedStyle(node).display !== 'inline') break;
    node = node.parentElement;
  }

  if (!(node instanceof HTMLElement) || node === editorRef.value) return;

  const current = parseInt(getComputedStyle(node).marginLeft) || 0;
  const newIndent = Math.max(0, current + increment * 20);
  node.style.marginLeft = newIndent + 'px';

  content.value = editorRef.value?.innerHTML || '';
  undoStack.value.push(content.value);
  redoStack.value = [];
}

function applyHeader(level: number | null) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  const selectedText = range.extractContents();

  const tag = level ? `h${level}` : 'p';
  const el = document.createElement(tag);
  el.appendChild(selectedText);
  range.insertNode(el);

  content.value = editorRef.value?.innerHTML || '';
  undoStack.value.push(content.value);
  redoStack.value = [];
}

function triggerColorInput(inputRef: typeof textColorInput | typeof bgColorInput) {
  const input = inputRef.value;
  if (input instanceof HTMLInputElement) {
    input.click();
  }
}

onMounted(() => adjustHeight());
</script>

<template>
  <div class="editor-container w-full">
    <label class="block text-sm text-gray-700 mb-2">{{ label }}</label>

    <div class="flex flex-wrap gap-2 mb-2">
      <!-- Заголовки и стили -->
      <div class="toolbar-group flex gap-1">
        <select v-model.number="headerLevel" @change="applyHeader(headerLevel)" class="toolbar-select">
          <option :value="null">Normal</option>
          <option v-for="n in 6" :key="n" :value="n">H{{ n }}</option>
        </select>
        <button @click.prevent="wrapSelectionMultiple(['b'])" class="toolbar-button font-bold">B</button>
        <button @click.prevent="wrapSelectionMultiple(['i'])" class="toolbar-button italic">I</button>
        <button @click.prevent="wrapSelectionMultiple(['u'])" class="toolbar-button underline">U</button>
        <button @click.prevent="wrapSelectionMultiple(['strike'])" class="toolbar-button line-through">S</button>
      </div>

      <!-- Списки -->
      <div class="toolbar-group flex gap-1">
        <button @click.prevent="wrapSelectionMultiple(['ul'])" class="toolbar-button">• List</button>
        <button @click.prevent="wrapSelectionMultiple(['ol'])" class="toolbar-button">1. List</button>
      </div>

      <!-- Цвета -->
      <div class="toolbar-group flex gap-1">
        <button
            @click.prevent="() => triggerColorInput(textColorInput)"
            class="toolbar-button"
            aria-label="Text color"
            title="Text color"
        >
          🎨
        </button>
        <input
            ref="textColorInput"
            type="color"
            class="hidden"
            @input="(e: Event) => { const t = e.target as HTMLInputElement; if (t) setColor(t.value); }"
        />

        <button
            @click.prevent="() => triggerColorInput(bgColorInput)"
            class="toolbar-button"
            aria-label="Background color"
            title="Background color"
        >
          🖌
        </button>
        <input
            ref="bgColorInput"
            type="color"
            class="hidden"
            @input="(e: Event) => { const t = e.target as HTMLInputElement; if (t) setBackground(t.value); }"
        />
      </div>

      <!-- Ссылки и изображения -->
      <div class="toolbar-group flex gap-1">
        <button @click.prevent="insertLink()" class="toolbar-button text-blue-600">Link</button>
        <button @click.prevent="insertImage()" class="toolbar-button text-green-600">Image</button>
      </div>

      <!-- Выравнивание и отступы -->
      <div class="toolbar-group flex gap-1">
        <select v-model="textAlign" @change="applyAlignment(textAlign)" class="toolbar-select">
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
        <button @click.prevent="changeIndent(-1)" class="toolbar-button">«</button>
        <button @click.prevent="changeIndent(+1)" class="toolbar-button">»</button>
      </div>

      <!-- Undo / Redo / Clear -->
      <div class="toolbar-group flex gap-1 items-center">
        <button @click.prevent="undo()" class="toolbar-button">Undo</button>
        <button @click.prevent="redo()" class="toolbar-button">Redo</button>
        <button @click.prevent="clear()" class="toolbar-button text-red-600">Clear</button>
      </div>

      <!-- HTML переключатель -->
      <div class="toolbar-group flex gap-1 items-center">
        <label class="flex items-center gap-1">
          <input type="checkbox" v-model="isHtmlView" /> HTML
        </label>
      </div>
    </div>

    <!-- Редактор -->
    <div
        v-if="!isHtmlView"
        ref="editorRef"
        contenteditable="true"
        v-html="content"
        @input="onInput"
        class="editor min-h-[12em] max-h-[24em] mb-2.5 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 w-full overflow-auto"
    />

    <textarea
        v-else
        v-model="content"
        class="editor min-h-[12em] max-h-[24em] mb-2.5 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 text-gray-800 w-full overflow-auto"
    />
  </div>
</template>

<style scoped>
.toolbar-button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  background: #fff;
  color: #374151;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.toolbar-button:hover { background: #f3f4f6; }
.toolbar-button:active { background: #e5e7eb; }
.toolbar-select {
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  background: #fff;
  font-size: 0.875rem;
}
.toolbar-group {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}
.editor:empty:before {
  content: attr(placeholder);
  color: #9ca3af;
}
</style>