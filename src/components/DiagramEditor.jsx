import { useRef, useState } from 'react'
import {
  createEmptyDiagram,
  DiagramObject,
  getObjectLabel,
  getObjectTypeLabel,
  normaliseDiagram,
  pitchLayouts,
  PitchLines,
} from './DiagramPreview.jsx'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function createObjectId(type) {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `${type}-${Date.now()}`
}

function getPointFromEvent(event, svgElement) {
  const rect = svgElement.getBoundingClientRect()

  return {
    x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
    y: clamp(((event.clientY - rect.top) / rect.height) * 60, 0, 60),
  }
}

function getNextPlayerNumber(type, objects) {
  const playerNumbers = objects
    .filter((object) => object.type === type)
    .map((object) => Number(object.number || String(object.label || '').replace(/\D/g, '')))
    .filter((number) => Number.isFinite(number))

  return playerNumbers.length > 0 ? Math.max(...playerNumbers) + 1 : 1
}

function getPlayerPrefix(type) {
  return {
    homePlayer: 'H',
    awayPlayer: 'A',
    neutralPlayer: 'N',
  }[type]
}

function createDiagramObject(type, objects) {
  const baseX = clamp(18 + objects.length * 4, 6, 82)
  const baseY = clamp(18 + objects.length * 3, 6, 50)
  const baseObject = {
    id: createObjectId(type),
    type,
    x: baseX,
    y: baseY,
  }

  if (type === 'homePlayer' || type === 'awayPlayer' || type === 'neutralPlayer') {
    const number = getNextPlayerNumber(type, objects)
    const prefix = getPlayerPrefix(type)

    return {
      ...baseObject,
      number: String(number),
      label: `${prefix}${number}`,
      size: 4.2,
    }
  }

  if (type === 'ball') {
    return {
      ...baseObject,
      size: 3.2,
    }
  }

  if (type === 'cone') {
    return {
      ...baseObject,
      size: 4.2,
    }
  }

  if (type === 'miniGoal') {
    return {
      ...baseObject,
      size: 11,
      rotation: 0,
    }
  }

  if (type === 'area') {
    return {
      ...baseObject,
      width: 24,
      height: 14,
      label: '',
    }
  }

  if (type === 'arrow' || type === 'line') {
    return {
      id: createObjectId(type),
      type,
      startX: baseX,
      startY: baseY,
      endX: clamp(baseX + 18, 4, 96),
      endY: clamp(baseY - 8, 4, 56),
      lineStyle: 'solid',
      colour: '#101820',
      width: 1.2,
    }
  }

  return baseObject
}

function getLineGeometry(object) {
  const dx = object.endX - object.startX
  const dy = object.endY - object.startY
  const length = Math.max(Math.sqrt(dx * dx + dy * dy), 2)
  const angle = Math.atan2(dy, dx)
  const centerX = (object.startX + object.endX) / 2
  const centerY = (object.startY + object.endY) / 2

  return { angle, centerX, centerY, dx, dy, length }
}

function transformLine(object, options) {
  const { angle, centerX, centerY, length } = getLineGeometry(object)
  const nextAngle = angle + ((options.rotateDegrees || 0) * Math.PI) / 180
  const nextLength = clamp(length + (options.lengthDelta || 0), 4, 80)
  const dx = Math.cos(nextAngle) * nextLength * 0.5
  const dy = Math.sin(nextAngle) * nextLength * 0.5

  return {
    ...object,
    startX: clamp(centerX - dx, 0, 100),
    startY: clamp(centerY - dy, 0, 60),
    endX: clamp(centerX + dx, 0, 100),
    endY: clamp(centerY + dy, 0, 60),
  }
}

