<template>
  <b-row>
    <b-form-input class="searchForm" v-model="searchTerm" @keyup.enter="submit" placeholder="Search for series"></b-form-input>
    <router-view></router-view>
  </b-row>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      searchTerm: '',
    };
  },
  methods: {
    submit() {
      this.$router.push({ name: 'search', params: {query: this.searchTerm}});
    }
  },
  mounted () {
    this.searchTerm=this.$route.params.query || '';
  }
}
</script>