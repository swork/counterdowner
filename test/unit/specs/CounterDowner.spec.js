import Vue from 'vue'
import CounterDowner from '@/components/CounterDowner'

jest.useFakeTimers()

const timeInFuture = function (base, wdhms) {
  const sprintf = require("sprintf-js").sprintf
  const res = base + wdhms[0]*(1000*60*60*24*7) + wdhms[1]*(1000*60*60*24) + wdhms[2]*(1000*60*60) + wdhms[3]*(1000*60) + wdhms[4]*1000
  return res
}

const timeToNext = function (base, ui) {
  return CounterDowner.sUnitFactors[ui] - (base % CounterDowner.sUnitFactors[ui])
}

const gNow = Date.now()

const situations = [
  { // Default props (2 values starting with days)
    props: {
      // tuple is weeks, days, hours, minutes, seconds.
      target: new Date(timeInFuture(gNow, [1,2,3,4,5])).toISOString()
    },
    render: '9 days, 3 hours',
    timeout: timeToNext(gNow, 2)
  },
  { // Default props (2 values starting with days) but zero days
    props: {
      // tuple is weeks, days, hours, minutes, seconds.
      target: new Date(timeInFuture(gNow, [0,0,3,4,5])).toISOString()
    },
    render: '3 hours, 4 minutes',
    timeout: timeToNext(gNow, 1)
  },
  { // Default props (2 values starting with days) but zero days and hours
    props: {
      // tuple is weeks, days, hours, minutes, seconds.
      target: new Date(timeInFuture(gNow, [0,0,0,4,5])).toISOString()
    },
    render: '4 minutes, 5 seconds',
    timeout: timeToNext(gNow, 0)
  },
  { // Default props (2 values starting with days) but zero days, hours and minutes
    props: {
      // tuple is weeks, days, hours, minutes, seconds.
      target: new Date(timeInFuture(gNow, [0,0,0,0,1])).toISOString()
    },
    render: '0 minutes, 1 second',
    timeout: timeToNext(gNow, 0)
  },
  { // 3 values starting with days, but zero days, hours and minutes
    props: {
      // tuple is weeks, days, hours, minutes, seconds.
      target: new Date(timeInFuture(gNow, [0,0,0,0,1])).toISOString(),
      cascade: 3
    },
    render: '0 hours, 0 minutes, 1 second',
    timeout: timeToNext(gNow, 0)
  },
  { // One week
    props: {
      // tuple is weeks, days, hours, minutes, seconds.
      target: new Date(timeInFuture(gNow, [1,0,0,0,0])).toISOString(),
      cascade: 1,
      resolution: 'week'
    },
    render: '1 week',
    timeout: timeToNext(gNow, 4)
  },
  {
    props: {
      target: new Date(timeInFuture(gNow, [1,0,0,0,0])).toISOString(),
      cascade: 2,
      resolution: 'week'
    },
    render: '1 week, 0 days',
    timeout: timeToNext(gNow, 3)
  },
  {
    props: {
      target: new Date(timeInFuture(gNow, [2,3,4,5,6])).toISOString(),
      cascade: 1,
      resolution: 'week'
    },
    render: '2 weeks',
    timeout: timeToNext(gNow, 4)
  },
  {
    props: {
      target: new Date(timeInFuture(gNow, [0,1,2,3,4])).toISOString(),
      cascade: 1,
      resolution: 'week'
    },
    render: '1 day',
    timeout: timeToNext(gNow, 3)
  },
  {
    props: {
      target: new Date(timeInFuture(gNow, [0,0,1,1,1])).toISOString(),
      cascade: 2,
      resolution: 'week'
    },
    render: '1 hour, 1 minute',
    timeout: timeToNext(gNow, 1)
  },
  {
    props: {
      target: new Date(timeInFuture(gNow, [1,0,0,0,0])).toISOString(),
      cascade: 5,
      resolution: 'week'
    },
    render: '1 week, 0 days, 0 hours, 0 minutes, 0 seconds',
    timeout: timeToNext(gNow, 0)
  },
  {
    props: {
      target: new Date(timeInFuture(gNow, [1,2,3,4,5])).toISOString(),
      cascade: 3,
      resolution: 'week'
    },
    render: '1 week, 2 days, 3 hours',
    timeout: timeToNext(gNow, 2)
  },
  { // report weeks as days
    props: {
      target: new Date(timeInFuture(gNow, [1,2,3,4,5])).toISOString(),
      cascade: 3,
      resolution: 'day'
    },
    render: '9 days, 3 hours, 4 minutes',
    timeout: timeToNext(gNow, 1)
  },
  { // error: cascade goes past seconds
    props: {
      target: new Date(timeInFuture(gNow, [1,2,3,4,5])).toISOString(),
      cascade: 4,
      resolution: 'hour'
    },
    render: '219 hours, 4 minutes, 5 seconds',
    timeout: timeToNext(gNow, 0)
  },
  { // l10n: minutes as "blippies"
    props: {
      target: new Date(timeInFuture(gNow, [1,2,3,4,5])).toISOString(),
      cascade: 4,
      resolution: 'hour',
      minutes: 'blippies'
    },
    render: '219 hours, 4 blippies, 5 seconds',
    timeout: timeToNext(gNow, 0)
  }
]

describe('CounterDowner.vue', () => {
  it('should handle various inputs correctly', () => {
    var did1 = false
    const Constructor = Vue.extend(CounterDowner)
    for (var i in situations) {
      const situation = situations[i]
      situation.props.nowForTesting = gNow // override actual clock in component
      // console.log(gNow, situation)
      const vm = new Constructor({
        propsData: situation.props
      }).$mount()
      expect(vm.value_text)
        .toEqual(situation.render)
      expect(vm.value_timeout)
        .toEqual(situation.timeout)
      jest.clearAllTimers()
      did1 = true
    }

    expect(did1)
      .toEqual(true)
  })
})
