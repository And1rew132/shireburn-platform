import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { defineComponent, h } from 'vue'
import '../app/assets/css/main.css'

const passthrough = (tag = 'div') => defineComponent({
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h(tag, attrs, slots.default?.())
  }
})

setup((app) => {
  app.component('UBadge', passthrough('span'))
  app.component('UIcon', defineComponent({
    props: { name: { type: String, required: false } },
    setup(props) {
      return () => h('span', { 'aria-hidden': 'true', class: 'inline-block size-4', 'data-icon': props.name })
    }
  }))
  app.component('UButton', passthrough('button'))
  app.component('UAlert', defineComponent({
    props: { title: { type: String, required: false } },
    setup(props) {
      return () => h('div', { role: 'alert' }, props.title)
    }
  }))
  app.component('UFormField', defineComponent({
    props: { label: { type: String, required: false } },
    setup(props, { slots }) {
      return () => h('label', { class: 'grid gap-1' }, [h('span', props.label), slots.default?.()])
    }
  }))
  app.component('UInput', defineComponent({
    inheritAttrs: false,
    props: { modelValue: { type: [String, Number], required: false } },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
      return () => h('input', {
        ...attrs,
        value: props.modelValue ?? '',
        onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value)
      })
    }
  }))
  app.component('UTextarea', defineComponent({
    inheritAttrs: false,
    props: { modelValue: { type: String, required: false } },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
      return () => h('textarea', {
        ...attrs,
        value: props.modelValue ?? '',
        onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
      })
    }
  }))
})

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: { test: 'todo' }
  }
}

export default preview