function DiagramEditor({ activityName, diagram, onCancel, onSave }) {
  const [workingDiagram, setWorkingDiagram] = useState(() =>
    normaliseDiagram(diagram, `${activityName} diagram`),
  )
  const [selectedObjectId, setSelectedObjectId] = useState(null)
  const svgRef = useRef(null)
  const dragRef = useRef(null)
  const selectedObject = workingDiagram.objects.find((object) => object.id === selectedObjectId)

  function addObject(type) {
    setWorkingDiagram((currentDiagram) => {
      const nextObject = createDiagramObject(type, currentDiagram.objects)
      setSelectedObjectId(nextObject.id)

      return {
        ...currentDiagram,
        objects: [...currentDiagram.objects, nextObject],
      }
    })
  }

  function updateSelectedObject(updater) {
    if (!selectedObjectId) {
      return
    }

    setWorkingDiagram((currentDiagram) => ({
      ...currentDiagram,
      objects: currentDiagram.objects.map((object) =>
        object.id === selectedObjectId ? updater(object) : object,
      ),
    }))
  }

  function deleteSelectedObject() {
    if (!selectedObjectId) {
      return
    }

    setWorkingDiagram((currentDiagram) => ({
      ...currentDiagram,
      objects: currentDiagram.objects.filter((object) => object.id !== selectedObjectId),
    }))
    setSelectedObjectId(null)
  }

  function duplicateSelectedObject() {
    if (!selectedObject) {
      return
    }

    const duplicate = {
      ...selectedObject,
      id: createObjectId(selectedObject.type),
    }

    if (duplicate.type === 'arrow' || duplicate.type === 'line') {
      duplicate.startX = clamp(duplicate.startX + 4, 0, 100)
      duplicate.startY = clamp(duplicate.startY + 4, 0, 60)
      duplicate.endX = clamp(duplicate.endX + 4, 0, 100)
      duplicate.endY = clamp(duplicate.endY + 4, 0, 60)
    } else {
      duplicate.x = clamp(duplicate.x + 4, 0, 96)
      duplicate.y = clamp(duplicate.y + 4, 0, 56)
    }

    setWorkingDiagram((currentDiagram) => ({
      ...currentDiagram,
      objects: [...currentDiagram.objects, duplicate],
    }))
    setSelectedObjectId(duplicate.id)
  }

  function clearDiagram() {
    setWorkingDiagram((currentDiagram) => ({
      ...currentDiagram,
      objects: [],
    }))
    setSelectedObjectId(null)
  }

  function updateNotes(event) {
    setWorkingDiagram((currentDiagram) => ({
      ...currentDiagram,
      notes: event.target.value,
    }))
  }

  function updatePitchLayout(event) {
    setWorkingDiagram((currentDiagram) => ({
      ...currentDiagram,
      pitchLayout: event.target.value,
    }))
  }

  function startDrag(event, objectId, mode = 'move') {
    event.preventDefault()
    event.stopPropagation()

    const svgElement = svgRef.current
    const selectedDiagramObject = workingDiagram.objects.find((object) => object.id === objectId)

    if (!svgElement || !selectedDiagramObject) {
      return
    }

    const point = getPointFromEvent(event, svgElement)
    setSelectedObjectId(objectId)

    if ((selectedDiagramObject.type === 'arrow' || selectedDiagramObject.type === 'line') && mode === 'move') {
      dragRef.current = {
        mode,
        objectId,
        offsetX: point.x - selectedDiagramObject.startX,
        offsetY: point.y - selectedDiagramObject.startY,
        lineDx: selectedDiagramObject.endX - selectedDiagramObject.startX,
        lineDy: selectedDiagramObject.endY - selectedDiagramObject.startY,
      }
    } else if (mode === 'start' || mode === 'end') {
      dragRef.current = { mode, objectId }
    } else {
      dragRef.current = {
        mode,
        objectId,
        offsetX: point.x - selectedDiagramObject.x,
        offsetY: point.y - selectedDiagramObject.y,
      }
    }

    svgElement.setPointerCapture(event.pointerId)
  }

  function moveSelectedObject(event) {
    if (!dragRef.current || !svgRef.current) {
      return
    }

    const point = getPointFromEvent(event, svgRef.current)
    const { lineDx, lineDy, mode, objectId, offsetX = 0, offsetY = 0 } = dragRef.current

    setWorkingDiagram((currentDiagram) => ({
      ...currentDiagram,
      objects: currentDiagram.objects.map((object) => {
        if (object.id !== objectId) {
          return object
        }

        if ((object.type === 'arrow' || object.type === 'line') && mode === 'start') {
          return {
            ...object,
            startX: clamp(point.x, 0, 100),
            startY: clamp(point.y, 0, 60),
          }
        }

        if ((object.type === 'arrow' || object.type === 'line') && mode === 'end') {
          return {
            ...object,
            endX: clamp(point.x, 0, 100),
            endY: clamp(point.y, 0, 60),
          }
        }

        if (object.type === 'arrow' || object.type === 'line') {
          const nextStartX = clamp(point.x - offsetX, 0, 100)
          const nextStartY = clamp(point.y - offsetY, 0, 60)

          return {
            ...object,
            startX: nextStartX,
            startY: nextStartY,
            endX: clamp(nextStartX + lineDx, 0, 100),
            endY: clamp(nextStartY + lineDy, 0, 60),
          }
        }

        const maxX = object.type === 'area' ? 98 - (object.width || 24) : 98
        const maxY = object.type === 'area' ? 58 - (object.height || 14) : 58

        return {
          ...object,
          x: clamp(point.x - offsetX, 2, maxX),
          y: clamp(point.y - offsetY, 2, maxY),
        }
      }),
    }))
  }

  function stopDrag() {
    dragRef.current = null
  }

  function changeSize(delta) {
    updateSelectedObject((object) => ({
      ...object,
      size: clamp((object.size || 4) + delta, 1.5, 22),
    }))
  }

  function resizeArea(widthDelta, heightDelta) {
    updateSelectedObject((object) => ({
      ...object,
      width: clamp((object.width || 24) + widthDelta, 6, 80),
      height: clamp((object.height || 14) + heightDelta, 5, 50),
    }))
  }

  function changePlayerNumber(event) {
    const number = event.target.value

    updateSelectedObject((object) => ({
      ...object,
      number,
      label: `${getPlayerPrefix(object.type)}${number}`,
    }))
  }

  function changePlayerType(event) {
    const nextType = event.target.value

    updateSelectedObject((object) => ({
      ...object,
      type: nextType,
      label: `${getPlayerPrefix(nextType)}${object.number || '1'}`,
    }))
  }

  function toggleLineStyle() {
    updateSelectedObject((object) => ({
      ...object,
      lineStyle: object.lineStyle === 'dashed' ? 'solid' : 'dashed',
    }))
  }

  function saveDiagram() {
    onSave(
      normaliseDiagram(
        {
          ...createEmptyDiagram(`${activityName} diagram`),
          ...workingDiagram,
          title: workingDiagram.title || `${activityName} diagram`,
        },
        `${activityName} diagram`,
      ),
    )
  }

  return (
    <div className="diagram-editor-panel">
      <div className="diagram-editor-heading">
        <div>
          <p className="section-kicker">Activity Diagram</p>
          <h4>{activityName}</h4>
          <p>Create a static setup for this activity. Select an object, drag it, then save the diagram.</p>
        </div>
      </div>

      <label className="diagram-layout-field">
        Pitch layout
        <select value={workingDiagram.pitchLayout} onChange={updatePitchLayout}>
          {pitchLayouts.map((layout) => (
            <option key={layout.value} value={layout.value}>
              {layout.label}
            </option>
          ))}
        </select>
      </label>

      <div className="diagram-toolbar">
        <button type="button" onClick={() => addObject('homePlayer')}>
          Add Home Player
        </button>
        <button type="button" onClick={() => addObject('awayPlayer')}>
          Add Away Player
        </button>
        <button type="button" onClick={() => addObject('neutralPlayer')}>
          Add Neutral Player
        </button>
        <button type="button" onClick={() => addObject('ball')}>
          Add Ball
        </button>
        <button type="button" onClick={() => addObject('cone')}>
          Add Cone
        </button>
        <button type="button" onClick={() => addObject('miniGoal')}>
          Add Mini Goal
        </button>
        <button type="button" onClick={() => addObject('arrow')}>
          Add Arrow
        </button>
        <button type="button" onClick={() => addObject('line')}>
          Add Line
        </button>
        <button type="button" onClick={() => addObject('area')}>
          Add Area / Zone
        </button>
        <button type="button" onClick={clearDiagram}>
          Clear Diagram
        </button>
      </div>

      <svg
        className="diagram-pitch diagram-editor-pitch"
        onPointerLeave={stopDrag}
        onPointerMove={moveSelectedObject}
        onPointerUp={stopDrag}
        onPointerDown={() => setSelectedObjectId(null)}
        ref={svgRef}
        viewBox="0 0 100 60"
        role="img"
      >
        <defs>
          <marker
            id="diagram-arrow-head"
            markerHeight="4"
            markerWidth="4"
            orient="auto"
            refX="3.5"
            refY="2"
          >
            <path d="M 0 0 L 4 2 L 0 4 Z" />
          </marker>
        </defs>
        <PitchLines layout={workingDiagram.pitchLayout} />
        {workingDiagram.objects.map((object) => (
          <DiagramObject
            key={object.id}
            object={object}
            onHandlePointerDown={startDrag}
            onPointerDown={startDrag}
            selected={object.id === selectedObjectId}
            showHandles
          />
        ))}
      </svg>

      <SelectedObjectControls
        object={selectedObject}
        onChangeNumber={changePlayerNumber}
        onChangePlayerType={changePlayerType}
        onDelete={deleteSelectedObject}
        onDuplicate={duplicateSelectedObject}
        onLineLength={(delta) => updateSelectedObject((object) => transformLine(object, { lengthDelta: delta }))}
        onLineRotate={(degrees) => updateSelectedObject((object) => transformLine(object, { rotateDegrees: degrees }))}
        onResizeArea={resizeArea}
        onRotateGoal={() => updateSelectedObject((object) => ({ ...object, rotation: ((object.rotation || 0) + 90) % 360 }))}
        onSizeChange={changeSize}
        onToggleLineStyle={toggleLineStyle}
      />

      <label className="diagram-notes-field">
        Diagram notes
        <textarea rows="3" value={workingDiagram.notes} onChange={updateNotes} />
      </label>

      <div className="form-actions">
        <button className="primary-button" type="button" onClick={saveDiagram}>
          Save Diagram
        </button>
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

function SelectedObjectControls({
  object,
  onChangeNumber,
  onChangePlayerType,
  onDelete,
  onDuplicate,
  onLineLength,
  onLineRotate,
  onResizeArea,
  onRotateGoal,
  onSizeChange,
  onToggleLineStyle,
}) {
  if (!object) {
    return (
      <section className="selected-object-panel muted">
        <p className="section-kicker">Selected Object Controls</p>
        <p>Select an object on the pitch to edit it.</p>
      </section>
    )
  }

  const isPlayer = object.type === 'homePlayer' || object.type === 'awayPlayer' || object.type === 'neutralPlayer'
  const canResize = isPlayer || object.type === 'ball' || object.type === 'cone' || object.type === 'miniGoal'
  const isLine = object.type === 'arrow' || object.type === 'line'

  return (
    <section className="selected-object-panel">
      <div>
        <p className="section-kicker">Selected Object Controls</p>
        <h4>{getObjectTypeLabel(object)}</h4>
        <p>{getObjectLabel(object)}</p>
      </div>

      {isPlayer && (
        <div className="selected-control-grid">
          <label>
            Number
            <input value={object.number || ''} onChange={onChangeNumber} />
          </label>
          <label>
            Player type
            <select value={object.type} onChange={onChangePlayerType}>
              <option value="homePlayer">Home</option>
              <option value="awayPlayer">Away</option>
              <option value="neutralPlayer">Neutral</option>
            </select>
          </label>
        </div>
      )}

      <div className="selected-control-buttons">
        {canResize && (
          <>
            <button type="button" onClick={() => onSizeChange(-0.8)}>
              Size -
            </button>
            <button type="button" onClick={() => onSizeChange(0.8)}>
              Size +
            </button>
          </>
        )}

        {object.type === 'miniGoal' && (
          <button type="button" onClick={onRotateGoal}>
            Rotate Goal
          </button>
        )}

        {isLine && (
          <>
            <button type="button" onClick={onToggleLineStyle}>
              {object.lineStyle === 'dashed' ? 'Solid line' : 'Dashed line'}
            </button>
            <button type="button" onClick={() => onLineRotate(-15)}>
              Rotate Left
            </button>
            <button type="button" onClick={() => onLineRotate(15)}>
              Rotate Right
            </button>
            <button type="button" onClick={() => onLineLength(-5)}>
              Length -
            </button>
            <button type="button" onClick={() => onLineLength(5)}>
              Length +
            </button>
          </>
        )}

        {object.type === 'area' && (
          <>
            <button type="button" onClick={() => onResizeArea(5, 0)}>
              Wider
            </button>
            <button type="button" onClick={() => onResizeArea(-5, 0)}>
              Narrower
            </button>
            <button type="button" onClick={() => onResizeArea(0, 4)}>
              Taller
            </button>
            <button type="button" onClick={() => onResizeArea(0, -4)}>
              Shorter
            </button>
          </>
        )}

        <button type="button" onClick={onDuplicate}>
          Duplicate Selected
        </button>
        <button type="button" onClick={onDelete}>
          Delete Selected
        </button>
      </div>
    </section>
  )
}

export default DiagramEditor
