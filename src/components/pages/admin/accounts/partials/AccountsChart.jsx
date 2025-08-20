import React, { useEffect } from 'react'
import Chart from "react-apexcharts";
import { useSelector } from 'react-redux';

export const AccountsChart = () => {

    const darkMode = useSelector((state) => state.darkMode);
    const users = useSelector((state) => state.users)

    const countUsersPerMonth = () => {
        const monthlyCounts = new Array(12).fill(0); // Un array para cada mes del año, inicializado en 0
        users.forEach(user => {
            const date = new Date(user.createdAt);
            if (!isNaN(date.getTime())) { // Comprueba si la fecha es válida
                const month = date.getMonth(); // Enero es 0, diciembre es 11
                monthlyCounts[month]++;
            }
        });
        return monthlyCounts;
    };

    const options = {
        series: [{
            name: 'Accounts',
            data: countUsersPerMonth()
        }],
        chart: {
            height: 350,
            type: 'bar',
            background: 'transparent'
        },
        plotOptions: {
            bar: {
                borderRadius: 0,
                dataLabels: {
                    position: 'top',
                },
            }
        },
        xaxis: {
            categories: [
                "Jan", 
                "Feb", 
                "Mar", 
                "Apr", 
                "May", 
                "Jun", 
                "Jul", 
                "Aug", 
                "Sep", 
                "Oct", 
                "Nov", 
                "Dec"
            ],
            position: 'bottom',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
            tooltip: {
                enabled: true,
            }
        },
        theme: {
            mode: darkMode ? 'dark' : 'light',
        },
    };
    
    return (
        <Chart
            options={options} 
            series={options.series} 
            type="bar"
            width="100%" 
            height="250"
        />
    )
}
