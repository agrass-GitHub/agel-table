<template>
  <div style="margin-top:0px">
    <div class="index" >
      <el-row style="margin-bottom:10px" type="flex">
        <el-input></el-input>
        <el-input></el-input>
        <el-input></el-input>
        <el-input></el-input>
      </el-row>
      <agel-table v-model="table"></agel-table>
    </div>
    <div style="height:100px;border:1px solid red">
      111111
    </div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        page: {
          enable: true,
        },
        resize: {
          enable: true,
          container: ".index",
        },
        columns: [
          { label: "日期", prop: "date", width: 200 },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
        ],
        data: [],
      },
    };
  },
};
</script>