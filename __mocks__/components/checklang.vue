<template>
  <div>
    <a title="title">Hardcoded title</a>
    <a :title="$l('translated_title')">{{ $l('translated_title') }}</a>

    <div>Hardcoded text</div>
    <div>{{ $l('translated_text') }}</div>
  </div>
</template>

<script>
export default {
  name: 'checklang'
}
</script>

<style scoped>

</style>