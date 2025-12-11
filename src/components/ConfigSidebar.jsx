import React, { useState } from 'react'
import CommonConfigPanel from './CommonConfigPanel'
import { X, Copy, Check } from 'lucide-react'
import './ConfigSidebar.css'

function ConfigSidebar({ isOpen, onClose, commonConfig, onConfigChange }) {
  const [copied, setCopied] = useState(false)

  const handleCopyConfig = () => {
    const configJson = JSON.stringify(commonConfig, null, 2)
    navigator.clipboard.writeText(configJson).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(err => {
      console.error('复制失败:', err)
    })
  }

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`config-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="header-title">
            <h2>通用配置</h2>
            <span className="header-subtitle">全局图表样式设置</span>
          </div>
          <div className="sidebar-actions">
            <button 
              className={`action-button ${copied ? 'success' : ''}`}
              onClick={handleCopyConfig}
              title="复制配置JSON"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button 
              className="close-button"
              onClick={onClose}
              title="关闭"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="sidebar-content custom-scrollbar">
          <CommonConfigPanel
            config={commonConfig}
            onConfigChange={onConfigChange}
          />
        </div>
        <div className="sidebar-footer">
          <button className="primary-button" onClick={onClose}>
            完成配置
          </button>
        </div>
      </div>
    </>
  )
}

export default ConfigSidebar
