new _Vue({
  el: 'container',
  data: {
    times: 0,
    test1: 1,
    test2: 2
  },
  methods: {
    sayhi () {
      console.log('hello word')
    },
    say (str) {
      console.log(str)
    },
    printTimes () {
      console.log(this.times)
    },
    getThis () {
      console.log(this)
    }
  }
})
