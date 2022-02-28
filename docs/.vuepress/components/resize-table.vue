<template>
  <div class="box border" style="margin-top:0px;height: 80vh;padding: 0px 20px">
    <div class="head border" style="padding:20px 0px">
      <el-input placeholder="姓名" style="width:100px"></el-input>
    </div>
    <agel-table  class="body" v-model="table"></agel-table>
    <div class="foot border" style="padding:20px 0px">table 底部容器</div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        resize: {
          enable: true,
          relative: ".box",
          offset: () => {
            return document.querySelector(".foot").offsetHeight;
          },
        },
        columns: [
          { label: "改变浏览器高度，table 会自适应容器高度", minWidth: 300 },
        ],
        data: [],
      },
    };
  },
};
</script>
<style>
.border {
  box-sizing: border-box;
  border: 1px solid #409EFF;
}
</style>