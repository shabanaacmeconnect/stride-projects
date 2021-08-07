import { ChartType } from './overview.model';

const overviewBarChart: ChartType = {
    chart: {
        height: 290,
        type: 'bar',
        toolbar: {
            show: false,
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '14%',
            endingShape: 'rounded'
        }
    },
    dataLabels: {
        enabled: false
    },
    series: [{
        name: 'Overview',
        data: [42, 56, 40, 64, 26, 42, 56, 35, 62]
    }],
    yaxis: {
        title: {
            text: '% (Percentage)'
        }
    },
    xaxis: {
        labels: {
            rotate: -90
        },
        categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        title: {
            text: 'Week',
        }
    },
    colors: ['#556ee6'],
};

const donutChart: ChartType = {
    chart: {
        height: 320,
        type: 'donut',
    },
    series: [44, 55, 41, 17, 15],
    legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: -10
    },
    labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'],
    colors: ['#34c38f', '#556ee6', '#f46a6a', '#50a5f1', '#f1b44c'],
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                height: 240
            },
            legend: {
                show: false
            },
        }
    }],
};

const barChart: ChartType = {
    chart: {
        height: 350,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: true,
        }
    },
    dataLabels: {
        enabled: false
    },
    series: [{
        data: [380, 430, 450, 475, 550, 584, 780, 1100, 1220, 1365]
    }],
    colors: ['#34c38f'],
    xaxis: {
        // tslint:disable-next-line: max-line-length
        categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
    },
    grid: {
        borderColor: '#f1f1f1'
    },
};

const monthlyEarningChart: ChartType = {
    chart: {
        height: 130,
        type: 'bar',
        stacked: true,
        toolbar: {
            show: false
        },
        zoom: {
            enabled: true
        }
    },
    plotOptions: {
        bar: {
            horizontal: true,
            columnWidth: '15%',
            endingShape: 'rounded'
        },
    },
    dataLabels: {
        enabled: false
    },
    series: [{
        name: 'Series A',
        data: [44 ]
    },{
        name: 'Series B',
        data: [13 ]
    }, {
        name: 'Series C',
        data: [11 ]
    }],
    xaxis: {
        categories: ['Jan'],
    },
    colors: ['#556ee6', '#f1b44c', '#34c38f'],
    legend: {
        position: 'bottom',
    },
    fill: {
        opacity: 1
    },
    labels: ['Series A'],
};
export { overviewBarChart, donutChart, barChart, monthlyEarningChart };
