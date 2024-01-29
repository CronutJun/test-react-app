/** ***********************************************************************
 * @ 컴퍼넌트    : CEdit
 * @ 컴퍼넌트설명 : 금액, 이율 입력처리 컴퍼넌트 ('-' 키로 부호 토글)
 * @ 파일명     : currencyEdit.tsx
 * @ 작성자     : KDJ (dongjun.kim@bankwareglobal.com)
 * @ 작성일     : 2024-01-24
 ************************** 수정이력 ****************************************
 * 날짜                    작업자                 변경내용
 *_________________________________________________________________________
 * 2024-01-24             KDJ                  최초작성
 ************************************************************************ */
 import React, { useRef, useState, useEffect } from 'react';

function CEdit(props) {
  console.log(props)
  const mfd = props.minFractDigits
  const mdl = props.maxDecLength
  const [textVal, setTextVal] = useState(Number("0").toLocaleString('en-US',{minimumFractionDigits: mfd}))
  const [selR, setSelR] = useState({selS: 0, selE: 0})
  const inputRef = useRef(); 

  useEffect(() => {
    inputRef.current.setSelectionRange(selR.selS, selR.selE)
  })
  
  const getFormattedValue = (value) => {
    const fmtVal = Number(value.replace(/,/gi, '')).toLocaleString('en-US',{minimumFractionDigits: mfd})
    const fmtLen = fmtVal.length 
    return {fmtVal, fmtLen}
  }
  const ceditChange = (event) => {
    // console.log("SelStart = ", event.target.selectionStart, " SelEnd = ", event.target.selectionEnd, "Value = ", event.target.value)
    const selS = event.target.selectionStart
    const selE = event.target.selectionEnd
    let fmtObj = {fmtVal: "", fmtLen: 0}
    const dotPos = event.target.value.indexOf(".")
    // console.log("dotPos = ", dotPos, " selE = ", selE, " value length = ", event.target.value.length)
    if (mfd > 0 && dotPos > -1 && selE > dotPos
    && (event.target.value.length - dotPos) > mfd) {
        fmtObj = getFormattedValue((event.target.value.substring(0, selE) + event.target.value.substring(selE + 1)).substring(0, dotPos + mfd + 1))
        setSelR({selS, selE})
      }
    else {
      fmtObj = getFormattedValue(event.target.value)
      if (mfd > 0 && selE > dotPos) {
        // console.log("prev char = ", event.target.value.substring(selE-1, selE))
        if (event.target.value.substring(selE-1, selE) === ".") setSelR({selS: selS - 1, selE: selE - 1})
        else setSelR({selS, selE})
      }
      else setSelR({selS: selS + (fmtObj.fmtLen - event.target.value.length), selE: selE + (fmtObj.fmtLen - event.target.value.length)})
    }
    setTextVal(fmtObj.fmtVal)
  }
  const ceditDown = (event) => {
    console.log("KeyDown = ", event.keyCode)
    const value = event.target.value.replace(/,/gi, '')
    if (event.keyCode === 189) {
      const signVal = (Number(value) * -1).toLocaleString('en-US',{minimumFractionDigits: mfd})
      if (signVal.indexOf("-") >= 0) setSelR({selS: event.target.selectionStart+1, selE: event.target.selectionEnd+1})
      else setSelR({selS: event.target.selectionStart-1, selE: event.target.selectionEnd-1})
      setTextVal(signVal)
      event.preventDefault()
      return
    }
    if (event.keyCode === 8) {
      if (event.target.value.substring(event.target.selectionEnd-1, event.target.selectionEnd) === ".") {
        setSelR({selS: event.target.selectionStart - 1, selE: event.target.selectionEnd - 1})
        setTextVal(event.target.value)
        event.preventDefault()
        return
      }
    }
    if (event.keyCode !== 8 && event.keyCode !== 9 && event.keyCode !== 190
    && (event.keyCode < 37 || event.keyCode > 40)
    && (event.keyCode < 48 || event.keyCode > 57)) {
      event.preventDefault()
      return
    }
    if (event.keyCode === 190 && (mfd === 0 || event.target.value.indexOf(".") >= 0)) event.preventDefault()
    if (mdl > 0 
    && event.keyCode >= 48 && event.keyCode <= 57
    && (event.target.value.indexOf(".") < 0 || (event.target.value.indexOf(".") >= 0 && event.target.selectionEnd <= event.target.value.indexOf("."))) 
    && value.split(".")[0].length >= mdl) event.preventDefault()
  }
  const ceditUp = (event) => {
    if (event.keyCode === 190 && mfd > 0 && event.target.value.indexOf(".") >= 0)
      event.target.setSelectionRange(event.target.value.indexOf(".") +1, event.target.value.indexOf(".") +1)
  } 
 
  return <input
    type='text'
    ref={inputRef}
    value={textVal}
    style={{textAlign: 'right'}}
    onChange={ceditChange}
    onKeyDown={ceditDown}
    onKeyUp={ceditUp}
    />

}

export default CEdit