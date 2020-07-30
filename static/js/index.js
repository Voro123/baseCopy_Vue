new _Vue({
  el: 'container',
  data: {
    times: 1,
    test1: 2,
    test2: 3
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
