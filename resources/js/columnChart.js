import { mergedOptionsWithJsonConfig } from './helpers'

const columnChart = () => {
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

            const title = component.columnChartModel.title
            const animated = component.columnChartModel.animated || false;
            const onColumnClickEventName = component.columnChartModel.onColumnClickEventName
            const dataLabels = component.columnChartModel.dataLabels || {};
            const sparkline = component.columnChartModel.sparkline;
            const legend = component.columnChartModel.legend
            const grid = component.columnChartModel.grid;
            const columnWidth = component.columnChartModel.columnWidth;
            const horizontal = component.columnChartModel.horizontal;
            const jsonConfig = component.columnChartModel.jsonConfig;

            const data = component.columnChartModel.data;
            const series = [{
                name: title,
                data: data.map(item => item.value)
            }]

            const options = {
                series: series,

                chart: {
                    type: 'bar',
                    height: '100%',

                    ...sparkline,

                    toolbar: { show: false },

                    animations: { enabled: animated },

                    events: {
                        dataPointSelection: function(event, chartContext, config) {
                            if (!onColumnClickEventName) {
                                return
                            }

                            const { dataPointIndex } = config
                            const column = data[dataPointIndex]
                            component.call('onColumnClick', column)
                        },
                    }
                },

                colors: data.map(item => item.color),

                labels: {
                    style: {
                        colors: data.map(item => item.color),
                    },
                },

                legend: legend,

                grid: grid,

                plotOptions: {
                    bar: {
                        horizontal: horizontal,
                        columnWidth: `${columnWidth}%`,
                        distributed: true,
                    },
                },

                dataLabels: dataLabels,

                xaxis: {
                    categories: data.map(item => item.title),
                },

                yaxis: {
                    title: {
                        text: title,
                    }
                },

                fill: {
                    opacity: component.columnChartModel.opacity || 0.5
                },

                theme: component.columnChartModel.theme || {},

                tooltip: {
                    y: {
                        formatter: function(value, series) {
                            return data[series.dataPointIndex].extras.tooltip || value;
                        }
                    }
                },

            };

            const colors = component.columnChartModel.colors;

            if (colors && colors.length > 0) {
                options['colors'] = colors
            }

            this.chart = new ApexCharts(this.$refs.container, mergedOptionsWithJsonConfig(options, jsonConfig));
            this.chart.render();
        }
    }
}

export default columnChart
