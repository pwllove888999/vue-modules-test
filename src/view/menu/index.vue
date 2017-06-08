<template>
<div class="menu">
  <el-menu default-active="2" class="el-menu-vertical-demo" @select="handleSelect" @open="handleOpen" @close="handleClose">
    <el-submenu index="1">
      <span slot="title"><i class="el-icon-message"></i>居委会</span>
      <el-submenu index="1-1">
        <span slot="title">资讯管理</span>
        <el-menu-item v-for="(item, index) in neighborList" :index="'1-1-'+item.id" key>{{item.neighbor_name}}</el-menu-item>
      </el-submenu>
      <el-menu-item index="1-2">资讯分类管理</el-menu-item>
    </el-submenu>
    <router-link :to="{path:'/media'}">
      <el-menu-item index="2"><i class="el-icon-menu"></i>媒体库</el-menu-item>
    </router-link>
    <el-menu-item index="3"><i class="el-icon-setting"></i>导航三</el-menu-item>
  </el-menu>
</div>
</template>

<script>
export default {
  data() {
    return {
      neighborList: [],
      // currentUserData: JSON.parse(sessionStorage.getItem('userData')) || {}
      currentUserData: {
        user_role_id: 99,
        user_neighbor_id: 6,
      }
    }
  },
  methods: {
    handleSelect(index, indexPath) {
      let re = /-(\d+)$/g
      let matchArr = re.exec(index)
      if (matchArr != null) {
        var selectNeighborId = matchArr[1]
      }
      this.$router.push({
        path: '/neighbor/' + selectNeighborId,
        query: {
          neighborIdentify: escape('加密' + selectNeighborId + '标识')
        },
      })
      // console.log(index, indexPath)
    },
    handleOpen() {
      console.log('open')
    },
    handleClose() {
      console.log('close')
    },
    handlePermission(val) {
      let $this = this
      if (50 <= this.currentUserData.user_role_id && this.currentUserData.user_role_id < 99) { // 说明是普通管理员以上的权限,但是非超级管理员
        this.neighborList = val.filter(function(value, index, arr) {
          return value.id == $this.currentUserData.user_neighbor_id
        })
        console.log(this.neighborList)
      } else if (this.currentUserData.user_role_id == 99) {
        this.neighborList = val
      } else {
        this.neighborList = Array()
      }
    }
  },
  created() {
    let $this = this
    jQuery.ajax({
      type: 'GET',
      url: 'http://dq.demo.kaensoft.com/pzqy/xk-api/pzqy/v1/neighbor',
      data: {},
      success(res) {
        if (res.erron == 0) {
          $this.neighborList = res.data
          $this.handlePermission($this.neighborList)
        }
        // console.log(res)
      },
      error(error) {
        console.log(error);
      }
    })
  }
}
</script>

<style>

</style>
