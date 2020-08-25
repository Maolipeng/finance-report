import React, { useState, useRef } from 'react'
import ProTable, { ProColumns } from '@ant-design/pro-table'
import { Button, Input } from 'antd'
import Upload from '@/components/Upload'
import { export_json_to_excel } from '@/utils/export2Excel'
import { parseTime } from '@/utils'

import { TableStyle } from './style.js'

const Table = (props) => {
  const [exportName, setExportName] = useState('export-list')
  const [tableData, setTableData] = useState([])
  const [columns, setColumns] = useState([])
  const [reqParams, setReqParams] = useState('')
  const uploadSuccessFn = (excelData) => {
    console.log('excelData1', excelData)
    const { header, results } = excelData
    const headerColumns = header.map((item) => ({
      title: item,
      dataIndex: item,
      copyable: true,
    }))
    console.log('headerColumns', headerColumns)
    setColumns(headerColumns)
    // const tableList = results.map(d => ({
    //   ...d,
    //   key: d['合同编号']
    // }))
    setTableData(results)
  }
  const beforeUpload = (files) => {
    console.log('files', files)
    return true
  }
  const requestList = () => {
    return new Promise((resolve, reject) => {
      console.log('tableData', tableData)
      setTimeout(() => {
        resolve({
          data: tableData,
          success: true,
        })
      }, 1000)
    })
  }
  const exportExcel = () => {
    const tHeader = columns.map((item) => item.title)
    const list = tableData
    const data = formatJson(tHeader, list)
    export_json_to_excel({
      header: tHeader,
      data,
    })
  }
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) =>
      filterVal.map((j) => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      })
    )
  }
  return (
    <TableStyle>
      <h1 className="header">报表工具</h1>
      <div className="upload-container">
        <Upload onSuccess={uploadSuccessFn} beforeUpload={beforeUpload} />
      </div>
      <div className="handle-area">
        导出文件名字：
        <Input
          value={exportName}
          style={{ width: '200px', marginRight: '100px' }}
          onChange={(e) => setExportName(e.target.value)}
        />
        <Button
          type="primary"
          disabled={!tableData.length}
          onClick={exportExcel}
        >
          导出Excel
        </Button>
      </div>
      <div className="table-list">
        {!!tableData.length && (
          <ProTable
            className="App"
            size="small"
            columns={columns}
            // defaultData={tableData}
            rowKey="合同编号"
            params={reqParams}
            request={requestList}
          ></ProTable>
        )}
      </div>
    </TableStyle>
  )
}

export default Table
