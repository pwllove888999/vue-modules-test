<template>
<div class="main">
  fdsfdsfsf {{currentRoute}}
</div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    currentRoute() {
      return this.$route.hash
    }
  }
}
</script>

<style>

</style>
