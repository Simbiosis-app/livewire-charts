import {mergedOptionsWithJsonConfig} from './helpers'

const pieChart = () => {
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

            const title = component.pieChartModel.title;
            const animated = component.pieChartModel.animated || false
            const dataLabels = component.pieChartModel.dataLabels || {}
            const onSliceClickEventName = component.pieChartModel.onSliceClickEventName
            const data = component.pieChartModel.data
            const sparkline = component.pieChartModel.sparkline
            const type = component.pieChartModel.type
            const jsonConfig = component.pieChartModel.jsonConfig;

            const options = {
                series: data.map(item => item.value),

                chart: {
                    height: '100%',
                    type: type,

                    ...sparkline,

                    animations: { enabled: animated },

                    events: {
                        dataPointSelection: function(event, chartContext, config) {
                            if (!onSliceClickEventName) {
                                return
                            }

                            const { dataPointIndex } = config
                            const slice = data[dataPointIndex]
                            component.call('onSliceClick', slice)
                        },
                    }
                },

                labels: data.map(item => item.title),

                dataLabels: dataLabels,

                colors: data.map(item => item.color),

                fill: {
                    opacity: component.pieChartModel.opacity,
                },

                title: {
                    text: title,
                    align: 'center',
                },

                responsive: [
                    {
                        breakpoint: 600,
                        options: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                ],

                legend: component.pieChartModel.legend || {},

                theme: component.pieChartModel.theme || {},

                tooltip: {
                    y: {
                        formatter: function(value, series) {
                            return data[series.dataPointIndex].extras.tooltip || value;
                        }
                    }
                },
            };

            const colors = component.pieChartModel.colors;

            if (colors && colors.length > 0) {
                options['colors'] = colors
            }

            this.chart = new ApexCharts(this.$refs.container, mergedOptionsWithJsonConfig(options, jsonConfig));
            this.chart.render();
        }
    }
}

export default pieChart
