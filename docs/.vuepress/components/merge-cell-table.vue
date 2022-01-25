<template>
  <div>
    <p>设置 <code>merge.auto</code> 将自动纵向合并相同行</p>
    <agel-table v-model="table"></agel-table>
    <p>也可设置指定某一列 <code>columnb.merge</code> 进行合并 </p>
    <agel-table v-model="table2"></agel-table>
    <p>也可设置合并方向，<code>merge.direction</code>为<code>horizontal</code>横向合并相同列</p>
    <agel-table v-model="table3"></agel-table>
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
      table3: {
        border: true,
        merge: { enable: true, auto: true, direction: "horizontal" },
        columns: [
          { label: "日期1", prop: "date1", width: 200 },
          { label: "日期2", prop: "date2", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
        ],
        data: [
          { date1: "2016-05-02", date2: "2016-05-02", address: "上海市1" },
          { date1: "2016-05-02", date2: "2016-05-02", address: "上海市2" },
          { date1: "2016-05-02", date2: "2016-05-03", address: "上海市2" },
        ],
      },
    };
  },
};
</script>