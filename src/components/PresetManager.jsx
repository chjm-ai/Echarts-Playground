import React, { useState, useEffect, useRef } from 'react'
import { Save, Trash2, X, Download, Upload, Edit2, Copy } from 'lucide-react'
import { getAllPresets, savePreset, updatePreset, loadPreset, deletePreset, exportPreset, importPreset, isDefaultPreset, isPresetNameDuplicate, saveCurrentPresetId } from '../utils/presetManager'
import { comparePresetConfigs } from '../utils/configCompare'
import './PresetManager.css'

function PresetManager({ 
  currentTheme, 
  commonConfig, 
  chartConfigs, 
  layout,
  currentPresetId, // 从父组件接收当前方案ID
  onLoadPreset,
  onPresetIdChange // 通知父组件更新方案ID
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [presets, setPresets] = useState([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importJson, setImportJson] = useState('')
  const [nameError, setNameError] = useState('')
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [renamingPresetId, setRenamingPresetId] = useState(null)
  const [renameName, setRenameName] = useState('')
  const [renameError, setRenameError] = useState('')
  const [originalPresetConfig, setOriginalPresetConfig] = useState(null) // 已加载方案的原始配置快照
  const dropdownRef = useRef(null)

  // 加载方案列表
  useEffect(() => {
    if (isOpen) {
      setPresets(getAllPresets())
    }
  }, [isOpen])

  // 当 currentPresetId 变化时，恢复原始配置快照（防止组件重新挂载时丢失）
  useEffect(() => {
    if (currentPresetId && !isDefaultPreset(currentPresetId)) {
      const preset = loadPreset(currentPresetId)
      if (preset) {
        // 只有当 originalPresetConfig 为空或与当前方案不匹配时才更新
        // 避免在用户修改配置后，因为 currentPresetId 变化而覆盖原始快照
        const newOriginalConfig = {
          theme: preset.theme,
          commonConfig: preset.commonConfig,
          chartConfigs: preset.chartConfigs,
          layout: preset.layout
        }
        
        // 如果 originalPresetConfig 为空，或者当前配置与原始配置相同，则更新
        // 这样可以处理页面刷新后恢复的情况
        if (!originalPresetConfig) {
          setOriginalPresetConfig(newOriginalConfig)
        } else {
          // 检查当前配置是否与原始配置相同（说明没有未保存的修改）
          const currentConfig = {
            theme: currentTheme,
            commonConfig,
            chartConfigs,
            layout
          }
          if (comparePresetConfigs(newOriginalConfig, currentConfig)) {
            // 如果相同，说明配置已经同步，可以更新原始快照
            setOriginalPresetConfig(newOriginalConfig)
          }
        }
      }
    } else if (!currentPresetId) {
      // 如果没有当前方案，清除原始配置快照
      setOriginalPresetConfig(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPresetId]) // 当 currentPresetId 变化时，重新加载原始配置快照

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

  // 检测配置是否被修改
  const hasUnsavedChanges = () => {
    if (!currentPresetId || isDefaultPreset(currentPresetId) || !originalPresetConfig) {
      return false
    }
    
    const currentConfig = {
      theme: currentTheme,
      commonConfig,
      chartConfigs,
      layout
    }
    
    return !comparePresetConfigs(originalPresetConfig, currentConfig)
  }

  // 快速保存当前方案（无弹窗）
  const handleQuickSave = () => {
    if (!currentPresetId || isDefaultPreset(currentPresetId)) {
      // 如果没有当前方案或是默认方案，打开保存对话框
      handleOpenSaveDialog()
      return
    }

    // 获取当前方案信息
    const currentPreset = loadPreset(currentPresetId)
    if (!currentPreset) {
      alert('当前方案不存在，请重新加载')
      return
    }

    try {
      const success = updatePreset(currentPresetId, currentPreset.name, {
        theme: currentTheme,
        commonConfig,
        chartConfigs,
        layout
      })

      if (success) {
        // 更新原始配置快照
        setOriginalPresetConfig({
          theme: currentTheme,
          commonConfig,
          chartConfigs,
          layout
        })
        setPresets(getAllPresets())
        // 保存当前方案ID到 localStorage
        saveCurrentPresetId(currentPresetId)
      }
    } catch (error) {
      console.error('方案保存失败:', error)
    }
  }

  // 打开保存对话框
  const handleOpenSaveDialog = () => {
    // 如果当前有加载的方案且不是默认方案，自动填充名称
    if (currentPresetId && !isDefaultPreset(currentPresetId)) {
      const currentPreset = loadPreset(currentPresetId)
      setPresetName(currentPreset ? currentPreset.name : '')
    } else {
      setPresetName('')
    }
    setNameError('')
    setShowSaveDialog(true)
  }

  // 复制方案
  const handleCopyPreset = (presetId, e) => {
    e.stopPropagation()
    const preset = loadPreset(presetId)
    if (!preset) {
      alert('方案不存在')
      return
    }

    // 生成新名称（原名称 + 时间戳）
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    let newName = `${preset.name} (副本 ${timestamp})`
    
    // 如果名称重复，继续添加时间戳
    let counter = 1
    while (isPresetNameDuplicate(newName)) {
      newName = `${preset.name} (副本 ${timestamp} ${counter})`
      counter++
    }

    try {
      const newId = savePreset(newName, {
        theme: preset.theme,
        commonConfig: preset.commonConfig,
        chartConfigs: preset.chartConfigs,
        layout: preset.layout
      })

      if (newId) {
        setPresets(getAllPresets())
      }
    } catch (error) {
      console.error('方案复制失败:', error)
    }
  }

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
      let savedPresetId = currentPresetId
      
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
          savedPresetId = id
          onPresetIdChange?.(id) // 通知父组件更新当前方案ID
          success = true
        }
      }

      if (success) {
        // 更新原始配置快照
        setOriginalPresetConfig({
          theme: currentTheme,
          commonConfig,
          chartConfigs,
          layout
        })
        setPresets(getAllPresets())
        setShowSaveDialog(false)
        setPresetName('')
        setNameError('')
        // 保存当前方案ID到 localStorage
        if (savedPresetId) {
          saveCurrentPresetId(savedPresetId)
        }
      }
    } catch (error) {
      setNameError(error.message || (isUpdate ? '方案更新失败，请重试' : '方案保存失败，请重试'))
    }
  }

  // 加载方案
  const handleLoad = (presetId) => {
    const preset = loadPreset(presetId)
    if (preset) {
      onPresetIdChange?.(presetId) // 通知父组件更新当前方案ID
      // 保存当前方案ID到 localStorage
      saveCurrentPresetId(presetId)
      // 保存原始配置快照
      setOriginalPresetConfig({
        theme: preset.theme,
        commonConfig: preset.commonConfig,
        chartConfigs: preset.chartConfigs,
        layout: preset.layout
      })
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
          // 如果删除的是当前方案，清除当前方案ID和原始配置快照
          if (currentPresetId === presetId) {
            onPresetIdChange?.(null) // 通知父组件清除当前方案ID
            saveCurrentPresetId(null) // 清除 localStorage 中的当前方案ID
            setOriginalPresetConfig(null)
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
                className={`preset-action-button ${hasUnsavedChanges() ? 'has-changes' : ''}`}
                onClick={handleQuickSave}
                title="保存方案"
              >
                <Save size={16} />
                <span>保存方案</span>
                {hasUnsavedChanges() && (
                  <span className="unsaved-indicator" title="有未保存的修改"></span>
                )}
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
                    <button
                      className="preset-item-action"
                      onClick={(e) => handleCopyPreset(preset.id, e)}
                      title="复制方案"
                    >
                      <Copy size={14} />
                    </button>
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

