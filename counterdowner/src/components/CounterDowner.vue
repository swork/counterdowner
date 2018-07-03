<template>
<div target="2018-12-17T03:24:00"
     weeks="weeks" week="week"
     days="days" day="day"
     hours="hours" hour="hour"
     minutes="minutes" minute="minute"
     seconds="seconds" second="second"
     resolution="second"
     cascade=1 >
  {{ value_text }}
</div>
</template>

<script>
// eslint-disable-next-line
var g_CounterDowner_sUnitIndices = {
  'second': 0,
  'seconds': 0,
  'minute': 1,
  'minutes': 1,
  'hour': 2,
  'hours': 2,
  'days': 3,
  'day': 3,
  'weeks': 4,
  'week': 4
}

// eslint-disable-next-line
var g_CounterDowner_sUnitFactors = {
  0: 1000,
  1: 1000 * 60,
  2: 1000 * 60 * 60,
  3: 1000 * 60 * 60 * 24,
  4: 1000 * 60 * 60 * 24 * 7
}

export default {
  name: 'CounterDowner',
  sUnitIndices: g_CounterDowner_sUnitIndices,
  sUnitFactors: g_CounterDowner_sUnitFactors,
  props: {
    target: {
      type: String,
      default: '2018-10-20T18:00:00'
    },
    weeks: {
      type: String,
      default: 'weeks'
    },
    week: {
      type: String,
      default: 'week'
    },
    days: {
      type: String,
      default: 'days'
    },
    day: {
      type: String,
      default: 'day'
    },
    hours: {
      type: String,
      default: 'hours'
    },
    hour: {
      type: String,
      default: 'hour'
    },
    minutes: {
      type: String,
      default: 'minutes'
    },
    minute: {
      type: String,
      default: 'minute'
    },
    seconds: {
      type: String,
      default: 'seconds'
    },
    second: {
      type: String,
      default: 'second'
    },
    resolution: {
      type: String,
      default: 'day'
    },
    cascade: {
      type: Number,
      default: 2
    },
    nowForTesting: {
      type: Number,
      default: 0 // non-zero for testing
    }
  },
  data: () => {
    return {
      targetSet: null,
      value_text: '',
      value_timeout: 0
    }
  },
  computed: {
    resolutionIndex: function () {
      var result = g_CounterDowner_sUnitIndices[this.resolution]
      if (result === undefined) {
        result = 0
      }
      return result
    }
  },
  methods: {
    setTarget: function (targetString) {
      this.targetSet = targetString
      // console.log('setTarget now:', this.targetSet)
    },
    ms_in_units: function (ui, ms) {
      var result = g_CounterDowner_sUnitFactors[ui] !== 0 ? Math.floor(ms / g_CounterDowner_sUnitFactors[ui]) : 0
      return result
    },
    indexUnit: function (index, plural) {
      var result
      switch (index) {
        case 0: result = (plural ? this.seconds : this.second); break
        case 1: result = (plural ? this.minutes : this.minute); break
        case 2: result = (plural ? this.hours : this.hour); break
        case 3: result = (plural ? this.days : this.day); break
        case 4: result = (plural ? this.weeks : this.week); break
        default: result = '(broken)'
      }
      return ' ' + result
    },
    reCalculate: function () { /* "not arrow" */
      var _now = this.nowForTesting
      if (_now === 0) {
        _now = Date.now()
      }
      const now = _now
      var lower = this.cascade <= 0 ? this.resolutionIndex : (this.resolutionIndex - this.cascade) + 1
      var s = []
      var i
      var didNonZero = false

      /* Target value (epoch time in ms) */
      if (this.targetSet === null) {
        this.setTarget(this.target)
      }
      var targ = (new Date(this.targetSet)).valueOf()

      var remain = (targ - now) > 0 ? (targ - now) : 0
      // console.log('targ:', targ, 'now:', now, 'remain:', remain)

      if (remain === 0) {
        this.value_text = '(past)'
        return
      }

      /* find coarsest N (this.cascade) values starting with a non-zero */
      for (i = this.resolutionIndex; i >= 0 && i >= lower; i--) {
        var u = this.ms_in_units(i, remain)
        // console.log('i:', i, 'lower:', lower, 'remain:', remain, 'u:', u)
        if (u === 0 && lower > 0 && !didNonZero) {
          lower -= 1
          continue
        }
        didNonZero = true
        s[s.length] = u + this.indexUnit(i, u !== 1)
        remain -= (u * g_CounterDowner_sUnitFactors[i])
      }

      this.value_text = s.join(', ')

      /* Pick next reCalculate time by finest value */
      var factor = g_CounterDowner_sUnitFactors[i + 1]
      this.value_timeout = factor - (now % factor)
      // console.log('CounterDowner.reCalculate by:', i + 1, 'is:', this.value_timeout)
      window.setTimeout(() => { this.reCalculate() }, this.value_timeout + 200)
    }
  },
  mounted: function () { /* "not arrow" */
    this.reCalculate()
  }
}
</script>

<style>

</style>
