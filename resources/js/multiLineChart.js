import { mergedOptionsWithJsonConfig } from './helpers'

const multiLineChart = () => {
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

            const title = component.lineChartModel.title;
            const animated = component.lineChartModel.animated || false;
            const dataLabels = component.lineChartModel.dataLabels || {};
            const data = component.lineChartModel.data;
            const onPointClickEventName = component.lineChartModel.onPointClickEventName;
            const sparkline = component.lineChartModel.sparkline;
            const jsonConfig = component.lineChartModel.jsonConfig;

            const series = Object.keys(data).map(key => {
                return {
                    name: key,
                    data: data[key].map(item => item.value),
                }
            })

            const categories = component.lineChartModel.xAxis.categories.length > 0
                ? component.lineChartModel.xAxis.categories
                : data[series[0].name].map(item => item.title)

            const options = {
                series: series,

                chart: {
                    type: 'line',
                    height: '100%',

                    ...sparkline,

                    zoom: { enabled: false },

                    toolbar: { show: false },

                    animations: { enabled: animated },

                    events: {
                        markerClick: function(event, chartContext, { seriesIndex, dataPointIndex }) {
                            if (!onPointClickEventName) {
                                return
                            }

                            const point = data[series[seriesIndex].name][dataPointIndex]
                            component.call('onPointClick', point)
                        }
                    }
                },

                dataLabels: dataLabels,

                stroke: component.lineChartModel.stroke || {},

                title: {
                    text: title,
                    align: 'center'
                },

                xaxis: {
                    labels: component.lineChartModel.xAxis.labels,
                    categories: categories,
                },

                yaxis: component.lineChartModel.yAxis || {},

                theme: component.lineChartModel.theme || {},
            };

            const colors = component.lineChartModel.colors;

            if (colors && colors.length > 0) {
                options['colors'] = colors
            }

            this.chart = new ApexCharts(this.$refs.container, mergedOptionsWithJsonConfig(options, jsonConfig));
            this.chart.render();
        }
    }
}

export default multiLineChart
