<template>
  <img style="margin-right: 1em;" :src="saneSrc" />
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
    };
  },
  props: {
    src: String,
  },
  methods: {
  },
  computed: {
    saneSrc () {
      if(!this.src) return this.src;
      if(!this.src.startsWith('http:')) return this.src;
      return 'https' + this.src.substring(4);
    }
  }
}
</script>