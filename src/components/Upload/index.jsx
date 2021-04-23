import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

import { Button } from 'antd'
import XLSX from 'xlsx'
import { UploadStyle } from './style.js'

const Upload = (props) => {
  const { beforeUpload, onSuccess } = props
  const [, setFileList] = useState([])
  const [, setExcelData] = useState({})
  const inputFileRef = useRef(null)
  const handleClick = () => {
    console.log('inputFileRef.current.files', inputFileRef.current.files)
    if (inputFileRef.current.files.length) {
      setFileList(inputFileRef.current.files)
      const rawFile = inputFileRef.current.files[0]
      upload(rawFile)
      // beforeUploadHook(inputFileRef.current.files)
    }
  }
  const handleUpload = () => {
    inputFileRef.current.click()
  }
  const readerData = (rawFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const header = getHeaderRow(worksheet)
        const results = XLSX.utils.sheet_to_json(worksheet)
        generateData({ header, results })
        resolve()
      }
      reader.readAsArrayBuffer(rawFile)
    })
  }
  const upload = (rawFile) => {
    inputFileRef.current.files = null
    if (beforeUpload) {
      readerData(rawFile)
      return
    }
    const before = beforeUpload(rawFile)
    if (before) {
      readerData(rawFile)
    }
    readerData(rawFile)
  }
  const getHeaderRow = (sheet) => {
    const headers = []
    const range = XLSX.utils.decode_range(sheet['!ref'])
    let C
    const R = range.s.r
    /* start in the first row */
    for (C = range.s.c; C <= range.e.c; ++C) {
      /* walk every column in the range */
      const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
      /* find the cell in the first row */
      let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
      if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
      headers.push(hdr)
    }
    return headers
  }
  const generateData = ({ header, results }) => {
    const excelData = {}
    excelData.header = header
    excelData.results = results
    console.log('excelData', excelData)
    setExcelData(excelData)
    onSuccess && onSuccess(excelData)
  }
  return (
    <UploadStyle>
      <input
        ref={inputFileRef}
        className="excel-upload-input"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleClick}
      />
      <div
        className="drop"
        // onDrop="handleDrop"
        // onDragover="handleDragover"
        // onDragenter="handleDragover"
      >
        Drop excel file here or
        <Button type="primary" onClick={handleUpload}>
          Browse
        </Button>
      </div>
    </UploadStyle>
  )
}

Upload.propTypes = {
  onSuccess: PropTypes.func,
  beforeUpload: PropTypes.func,
}

export default Upload
