<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts';
  require('echarts/theme/macarons'); // echarts 主题
  import { debounce } from 'utils';

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '350px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      xAxisData: {
        type: Array,
        default: function () {
          return [];
        }
      },
      seriesData: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        chart: null
      };
    },
    mounted() {
      this.initChart();
      if (this.autoResize) {
        this.__resizeHanlder = debounce(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHanlder)
      }

      // 监听侧边栏的变化
      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      if (this.autoResize) {
        window.removeEventListener('resize', this.__resizeHanlder)
      }

      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons');
        this.chart.setOption({
          xAxis: {
            data: this.xAxisData,
            boundaryGap: false
          },
           grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },

          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          yAxis: {},
          series: [{
            name: this.seriesData[0].name,
            smooth: true,
            type: 'line',
            data: this.seriesData[0].data,
            animationDuration: 2000,
            animationEasing: 'quadraticOut'
          },{
            name: this.seriesData[1].name,
            smooth: true,
            type: 'line',
            data: this.seriesData[1].data,
            animationDuration: 2000,
            animationEasing: 'quadraticOut'
          },{
            name: this.seriesData[2].name,
            smooth: true,
            type: 'line',
            data: this.seriesData[2].data,
            animationDuration: 2000,
            animationEasing: 'quadraticOut'
          }]
        })
      }
    }
}
</script>
