<template>
  <a-input
      ref="input"
      :value="innerValue"
      v-bind="cellProps"
      @blur="handleBlur"
      @change="handleChange"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { isString } from '/@/utils/is'
import { JVxeComponent, JVxeTypes } from '/@/components/jeecg/JVxeTable/types'
import { useJVxeComponent, useJVxeCompProps } from '/@/components/jeecg/JVxeTable/hooks'

const NumberRegExp = /^-?\d+\.?\d*$/
export default defineComponent({
  name: 'JVxeInputCell',
  props: useJVxeCompProps(),
  setup(props: JVxeComponent.Props) {
    const { innerValue, cellProps, handleChangeCommon } = useJVxeComponent(props)

    /** 处理change事件 */
    function handleChange(event) {
      let { target } = event
      let { value, selectionStart } = target
      let change = true
      if (props.type === JVxeTypes.inputNumber) {
        // 判断输入的值是否匹配数字正则表达式，不匹配就还原
        if (!NumberRegExp.test(value) && (value !== '' && value !== '-')) {
          change = false
          value = innerValue.value
          target.value = value || ''
          if (typeof selectionStart === 'number') {
            target.selectionStart = selectionStart - 1
            target.selectionEnd = selectionStart - 1
          }
        }
      }
      // 触发事件，存储输入的值
      if (change) {
        handleChangeCommon(value)
      }
    }

    /** 处理blur失去焦点事件 */
    function handleBlur(event) {
      let { target } = event
      // 判断输入的值是否匹配数字正则表达式，不匹配就置空
      if (props.type === JVxeTypes.inputNumber) {
        if (!NumberRegExp.test(target.value)) {
          target.value = ''
        } else {
          target.value = Number.parseFloat(target.value)
        }
        handleChangeCommon(target.value)
      }
      handleChangeCommon(target.value)
    }

    return {
      innerValue,
      cellProps,
      handleChange,
      handleBlur,
    }
  },
  enhanced: {
    installOptions: {
      autofocus: '.ant-input',
    },
    getValue(value, ctx) {
      if (ctx?.props?.type === JVxeTypes.inputNumber && isString(value)) {
        if (NumberRegExp.test(value)) {
          return Number.parseFloat(value)
        }
      }
      return value
    },
  } as JVxeComponent.EnhancedPartial,
})
</script>