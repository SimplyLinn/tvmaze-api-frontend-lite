<template>
  <b-row>
    <b-form-input class="searchForm" v-model="searchTerm" @keyup.enter="submit" placeholder="Search for series"></b-form-input>
    <router-view></router-view>
  </b-row>
</template>

<script>
import { getCurTime, SearchCancelledError } from '../utils';

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
      console.log(this.searchTerm);
    }
  }
}
</script>