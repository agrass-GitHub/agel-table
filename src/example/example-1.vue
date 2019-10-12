<template>
  <div class="app">
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  name: 'app',
  data() {
    return {
      table: {}
    };
  }
};
</script>
 
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body,
html,
.app {
  width: 100%;
  height: 100%;
  min-width: 1200px;
}

.app {
  display: flex;
}
</style>