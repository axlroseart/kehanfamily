<template>
  <div class="progress">
    <div class="progress__top">
      <div class="album-info" v-if="currentTrack">
        <div class="album-info__name">{{ currentTrack.artist }}</div>
        <div class="album-info__track">{{ currentTrack.name }}</div>
      </div>
      <div class="progress__duration">{{ duration }}</div>
    </div>
    <div class="progress__bar" @click="test">
      <div class="progress__current" :style="{ width : barWidth }"></div>
    </div>
    <div class="progress__time">{{ currentTime }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['currentTrack', 'duration', 'barWidth', 'currentTime', 'bgm'],
  methods: {
    test() {
      // console.log(this.$parent)
      // this.$emit('changeType', true)
      // this.bgm.pause()
      // this.$parent.updateBar(e.pageX)
      // console.log('==>e: ', e)
      // this.$parent.clickProgress()
      // this.$emit('triggerSlider')
    }
  }
}
</script>

<style lang="css">
</style>