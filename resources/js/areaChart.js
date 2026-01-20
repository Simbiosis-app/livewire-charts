import { mergedOptionsWithJsonConfig } from './helpers'

const areaChart = () => {
    return {
        chart: null,

        init() {
            setTimeout(() => {
                this.drawChart(this.$wire)
            }, 0)
        },

        drawChart(component) {
            if (this.chart) {
                this.chart.destroy()
            }

            const title = component.areaChartModel.title;
            const animated = component.areaChartModel.animated || false;
            const dataLabels = component.areaChartModel.dataLabels || {};
            const onPointClickEventName = component.areaChartModel.onPointClickEventName
            const data = component.areaChartModel.data;
            const sparkline = component.areaChartModel.sparkline;
            const jsonConfig = component.areaChartModel.jsonConfig;

            const categories = component.areaChartModel.xAxis.categories.length > 0
                ? component.areaChartModel.xAxis.categories
                : data.map(item => item.title)
            ;

            var options = {
                series: [{
                    name: title,
                    data: data.map(item => item.value)
                }],
                chart: {
                    type: 'area',
                    height: '100%',

                    ...sparkline,

                    zoom: { enabled: false },

                    toolbar: { show: false },

                    animations: { enabled: animated },

                    events: {
                        markerClick: function(event, chartContext, { dataPointIndex }) {
                            if (!onPointClickEventName) {
                                return
                            }

                            const point = data[dataPointIndex]
                            component.call('onPointClick', point)
                        }
                    }
                },

                dataLabels: dataLabels,

                colors: [component.areaChartModel.color || '#2E93fA'],

                stroke: component.areaChartModel.stroke || {},

                title: {
                    text: title,
                    align: 'center'
                },

                labels: data.map(item => item.title),

                xaxis: {
                    labels: component.areaChartModel.xAxis.labels,
                    categories: categories,
                },

                yaxis: component.areaChartModel.yAxis || {},

                grid: {
                    padding: {
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                    }
                },

                theme: component.areaChartModel.theme || {},

            };

            this.chart = new ApexCharts(this.$refs.container, mergedOptionsWithJsonConfig(options, jsonConfig));
            this.chart.render();
        }
    }
}

export default areaChart
