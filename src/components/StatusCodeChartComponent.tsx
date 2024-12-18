import React, { useState, useEffect } from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { StatusCodeBucket } from '@/api/metric/schema/GetHTTPStatusCodeResponse.ts'

const options: ApexOptions = {
  chart: {
    type: 'pie'
  },
  labels: [],
  colors: ['#2DB400', '#ffc107', '#dc3545'],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 500
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ]
}

interface StatusCodeChartComponentProps {
  statusCodeMetricData: StatusCodeBucket[]
}

const StatusCodeChartComponent: React.FC<StatusCodeChartComponentProps> = ({ statusCodeMetricData }) => {
  const [series, setSeries] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {
    if (statusCodeMetricData) {
      const newSeries = statusCodeMetricData.map(item => item.count)
      const newLabels = statusCodeMetricData.map(item => item.statusCode)

      setSeries(newSeries)
      setLabels(newLabels)
    }
  }, [statusCodeMetricData])

  return <ReactApexChart options={{ ...options, labels }} series={series} type="pie" width={400} />
}

export default StatusCodeChartComponent
