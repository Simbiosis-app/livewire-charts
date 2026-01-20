import { mergedOptionsWithJsonConfig } from './helpers'

const multiColumnChart = () => {
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
            const stacked = component.columnChartModel.isStacked;
            const animated = component.columnChartModel.animated;
            const onColumnClickEventName = component.columnChartModel.onColumnClickEventName
            const dataLabels = component.columnChartModel.dataLabels;
            const sparkline = component.columnChartModel.sparkline;
            const legend = component.columnChartModel.legend
            const grid = component.columnChartModel.grid;
            const columnWidth = component.columnChartModel.columnWidth;
            const horizontal = component.columnChartModel.horizontal;
            const jsonConfig = component.columnChartModel.jsonConfig;

            const data = component.columnChartModel.data;
            const series = Object.keys(data)
                .map(seriesName => ({
                    name: seriesName,
                    data: data[seriesName].map(item => item.value)
                }))

            const categories = component.columnChartModel.xAxis.categories.length > 0
                ? component.columnChartModel.xAxis.categories
                : data[series[0].name].map(item => item.title)
            ;

            const options = {
                series: series,

                chart: {
                    type: 'bar',
                    height: '100%',
                    stacked: stacked,

                    ...sparkline,

                    toolbar: { show: false },

                    animations: { enabled: animated },

                    events: {
                        dataPointSelection: function(event, chartContext, {seriesIndex, dataPointIndex}) {
                            if (!onColumnClickEventName) {
                                return
                            }

                            const column = data[series[seriesIndex].name][dataPointIndex]
                            component.call('onColumnClick', column)
                        },
                    }
                },

                legend: legend,

                grid: grid,

                plotOptions: {
                    bar: {
                        horizontal: horizontal,
                        columnWidth: `${columnWidth}%`,
                    },
                },

                dataLabels: dataLabels,

                xaxis: {
                    categories: categories,
                },

                yaxis: {
                    title: {
                        text: title,
                    }
                },

                fill: {
                    opacity: component.columnChartModel.opacity,
                },

                theme: component.columnChartModel.theme || {},

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

export default multiColumnChart
