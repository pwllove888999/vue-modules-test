<template>
<div id="app">
  <!-- <img src="./assets/logo.png">
    <h1></h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul> -->
  <v-header></v-header>
  <div class="menu-main">
    <v-menu class="menu"></v-menu>
    <router-view name="main" class="main"></router-view>
  </div>
</div>
</template>

<script>
import Header from './view/header/index.vue'
import Menu from './view/menu/index.vue'
export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    'vHeader': Header,
    'vMenu': Menu
  }
}
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  font-family: "Microsoft YaHei", arial;
  font-size: 14px;
  color: #333;
}

a {
  text-decoration: none;
}

ul {
  margin: 0px;
  padding: 0px;
  list-style: none;
}

#app {
  width: 100%;
  height: 100%;
}

.menu-main {
  position: relative;
  padding-top: 60px;
  min-height: 100%;
  box-sizing: border-box;
}

.menu {
  position: absolute;
  bottom: 0;
  top: 60px;
  width: 160px;
  background: #eef1f6;
}

.main {
  /*margin-left: 160px;
  min-height: 100%;*/
  position: absolute;
  bottom: 0;
  left: 160px;
  right: 0;
  top: 60px;
  /*background: #eef1f6;*/
}


/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}*/
</style>
