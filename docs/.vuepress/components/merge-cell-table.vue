<template>
  <div>
    <p>设置 <code>table.merge.auto</code> 将自动合并所有相同列</p>
    <agel-table v-model="table"></agel-table>
    <p>也可设置指定列 <code>merge</code> 进行合并 </p>
    <agel-table v-model="table2"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    const data = [
      { date: "2016-05-02", name: "王小虎", address: "上海市1" },
      { date: "2016-05-02", name: "王小虎", address: "上海市2" },
      { date: "2016-05-02", name: "王小虎", address: "上海市3" },
    ];
    return {
      table: {
        border: true,
        merge: { enable: true, auto: true },
        columns: [
          { label: "日期", prop: "date", width: 200 },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
        ],
        data,
      },
      table2: {
        border: true,
        merge: { enable: true },
        columns: [
          { label: "日期", prop: "date", width: 200, merge: true },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
        ],
        data,
      },
    };
  },
};
</script>