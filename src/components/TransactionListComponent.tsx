import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import type { TableProps } from 'antd'
import { DatePicker, Divider, Skeleton, Space, Table } from 'antd'
import moment from 'moment'
import { AbnormalTag, HttpStatusTag } from './Tag.tsx'
import {
  GetTransactionListResponse,
  PagingKey,
  TransactionListItemResponse
} from '@/api/trace/schema/GetTransactionListResponse.ts'
import { RangePickerProps } from 'antd/es/date-picker'
import { Dayjs } from 'dayjs'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'

const { RangePicker } = DatePicker

type ColumnsType<T extends object> = TableProps<T>['columns']

const columns: ColumnsType<TransactionListItemResponse> = [
  {
    title: 'TRACE ID',
    dataIndex: 'traceId',
    key: 'traceId'
  },
  {
    title: 'API URL',
    dataIndex: 'endPoint',
    key: 'endPoint'
  },
  {
    title: 'SERVICE NAME',
    dataIndex: 'serviceName',
    key: 'serviceName'
  },
  {
    title: 'RESPONSE TIME',
    dataIndex: 'duration',
    key: 'duration',
    render: (responseTime: number) => `${responseTime} ms`
  },
  {
    title: 'DATE',
    dataIndex: 'startDateTime',
    key: 'startDateTime',
    render: (dateString: string) => moment(dateString).format('YYYY.MM.DD HH:mm:ss')
  },
  {
    title: 'STATUS',
    dataIndex: 'statusCode',
    key: 'statusCode',
    render: (status: number) => <HttpStatusTag status={status} />
  },
  {
    title: '',
    key: 'abnormal',
    dataIndex: 'abnormal',
    render: (isAnomaly: boolean) => <AbnormalTag abnormal={isAnomaly} />
  }
]

interface TransactionListComponentProps {
  transactionListData: GetTransactionListResponse | undefined
  setPagingKey: Dispatch<SetStateAction<PagingKey | undefined>>
  setTransactionCount: Dispatch<SetStateAction<number>>
}

const TransactionListComponent: React.FC<TransactionListComponentProps> = ({
  transactionListData,
  setPagingKey,
  setTransactionCount
}) => {
  const totalCount = transactionListData?.totalCount ?? 0

  const [data, setData] = useState<TransactionListItemResponse[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (transactionListData?.results) {
      const newTransactions: TransactionListItemResponse[] = transactionListData.results ?? []
      setData(prevData => [...prevData, ...newTransactions])
      setTransactionCount(data.length)
    }
  }, [transactionListData])

  const onRowClick = (traceId: string) => {
    navigate(`/transactions/${traceId}`)
  }

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: 'auto'
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={() => {
          setPagingKey(transactionListData?.afterKey)
        }}
        hasMore={data.length < totalCount}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>마지막 데이터 입니다 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <Table<TransactionListItemResponse>
          columns={columns}
          pagination={false}
          onRow={record => {
            return {
              onClick: () => onRowClick(record.traceId)
            }
          }}
          dataSource={data}
        />
      </InfiniteScroll>
    </div>
  )
}

export interface TransactionRange {
  startDate?: Dayjs
  endDate?: Dayjs
}

interface TransactionListWithDateComponentProps extends TransactionListComponentProps {
  transactionRange: TransactionRange
  setTransactionRange: Dispatch<SetStateAction<TransactionRange>>
}

const TransactionListWithDateComponent: React.FC<TransactionListWithDateComponentProps> = props => {
  const { transactionListData, transactionRange, setTransactionRange, setPagingKey, setTransactionCount } = props

  const onOk = (value: RangePickerProps['value']) => {
    if (!value || !value[0] || !value[1]) {
      alert('값을 입력해주세요')
      return
    }

    const [startDate, endDate] = value

    if (startDate.isAfter(endDate)) {
      alert('시작일이 종료일을 넘을 수 없습니다')
      return
    }

    setTransactionRange({ startDate, endDate })
  }

  return (
    <Space direction="vertical" size={15} style={{ width: '100%' }}>
      <RangePicker showTime value={[transactionRange.startDate, transactionRange.endDate]} onOk={onOk} />
      <TransactionListComponent
        transactionListData={transactionListData}
        setPagingKey={setPagingKey}
        setTransactionCount={setTransactionCount}
      />
    </Space>
  )
}

export { TransactionListComponent, TransactionListWithDateComponent }
