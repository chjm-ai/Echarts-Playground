import React, { useState, useEffect, useRef } from 'react'
import { Save, Trash2, X, Plus, Download, Upload, Edit2 } from 'lucide-react'
import { getAllPresets, savePreset, updatePreset, loadPreset, deletePreset, exportPreset, importPreset, isDefaultPreset, isPresetNameDuplicate } from '../utils/presetManager'
import './PresetManager.css'

function PresetManager({ 
  currentTheme, 
  commonConfig, 
  chartConfigs, 
  layout,
  onLoadPreset 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [presets, setPresets] = useState([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [currentPresetId, setCurrentPresetId] = useState(null) // 当前加载的方案ID
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importJson, setImportJson] = useState('')
  const [nameError, setNameError] = useState('')
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [renamingPresetId, setRenamingPresetId] = useState(null)
  const [renameName, setRenameName] = useState('')
  const [renameError, setRenameError] = useState('')
  const dropdownRef = useRef(null)

  // 加载方案列表
  useEffect(() => {
    if (isOpen) {
      setPresets(getAllPresets())
    }
  }, [isOpen])

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // 保存当前配置为方案
  const handleSave = (isUpdate = false) => {
    const trimmedName = presetName.trim()
    
    if (!trimmedName) {
      setNameError('请输入方案名称')
      return
    }

    // 检查名称重复
    const excludeId = isUpdate ? currentPresetId : null
    if (isPresetNameDuplicate(trimmedName, excludeId)) {
      setNameError('方案名称已存在，请使用其他名称')
      return
    }

    setNameError('')

    try {
      let success = false
      if (isUpdate && currentPresetId) {
        // 更新当前方案
        success = updatePreset(currentPresetId, trimmedName, {
          theme: currentTheme,
          commonConfig,
          chartConfigs,
          layout
        })
      } else {
        // 保存为新方案
        const id = savePreset(trimmedName, {
          theme: currentTheme,
          commonConfig,
          chartConfigs,
          layout
        })
        if (id) {
          setCurrentPresetId(id) // 保存后设置为当前方案
          success = true
        }
      }

      if (success) {
        setPresets(getAllPresets())
        setShowSaveDialog(false)
        setPresetName('')
        setNameError('')
        alert(isUpdate ? '方案更新成功！' : '方案保存成功！')
      } else {
        alert(isUpdate ? '方案更新失败，请重试' : '方案保存失败，请重试')
      }
    } catch (error) {
      setNameError(error.message || (isUpdate ? '方案更新失败，请重试' : '方案保存失败，请重试'))
    }
  }

  // 加载方案
  const handleLoad = (presetId) => {
    const preset = loadPreset(presetId)
    if (preset) {
      setCurrentPresetId(presetId) // 记录当前加载的方案ID
      onLoadPreset(preset)
      setIsOpen(false)
    } else {
      alert('方案加载失败，请重试')
    }
  }

  // 删除方案
  const handleDelete = (presetId, e) => {
    e.stopPropagation()
    
    // 不允许删除默认方案
    if (isDefaultPreset(presetId)) {
      alert('默认方案不可删除')
      return
    }
    
    if (window.confirm('确定要删除这个方案吗？')) {
      try {
        if (deletePreset(presetId)) {
          // 如果删除的是当前方案，清除当前方案ID
          if (currentPresetId === presetId) {
            setCurrentPresetId(null)
          }
          setPresets(getAllPresets())
          alert('方案已删除')
        } else {
          alert('删除失败，请重试')
        }
      } catch (error) {
        alert(error.message || '删除失败，请重试')
      }
    }
  }

  // 导出方案
  const handleExport = (presetId, e) => {
    e.stopPropagation()
    const json = exportPreset(presetId)
    if (json) {
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `preset_${presetId}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      alert('方案已导出')
    }
  }

  // 导入方案
  const handleImport = () => {
    try {
      const id = importPreset(importJson)
      if (id) {
        setPresets(getAllPresets())
        setShowImportDialog(false)
        setImportJson('')
        alert('方案导入成功！')
      } else {
        alert('方案导入失败，请检查JSON格式')
      }
    } catch (error) {
      alert('方案导入失败：' + (error.message || '请检查JSON格式'))
    }
  }

  // 打开重命名对话框
  const handleOpenRename = (presetId, e) => {
    e.stopPropagation()
    if (isDefaultPreset(presetId)) {
      alert('默认方案不可重命名')
      return
    }
    const preset = loadPreset(presetId)
    if (preset) {
      setRenamingPresetId(presetId)
      setRenameName(preset.name)
      setRenameError('')
      setShowRenameDialog(true)
    }
  }

  // 重命名方案
  const handleRename = () => {
    const trimmedName = renameName.trim()
    
    if (!trimmedName) {
      setRenameError('请输入方案名称')
      return
    }

    // 检查名称重复（排除当前方案）
    if (isPresetNameDuplicate(trimmedName, renamingPresetId)) {
      setRenameError('方案名称已存在，请使用其他名称')
      return
    }

    setRenameError('')

    try {
      // 获取当前方案数据
      const preset = loadPreset(renamingPresetId)
      if (!preset) {
        setRenameError('方案不存在')
        return
      }

      // 更新方案名称
      const success = updatePreset(renamingPresetId, trimmedName, {
        theme: preset.theme,
        commonConfig: preset.commonConfig,
        chartConfigs: preset.chartConfigs,
        layout: preset.layout
      })

      if (success) {
        setPresets(getAllPresets())
        setShowRenameDialog(false)
        setRenameName('')
        setRenameError('')
        setRenamingPresetId(null)
        alert('重命名成功！')
      } else {
        setRenameError('重命名失败，请重试')
      }
    } catch (error) {
      setRenameError(error.message || '重命名失败，请重试')
    }
  }

  return (
    <div className="preset-manager" ref={dropdownRef}>
      <button
        className="preset-manager-button"
        onClick={() => setIsOpen(!isOpen)}
        title="方案管理"
      >
        <Save size={18} />
        <span>方案管理</span>
        <svg
          className={`preset-manager-arrow ${isOpen ? 'open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="preset-manager-dropdown">
          <div className="preset-manager-header">
            <h3>配置方案</h3>
            <div className="preset-manager-actions">
              <button
                className="preset-action-button"
                onClick={() => {
                  // 如果当前有加载的方案且不是默认方案，自动填充名称
                  if (currentPresetId && !isDefaultPreset(currentPresetId)) {
                    const currentPreset = loadPreset(currentPresetId)
                    setPresetName(currentPreset ? currentPreset.name : '')
                  } else {
                    setPresetName('')
                  }
                  setNameError('')
                  setShowSaveDialog(true)
                }}
                title="保存当前配置"
              >
                <Save size={16} />
                <span>保存方案</span>
              </button>
              <button
                className="preset-action-button"
                onClick={() => {
                  setShowImportDialog(true)
                  setImportJson('')
                }}
                title="导入方案"
              >
                <Upload size={16} />
                <span>导入</span>
              </button>
            </div>
          </div>

          <div className="preset-manager-list">
            {presets.length === 0 ? (
              <div className="preset-empty">
                <p>暂无保存的方案</p>
                <p className="preset-empty-hint">点击"保存方案"保存当前配置</p>
              </div>
            ) : (
              presets.map((preset) => (
                <div
                  key={preset.id}
                  className={`preset-item ${currentPresetId === preset.id ? 'current' : ''}`}
                  data-default={isDefaultPreset(preset.id) ? 'true' : 'false'}
                  onClick={() => handleLoad(preset.id)}
                >
                  <div className="preset-item-info">
                    <div className="preset-item-name">
                      {preset.name}
                      {currentPresetId === preset.id && (
                        <span className="preset-current-badge">当前方案</span>
                      )}
                    </div>
                    <div className="preset-item-meta">
                      {new Date(preset.createdAt).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="preset-item-actions" onClick={(e) => e.stopPropagation()}>
                    {!isDefaultPreset(preset.id) && (
                      <button
                        className="preset-item-action"
                        onClick={(e) => handleOpenRename(preset.id, e)}
                        title="重命名"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    <button
                      className="preset-item-action"
                      onClick={(e) => handleExport(preset.id, e)}
                      title="导出方案"
                    >
                      <Download size={14} />
                    </button>
                    {!isDefaultPreset(preset.id) && (
                      <button
                        className="preset-item-action danger"
                        onClick={(e) => handleDelete(preset.id, e)}
                        title="删除方案"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 保存方案对话框 */}
      {showSaveDialog && (
        <div className="preset-dialog-overlay" onClick={() => {
          setShowSaveDialog(false)
          setPresetName('')
          setNameError('')
        }}>
          <div className="preset-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="preset-dialog-header">
              <h3>保存方案</h3>
              <button
                className="preset-dialog-close"
                onClick={() => {
                  setShowSaveDialog(false)
                  setPresetName('')
                  setNameError('')
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="preset-dialog-content">
              {currentPresetId && !isDefaultPreset(currentPresetId) && (
                <div className="preset-dialog-notice">
                  <p>当前已加载方案，可以更新当前方案或保存为新方案</p>
                </div>
              )}
              {currentPresetId && isDefaultPreset(currentPresetId) && (
                <div className="preset-dialog-notice">
                  <p>当前已加载默认方案，只能保存为新方案（默认方案不可编辑）</p>
                </div>
              )}
              <div className="preset-dialog-form-item">
                <label>方案名称</label>
                <input
                  type="text"
                  className={`preset-dialog-input ${nameError ? 'error' : ''}`}
                  value={presetName}
                  onChange={(e) => {
                    setPresetName(e.target.value)
                    // 清除错误提示
                    if (nameError) {
                      setNameError('')
                    }
                  }}
                  placeholder="请输入方案名称"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (currentPresetId && !isDefaultPreset(currentPresetId)) {
                        handleSave(true) // 更新当前方案
                      } else {
                        handleSave(false) // 保存为新方案
                      }
                    }
                  }}
                />
                {nameError && (
                  <div className="preset-dialog-error">{nameError}</div>
                )}
              </div>
              <div className="preset-dialog-hint">
                <p>将保存以下配置：</p>
                <ul>
                  <li>当前主题配色</li>
                  <li>通用配置（Tooltip、Legend、Grid、Axis、Title）</li>
                  <li>所有图表的独立配置</li>
                  <li>布局配置</li>
                </ul>
              </div>
            </div>
            <div className="preset-dialog-footer">
              <button
                className="preset-dialog-button secondary"
                onClick={() => {
                  setShowSaveDialog(false)
                  setPresetName('')
                  setNameError('')
                }}
              >
                取消
              </button>
              {currentPresetId && !isDefaultPreset(currentPresetId) ? (
                <>
                  <button
                    className="preset-dialog-button secondary"
                    onClick={() => handleSave(false)}
                  >
                    保存为新方案
                  </button>
                  <button
                    className="preset-dialog-button primary"
                    onClick={() => handleSave(true)}
                  >
                    更新当前方案
                  </button>
                </>
              ) : (
                <button
                  className="preset-dialog-button primary"
                  onClick={() => handleSave(false)}
                >
                  保存
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 重命名方案对话框 */}
      {showRenameDialog && (
        <div className="preset-dialog-overlay" onClick={() => {
          setShowRenameDialog(false)
          setRenameName('')
          setRenameError('')
          setRenamingPresetId(null)
        }}>
          <div className="preset-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="preset-dialog-header">
              <h3>重命名方案</h3>
              <button
                className="preset-dialog-close"
                onClick={() => {
                  setShowRenameDialog(false)
                  setRenameName('')
                  setRenameError('')
                  setRenamingPresetId(null)
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="preset-dialog-content">
              <div className="preset-dialog-form-item">
                <label>方案名称</label>
                <input
                  type="text"
                  className={`preset-dialog-input ${renameError ? 'error' : ''}`}
                  value={renameName}
                  onChange={(e) => {
                    setRenameName(e.target.value)
                    // 清除错误提示
                    if (renameError) {
                      setRenameError('')
                    }
                  }}
                  placeholder="请输入方案名称"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRename()
                    }
                  }}
                />
                {renameError && (
                  <div className="preset-dialog-error">{renameError}</div>
                )}
              </div>
            </div>
            <div className="preset-dialog-footer">
              <button
                className="preset-dialog-button secondary"
                onClick={() => {
                  setShowRenameDialog(false)
                  setRenameName('')
                  setRenameError('')
                  setRenamingPresetId(null)
                }}
              >
                取消
              </button>
              <button
                className="preset-dialog-button primary"
                onClick={handleRename}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 导入方案对话框 */}
      {showImportDialog && (
        <div className="preset-dialog-overlay" onClick={() => setShowImportDialog(false)}>
          <div className="preset-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="preset-dialog-header">
              <h3>导入方案</h3>
              <button
                className="preset-dialog-close"
                onClick={() => setShowImportDialog(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="preset-dialog-content">
              <div className="preset-dialog-form-item">
                <label>方案JSON</label>
                <textarea
                  className="preset-dialog-textarea"
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="粘贴方案的JSON内容..."
                  rows={10}
                />
              </div>
            </div>
            <div className="preset-dialog-footer">
              <button
                className="preset-dialog-button secondary"
                onClick={() => setShowImportDialog(false)}
              >
                取消
              </button>
              <button
                className="preset-dialog-button primary"
                onClick={handleImport}
              >
                导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PresetManager

