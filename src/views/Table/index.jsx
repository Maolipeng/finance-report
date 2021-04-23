import React, { useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, Input } from 'antd'
import Upload from '@/components/Upload'
import { export_json_to_excel } from '@/utils/export2Excel'
import { parseTime } from '@/utils'

import { TableStyle } from './style.js'
let orginData = []
// eslint-disable-next-line
let orginColumns = []
const Table = (props) => {
  const [exportName, setExportName] = useState('export-list')
  const [tableData, setTableData] = useState(null)
  const [columns, setColumns] = useState([])
  const [reqParams] = useState('')
  const [columnsStateMap, setColumnsStateMap] = useState({})
  const uploadSuccessFn = (excelData) => {
    console.log('excelData1', excelData)
    const { header, results } = excelData
    const headerColumns = header.map((item) => ({
      title: item,
      dataIndex: item,
      copyable: true,
    }))
    console.log('headerColumns', headerColumns)
    orginColumns = headerColumns
    setColumns(headerColumns)
    // const tableList = results.map(d => ({
    //   ...d,
    //   key: d['合同编号']
    // }))
    orginData = results

    setTableData(results)
  }
  const beforeUpload = (files) => {
    console.log('files', files)
    return true
  }
  const requestList = (params) => {
    console.log('params', params)
    const data = filterDataFn(params)

    return new Promise((resolve, reject) => {
      console.log('tableData', tableData)
      setTimeout(() => {
        resolve({
          data,
          success: true,
        })
      }, 1000)
    })
  }
  const postData = (data) => {
    setTableData(data)
    return data
  }
  const filterDataFn = (params) => {
    const paramList = Object.keys(params)
    return orginData.filter((item) => {
      return paramList.every((p) => {
        if (p === 'current' || p === 'pageSize') {
          return true
        } else {
          return params[p] === item[p]
        }
      })
    })
  }
  const exportExcel = () => {
    const headerList = columns.map((item) => item.title)
    const HideColumns = Object.keys(columnsStateMap).map(
      (item) => headerList[item]
    )
    console.log('HideColumns', HideColumns)
    const tHeader = headerList.filter((item) => !HideColumns.includes(item))
    const list = tableData
    const data = formatJson(tHeader, list)
    export_json_to_excel({
      header: tHeader,
      data,
      filename: exportName,
      autoWidth: true,
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
  const setColumnsShow = (map) => {
    console.log('map', map)
    setColumnsStateMap(map)
  }
  return (
    <TableStyle>
      <h1 className="header">Report Excel Tool</h1>
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
          disabled={!(tableData && tableData.length)}
          onClick={exportExcel}
        >
          导出Excel
        </Button>
      </div>
      <div className="table-list">
        {tableData && (
          <ProTable
            className="App"
            size="small"
            columns={tableData && columns}
            // defaultData={tableData}
            rowKey="合同编号"
            params={reqParams}
            columnsStateMap={columnsStateMap}
            onColumnsStateChange={(map) => setColumnsShow(map)}
            request={requestList}
            postData={postData}
          ></ProTable>
        )}
      </div>
    </TableStyle>
  )
}

export default Table
