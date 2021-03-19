<template>
  <div class="demo">
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        resize: {
          enable: true,
          offset: 10,
        },
        columns: [{ label: "日期", prop: "date", sortable: "custom" }],
      },
    };
  },
};
</script>