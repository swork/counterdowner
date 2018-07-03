<template>
  <div id="app">
    <!-- id matches test assertions -->
    <p>With implicit defaults: <CounterDowner id="cd-defaults" target="2018-10-20T18:00:00" /></p>
    <p>In weeks: <counter-downer id="cd-week" target="2018-10-20T18:00:00" resolution="week" /></p>
    <p>Cascade 4: <counter-downer id="cd-week4" target="2018-10-20T18:00:00" resolution="week" cascade=4 /></p>
    <p>Soon: <counter-downer id="cd-soon" target="2018-07-02T18:00:00" resolution="week" /></p>
  </div>
</template>

<script>
import CounterDowner from './components/CounterDowner'

export default {
  name: 'App',
  components: {
    CounterDowner
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
